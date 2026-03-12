import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Header from '../components/layout/Header'
import BottomNavBar from '../components/layout/BottomNavBar'

interface BuddyInfo {
    id: string
    fullName: string
    username: string
    avatarUrl?: string
    bio?: string
}

interface TripExpenseInfo {
    id: string
    name: string
    bannerUrl?: string
    memberCount: number
    totalExpenses: number
    userBalance: number
}

interface TripBasic {
    id: string
    name: string
    bannerUrl?: string
}

export default function ExpensesPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [trips, setTrips] = useState<TripExpenseInfo[]>([])
    const [buddies, setBuddies] = useState<BuddyInfo[]>([])
    const [allTrips, setAllTrips] = useState<TripBasic[]>([])
    const [loading, setLoading] = useState(true)
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
    const [addToTripBuddy, setAddToTripBuddy] = useState<BuddyInfo | null>(null)
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
    const [addingToTrip, setAddingToTrip] = useState(false)
    const [toast, setToast] = useState('')
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [tripsRes, buddiesRes] = await Promise.all([
                    api.get('/api/trips'),
                    api.get('/api/buddies'),
                ])
                const tripsList = tripsRes.data.data || []
                setBuddies(buddiesRes.data.data || [])
                setAllTrips(tripsList.map((t: any) => ({ id: t.id, name: t.name, bannerUrl: t.bannerUrl })))

                // Fetch expense summary for each trip
                const enriched = await Promise.all(tripsList.map(async (trip: any) => {
                    try {
                        const { data: summary } = await api.get(`/api/expenses/summary/${trip.id}`)
                        const myBalance = summary.members?.find((m: any) => m.user?.id === user?.id)
                        return {
                            id: trip.id,
                            name: trip.name,
                            bannerUrl: trip.bannerUrl,
                            memberCount: trip.members?.length || 0,
                            totalExpenses: summary.totalExpenses || 0,
                            userBalance: myBalance?.netBalance || 0,
                        }
                    } catch {
                        return {
                            id: trip.id, name: trip.name, bannerUrl: trip.bannerUrl,
                            memberCount: trip.members?.length || 0,
                            totalExpenses: 0, userBalance: 0,
                        }
                    }
                }))
                setTrips(enriched)
            } catch (e) {
                console.error('Failed to fetch data:', e)
            }
            setLoading(false)
        }
        fetchAll()
    }, [user?.id])

    // Close menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpenId(null)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(''), 3000)
    }

    const handleRemoveBuddy = async (buddyId: string) => {
        try {
            await api.delete(`/api/buddies/${buddyId}`)
            setBuddies(prev => prev.filter(b => b.id !== buddyId))
            window.dispatchEvent(new Event('wandrr:stats-changed'))
            showToast('Buddy removed')
        } catch {
            showToast('Failed to remove buddy')
        }
        setMenuOpenId(null)
    }

    const handleAddToTrip = async () => {
        if (!addToTripBuddy || !selectedTripId) return
        setAddingToTrip(true)
        try {
            await api.post(`/api/trips/${selectedTripId}/members`, JSON.stringify(addToTripBuddy.id), {
                headers: { 'Content-Type': 'application/json' }
            })
            showToast(`Added @${addToTripBuddy.username} to trip!`)
            setAddToTripBuddy(null)
            setSelectedTripId(null)
        } catch (e: any) {
            showToast(e.response?.data?.message || 'Failed to add to trip')
        }
        setAddingToTrip(false)
    }

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans relative pb-20">
            <Header />
            <main className="flex-1 px-4 py-6 flex flex-col gap-6 max-w-lg mx-auto w-full">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF6B35]">credit_card</span>
                    Splitter
                </h1>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* MY BUDDIES SECTION */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#FF6B35] text-xl">group</span>
                                My Buddies
                            </h3>

                            {buddies.length === 0 ? (
                                <div className="bg-[#1a2235] rounded-2xl p-8 text-center border border-white/[0.06]">
                                    <span className="text-4xl block mb-3">👥</span>
                                    <p className="text-slate-400 text-sm">No buddies yet.</p>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Use the search icon in the top bar to find people.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2" ref={menuRef}>
                                    {buddies.map(buddy => (
                                        <div
                                            key={buddy.id}
                                            className="relative flex items-center gap-3 p-4 bg-[#1a2235] rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all"
                                        >
                                            <img
                                                src={buddy.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(buddy.fullName)}&background=FF6B35&color=fff`}
                                                className="size-12 rounded-full object-cover border-2 border-white/10 flex-shrink-0"
                                                alt={buddy.fullName}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-semibold text-sm truncate">{buddy.fullName}</p>
                                                <p className="text-[#FF6B35] text-xs font-medium">@{buddy.username}</p>
                                                {buddy.bio && (
                                                    <p className="text-slate-400 text-xs mt-0.5 truncate">{buddy.bio}</p>
                                                )}
                                            </div>

                                            {/* Three-dot menu */}
                                            <div className="relative flex-shrink-0">
                                                <button
                                                    onClick={() => setMenuOpenId(menuOpenId === buddy.id ? null : buddy.id)}
                                                    className="size-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-slate-400 hover:text-white"
                                                >
                                                    <span className="material-symbols-outlined text-lg">more_vert</span>
                                                </button>

                                                {menuOpenId === buddy.id && (
                                                    <div className="absolute right-0 top-10 z-50 w-48 bg-[#252d3d] rounded-xl border border-white/[0.1] shadow-2xl shadow-black/50 overflow-hidden">
                                                        <button
                                                            onClick={() => {
                                                                setMenuOpenId(null)
                                                                setAddToTripBuddy(buddy)
                                                            }}
                                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-white hover:bg-white/[0.06] transition-colors text-left"
                                                        >
                                                            <span className="material-symbols-outlined text-[#FF6B35] text-base">flight_takeoff</span>
                                                            Add to a Trip
                                                        </button>
                                                        <div className="h-px bg-white/[0.06] mx-3" />
                                                        <button
                                                            onClick={() => handleRemoveBuddy(buddy.id)}
                                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                                        >
                                                            <span className="material-symbols-outlined text-red-400 text-base">person_remove</span>
                                                            Remove Buddy
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* EXPENSE SPLITTER SECTION */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#FF6B35] text-xl">account_balance_wallet</span>
                                Expense Splitter
                            </h3>
                            <p className="text-slate-400 text-sm -mt-1">Select a trip to view & manage expenses.</p>

                            {trips.length === 0 ? (
                                <div className="bg-[#1a2235] rounded-2xl p-8 text-center border border-white/[0.06]">
                                    <span className="text-4xl block mb-3">💳</span>
                                    <p className="text-slate-400 text-sm">Create a trip first to start splitting expenses.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {trips.map(trip => (
                                        <div
                                            key={trip.id}
                                            onClick={() => navigate(`/expenses/${trip.id}`)}
                                            className="flex items-center gap-3 p-4 bg-[#1a2235] rounded-2xl border border-white/[0.06] cursor-pointer hover:border-white/20 transition-all group"
                                        >
                                            <img
                                                src={trip.bannerUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&q=60'}
                                                className="size-14 rounded-xl object-cover flex-shrink-0"
                                                alt={trip.name}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold text-sm">{trip.name}</p>
                                                <p className="text-slate-400 text-xs mt-0.5">
                                                    {trip.memberCount} members
                                                </p>
                                                <p className="text-slate-500 text-xs">
                                                    ₹{(trip.totalExpenses || 0).toFixed(2)} total
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className={`text-sm font-bold ${(trip.userBalance || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {(trip.userBalance || 0) >= 0
                                                        ? `+₹${(trip.userBalance || 0).toFixed(2)}`
                                                        : `-₹${Math.abs(trip.userBalance || 0).toFixed(2)}`}
                                                </p>
                                                <p className="text-slate-500 text-[10px] mt-0.5">
                                                    {(trip.userBalance || 0) >= 0 ? 'owed to you' : 'you owe'}
                                                </p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-400 transition-colors text-lg ml-1">
                                                chevron_right
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            {/* Add to Trip Bottom Sheet */}
            {addToTripBuddy && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setAddToTripBuddy(null); setSelectedTripId(null) }} />
                    <div className="relative w-full max-w-lg bg-[#1a2235] rounded-t-3xl p-6 border border-white/[0.08] shadow-2xl z-10">
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full" />
                        <h3 className="text-white font-bold text-lg mb-1 pt-2">Add to a Trip</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Select a trip to add @{addToTripBuddy.username}
                        </p>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {allTrips.length === 0 ? (
                                <p className="text-center text-slate-500 text-sm py-6">No trips yet. Create a trip first.</p>
                            ) : (
                                allTrips.map(trip => (
                                    <div
                                        key={trip.id}
                                        onClick={() => setSelectedTripId(trip.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                                            ${selectedTripId === trip.id
                                                ? 'bg-[#FF6B35]/10 border border-[#FF6B35]/40'
                                                : 'bg-[#0d1117] border border-white/[0.06] hover:border-white/20'}`}
                                    >
                                        <img
                                            src={trip.bannerUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&q=60'}
                                            className="size-10 rounded-lg object-cover"
                                            alt={trip.name}
                                        />
                                        <p className="text-white text-sm font-semibold flex-1">{trip.name}</p>
                                        {selectedTripId === trip.id && (
                                            <span className="material-symbols-outlined text-[#FF6B35] text-sm">check_circle</span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => { setAddToTripBuddy(null); setSelectedTripId(null) }}
                                className="flex-1 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/[0.05] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddToTrip}
                                disabled={!selectedTripId || addingToTrip}
                                className="flex-1 py-3 rounded-xl bg-[#FF6B35] disabled:bg-slate-700 text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors disabled:cursor-not-allowed"
                            >
                                {addingToTrip ? 'Adding...' : 'Add to Trip'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-[#1a2235] border border-white/10 text-white text-sm px-5 py-3 rounded-xl shadow-xl">
                    {toast}
                </div>
            )}

            <BottomNavBar />
        </div>
    )
}
