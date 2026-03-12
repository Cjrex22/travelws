import { useState, useRef, useEffect } from 'react'
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
}

export default function CreateTripPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const bannerInputRef = useRef<HTMLInputElement>(null)
    const photoInputRef = useRef<HTMLInputElement>(null)

    const [tripName, setTripName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [bannerPreview, setBannerPreview] = useState('')
    const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
    const [buddies, setBuddies] = useState<BuddyInfo[]>([])
    const [selectedBuddies, setSelectedBuddies] = useState<string[]>([])
    const [buddySearch, setBuddySearch] = useState('')
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        api.get('/api/buddies').then(({ data }) => {
            if (data.data) setBuddies(data.data)
        }).catch(() => { })
    }, [])

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBannerFile(file)
            setBannerPreview(URL.createObjectURL(file))
        }
    }

    const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const newPhotos = files.slice(0, 12 - photos.length).map(f => ({
            file: f,
            preview: URL.createObjectURL(f)
        }))
        setPhotos(prev => [...prev, ...newPhotos])
    }

    const removePhoto = (i: number) => {
        setPhotos(prev => prev.filter((_, idx) => idx !== i))
    }

    const toggleBuddySelection = (id: string) => {
        setSelectedBuddies(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        )
    }

    const filteredBuddies = buddies.filter(b =>
        b.fullName.toLowerCase().includes(buddySearch.toLowerCase()) ||
        b.username.toLowerCase().includes(buddySearch.toLowerCase())
    )

    const handleCreateTrip = async () => {
        if (!tripName || !startDate || !endDate) return
        setCreating(true)
        try {
            await api.post('/api/trips', {
                name: tripName,
                description: description || null,
                startDate,
                endDate,
                memberIds: selectedBuddies,
            })
            window.dispatchEvent(new Event('wandrr:stats-changed'))
            navigate('/trips')
        } catch (e) {
            console.error('Trip creation failed:', e)
        }
        setCreating(false)
    }

    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans relative pb-24">
            <Header />
            <main className="flex-1 px-4 py-6 flex flex-col gap-6 max-w-lg mx-auto w-full">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF6B35]">rocket_launch</span>
                    Create Trip
                </h1>

                {/* Banner Upload */}
                <div
                    onClick={() => bannerInputRef.current?.click()}
                    className="relative w-full h-52 rounded-2xl overflow-hidden bg-[#1a2235] border-2 border-dashed border-white/20 hover:border-[#FF6B35]/60 transition-all cursor-pointer group"
                >
                    {bannerPreview ? (
                        <>
                            <img src={bannerPreview} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">Change Banner</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 group-hover:text-[#FF6B35] transition-colors">
                            <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                            <span className="text-sm font-medium">Add Trip Banner</span>
                            <span className="text-xs text-slate-500">JPG, PNG up to 10MB</span>
                        </div>
                    )}
                </div>
                <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />

                {/* Trip Name */}
                <div>
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Trip Name *</label>
                    <input
                        value={tripName}
                        onChange={e => setTripName(e.target.value)}
                        placeholder="e.g. Goa Road Trip 2025"
                        maxLength={100}
                        className="w-full px-4 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="What's this trip about?"
                        rows={3}
                        maxLength={500}
                        className="w-full px-4 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none resize-none"
                    />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Start Date *</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            min={today}
                            className="w-full px-4 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white text-sm focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none [color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">End Date *</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            min={startDate || today}
                            className="w-full px-4 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white text-sm focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none [color-scheme:dark]"
                        />
                    </div>
                </div>

                {/* Add Buddies */}
                {buddies.length > 0 && (
                    <div>
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Add Buddies to Trip</label>
                        <div className="relative mb-3">
                            <input
                                value={buddySearch}
                                onChange={e => setBuddySearch(e.target.value)}
                                placeholder="Search your buddies..."
                                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-[#FF6B35] outline-none"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {filteredBuddies.map(buddy => (
                                <div
                                    key={buddy.id}
                                    onClick={() => toggleBuddySelection(buddy.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                                        ${selectedBuddies.includes(buddy.id)
                                            ? 'bg-[#FF6B35]/10 border border-[#FF6B35]/40'
                                            : 'bg-[#0d1117] border border-white/[0.06] hover:border-white/20'}`}
                                >
                                    <img
                                        src={buddy.avatarUrl || `https://ui-avatars.com/api/?name=${buddy.fullName}&background=FF6B35&color=fff`}
                                        className="size-10 rounded-full object-cover"
                                        alt={buddy.fullName}
                                    />
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-semibold">{buddy.fullName}</p>
                                        <p className="text-[#FF6B35] text-xs">@{buddy.username}</p>
                                    </div>
                                    <div className={`size-5 rounded-full border-2 flex items-center justify-center
                                        ${selectedBuddies.includes(buddy.id)
                                            ? 'bg-[#FF6B35] border-[#FF6B35]'
                                            : 'border-white/30'}`}>
                                        {selectedBuddies.includes(buddy.id) && (
                                            <span className="material-symbols-outlined text-white text-xs">check</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photo Gallery */}
                <div>
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Photos</label>
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                                <img src={photo.preview} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removePhoto(i)}
                                    className="absolute top-1 right-1 size-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-white text-xs">close</span>
                                </button>
                            </div>
                        ))}
                        {photos.length < 12 && (
                            <div
                                onClick={() => photoInputRef.current?.click()}
                                className="aspect-square rounded-xl bg-[#1a2235] border-2 border-dashed border-white/20 hover:border-[#FF6B35]/60 cursor-pointer flex items-center justify-center transition-all"
                            >
                                <span className="material-symbols-outlined text-slate-400 text-2xl">add_photo_alternate</span>
                            </div>
                        )}
                    </div>
                    <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosChange} />
                </div>
            </main>

            {/* Sticky Create Button */}
            <div className="fixed bottom-16 left-0 right-0 bg-[#13181f]/95 backdrop-blur-xl border-t border-white/[0.06] p-4 z-40">
                <div className="max-w-lg mx-auto">
                    <button
                        onClick={handleCreateTrip}
                        disabled={!tripName || !startDate || !endDate || creating}
                        className="w-full py-4 bg-[#FF6B35] hover:bg-[#e55a2b] disabled:bg-slate-700 rounded-2xl text-white font-bold text-base transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                        {creating ? (
                            <><span className="material-symbols-outlined animate-spin">progress_activity</span> Creating...</>
                        ) : (
                            <><span className="material-symbols-outlined">rocket_launch</span> Create Trip</>
                        )}
                    </button>
                </div>
            </div>

            <BottomNavBar />
        </div>
    )
}
