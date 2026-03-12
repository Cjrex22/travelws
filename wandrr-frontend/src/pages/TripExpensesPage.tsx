import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Header from '../components/layout/Header'
import BottomNavBar from '../components/layout/BottomNavBar'

interface Expense {
    id: string
    title: string
    description?: string
    totalAmount: number
    paidBy: { id: string; fullName: string; avatarUrl?: string }
    createdAt: string
}

interface MemberBalance {
    user: { id: string; fullName: string; username: string; avatarUrl?: string }
    totalPaid: number
    totalOwed: number
    netBalance: number
}

interface TripMember {
    id: string
    fullName: string
    username: string
    avatarUrl?: string
}

export default function TripExpensesPage() {
    const { tripId } = useParams<{ tripId: string }>()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [tripName, setTripName] = useState('')
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [members, setMembers] = useState<TripMember[]>([])
    const [balances, setBalances] = useState<MemberBalance[]>([])
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [loading, setLoading] = useState(true)

    // Add expense modal state
    const [showAdd, setShowAdd] = useState(false)
    const [expTitle, setExpTitle] = useState('')
    const [expDesc, setExpDesc] = useState('')
    const [expAmount, setExpAmount] = useState('')
    const [splitMembers, setSplitMembers] = useState<string[]>([])
    const [addingExpense, setAddingExpense] = useState(false)

    const fetchData = async () => {
        if (!tripId) return
        try {
            const [tripRes, summaryRes] = await Promise.all([
                api.get(`/api/trips/${tripId}`),
                api.get(`/api/expenses/summary/${tripId}`)
            ])
            const trip = tripRes.data.data
            setTripName(trip.name)
            setMembers(trip.members || [])
            setTotalExpenses(summaryRes.data.totalExpenses || 0)
            setBalances(summaryRes.data.members || [])

            // Fetch individual expenses
            const expRes = await api.get(`/api/expenses/summary/${tripId}`)
            setTotalExpenses(expRes.data.totalExpenses || 0)
        } catch (e) {
            console.error('Failed to fetch trip expenses:', e)
        }
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [tripId])

    const toggleSplit = (id: string) => {
        setSplitMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
    }

    const handleAddExpense = async () => {
        if (!expTitle || !expAmount || splitMembers.length === 0) return
        setAddingExpense(true)
        try {
            await api.post('/api/expenses', {
                tripId,
                title: expTitle,
                description: expDesc || null,
                totalAmount: parseFloat(expAmount),
                splitAmong: splitMembers,
                includeSelf: splitMembers.includes(user?.id || ''),
            })
            setShowAdd(false)
            setExpTitle('')
            setExpDesc('')
            setExpAmount('')
            setSplitMembers([])
            fetchData()
        } catch (e) {
            console.error('Failed to add expense:', e)
        }
        setAddingExpense(false)
    }

    const perPerson = splitMembers.length > 0 && parseFloat(expAmount) > 0
        ? (parseFloat(expAmount) / splitMembers.length).toFixed(2) : '0.00'

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans relative pb-20">
            <Header />
            <main className="flex-1 px-4 py-6 flex flex-col gap-5 max-w-lg mx-auto w-full">
                {/* Back + title */}
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/expenses')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold truncate">{tripName || 'Trip Expenses'}</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Total card */}
                        <div className="bg-gradient-to-br from-[#FF6B35] to-[#ff8e53] rounded-2xl p-5 shadow-xl">
                            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Total Shared Expenses</p>
                            <p className="text-white text-3xl font-black mt-1">₹{totalExpenses.toFixed(2)}</p>
                            <p className="text-white/60 text-xs mt-1">{members.length} members in this trip</p>
                        </div>

                        {/* Member balances */}
                        {balances.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Balances</h3>
                                    <button
                                        onClick={() => navigate(`/expenses/${tripId}/breakdown`)}
                                        className="text-[#FF6B35] text-xs font-semibold hover:text-[#ff8e53]"
                                    >
                                        Full Breakdown →
                                    </button>
                                </div>
                                {balances.map(m => (
                                    <div key={m.user.id} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-white/[0.06]">
                                        <img
                                            src={m.user.avatarUrl || `https://ui-avatars.com/api/?name=${m.user.fullName}&background=FF6B35&color=fff`}
                                            className="size-9 rounded-full object-cover"
                                            alt={m.user.fullName}
                                        />
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-semibold">
                                                {m.user.id === user?.id ? 'You' : m.user.fullName}
                                            </p>
                                            <p className="text-slate-500 text-xs">
                                                Paid: ₹{m.totalPaid.toFixed(2)} · Share: ₹{m.totalOwed.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className={`font-bold text-sm ${m.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {m.netBalance >= 0 ? `+₹${m.netBalance.toFixed(2)}` : `-₹${Math.abs(m.netBalance).toFixed(2)}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add expense button */}
                        <button
                            onClick={() => {
                                setShowAdd(true)
                                if (user?.id) setSplitMembers([user.id])
                            }}
                            className="w-full py-3 bg-[#FF6B35] hover:bg-[#e55a2b] rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add Expense
                        </button>
                    </>
                )}

                {/* Add Expense Modal */}
                {showAdd && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
                        <div className="w-full max-w-lg mx-auto bg-[#1a2235] rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold">Add Expense</h2>
                                <button onClick={() => setShowAdd(false)} className="p-2 rounded-full hover:bg-white/10">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <input
                                value={expTitle}
                                onChange={e => setExpTitle(e.target.value)}
                                placeholder="Expense name (e.g. Hotel, Dinner)"
                                className="w-full px-4 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:border-[#FF6B35]"
                            />

                            <textarea
                                value={expDesc}
                                onChange={e => setExpDesc(e.target.value)}
                                placeholder="Optional description..."
                                rows={2}
                                className="w-full px-4 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:border-[#FF6B35] resize-none"
                            />

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={expAmount}
                                    onChange={e => setExpAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white text-sm outline-none focus:border-[#FF6B35]"
                                />
                            </div>

                            {/* Paid by */}
                            <div className="bg-[#0d1117] p-3 rounded-xl border border-white/[0.06]">
                                <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Paid By</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <img
                                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=FF6B35&color=fff`}
                                        className="size-8 rounded-full object-cover"
                                    />
                                    <p className="text-white font-semibold text-sm">You (paid full amount)</p>
                                    <span className="ml-auto bg-[#FF6B35]/20 text-[#FF6B35] text-[10px] font-bold px-2 py-0.5 rounded-full">OWNER</span>
                                </div>
                            </div>

                            {/* Split among */}
                            <div>
                                <p className="text-white font-semibold text-sm mb-2">Split among:</p>
                                <p className="text-slate-400 text-xs mb-3">Tick the people who share this expense.</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {members.map(member => (
                                        <div
                                            key={member.id}
                                            onClick={() => toggleSplit(member.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                                                ${splitMembers.includes(member.id)
                                                    ? 'bg-[#FF6B35]/10 border border-[#FF6B35]/40'
                                                    : 'bg-[#0d1117] border border-white/[0.06]'}`}
                                        >
                                            <img
                                                src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.fullName}&background=FF6B35&color=fff`}
                                                className="size-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="text-white text-sm font-semibold">{member.id === user?.id ? 'You' : member.fullName}</p>
                                                <p className="text-slate-400 text-xs">@{member.username}</p>
                                            </div>
                                            <div className={`size-5 rounded-full border-2 flex items-center justify-center
                                                ${splitMembers.includes(member.id) ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-white/30'}`}>
                                                {splitMembers.includes(member.id) && (
                                                    <span className="material-symbols-outlined text-white text-xs">check</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Split preview */}
                            {splitMembers.length > 0 && parseFloat(expAmount) > 0 && (
                                <div className="bg-[#0d1117] p-4 rounded-xl border border-white/[0.06]">
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Split Preview</p>
                                    <p className="text-white text-2xl font-black">
                                        ₹{perPerson}
                                        <span className="text-slate-400 text-sm font-normal"> per person</span>
                                    </p>
                                    <p className="text-slate-500 text-xs mt-1">
                                        ₹{expAmount} ÷ {splitMembers.length} {splitMembers.length === 1 ? 'person' : 'people'}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleAddExpense}
                                disabled={!expTitle || !expAmount || splitMembers.length === 0 || addingExpense}
                                className="w-full py-4 bg-[#FF6B35] hover:bg-[#e55a2b] disabled:bg-slate-700 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
                            >
                                {addingExpense ? 'Adding...' : '+ Add Expense'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <BottomNavBar />
        </div>
    )
}
