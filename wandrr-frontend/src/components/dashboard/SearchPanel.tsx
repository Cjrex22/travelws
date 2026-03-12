import { useState, useEffect, useRef } from 'react'
import api from '../../lib/api'

interface SearchResult {
    id: string
    fullName: string
    username: string
    avatarUrl?: string
    bio?: string
}

interface SearchPanelProps {
    isOpen: boolean
    onClose: () => void
}

export default function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const [buddyIds, setBuddyIds] = useState<Set<string>>(new Set())
    const [addingId, setAddingId] = useState<string | null>(null)
    const [toast, setToast] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 200)
            // Load existing buddies
            api.get('/api/buddies').then(({ data }) => {
                if (data.data) {
                    setBuddyIds(new Set(data.data.map((b: any) => b.id)))
                }
            }).catch(() => { })
        } else {
            setSearchQuery('')
            setResults([])
        }
    }, [isOpen])

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (searchQuery.length < 2) {
            setResults([])
            return
        }
        debounceRef.current = setTimeout(async () => {
            setSearching(true)
            try {
                const { data } = await api.get(`/api/user/search?q=${encodeURIComponent(searchQuery)}`)
                setResults(data.data || [])
            } catch { setResults([]) }
            finally { setSearching(false) }
        }, 300)
    }, [searchQuery])

    const handleAddBuddy = async (userId: string, username: string) => {
        setAddingId(userId)
        try {
            await api.post('/api/buddies/add', { buddyUserId: userId })
            setBuddyIds(prev => new Set(prev).add(userId))
            setToast(`@${username} added to your buddies!`)
            window.dispatchEvent(new Event('wandrr:stats-changed'))
            setTimeout(() => setToast(''), 3000)
        } catch (e: any) {
            setToast(e.response?.data?.message || 'Failed to add buddy')
            setTimeout(() => setToast(''), 3000)
        }
        setAddingId(null)
    }

    return (
        <>
            <div className={`absolute top-full left-0 right-0 z-50 bg-[#1a2235] border-b border-white/[0.08] transition-all duration-300
                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="max-w-lg mx-auto p-4">
                    {/* Search input */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
                        <input
                            ref={inputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by username..."
                            className="w-full pl-10 pr-10 py-3 bg-[#0d1117] rounded-xl border border-white/10 text-white placeholder:text-slate-500 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none text-sm"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg hover:text-white">
                                close
                            </button>
                        )}
                    </div>

                    {/* Results */}
                    {searching && (
                        <div className="flex justify-center py-6">
                            <div className="w-5 h-5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                            {results.map(user => {
                                const isAlreadyBuddy = buddyIds.has(user.id)
                                return (
                                    <div key={user.id} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-white/[0.06]">
                                        <img
                                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}&background=FF6B35&color=fff`}
                                            className="size-12 rounded-full object-cover border-2 border-white/10 flex-shrink-0"
                                            alt={user.fullName}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm truncate">{user.fullName}</p>
                                            <p className="text-[#FF6B35] text-xs font-medium">@{user.username}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddBuddy(user.id, user.username)}
                                            disabled={isAlreadyBuddy || addingId === user.id}
                                            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95
                                                ${isAlreadyBuddy
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                                                    : 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'}`}
                                        >
                                            {addingId === user.id ? (
                                                <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                                            ) : isAlreadyBuddy ? (
                                                <><span className="material-symbols-outlined text-xs">check</span> Added</>
                                            ) : (
                                                <><span className="material-symbols-outlined text-xs">person_add</span> Add</>
                                            )}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {searchQuery.length >= 2 && results.length === 0 && !searching && (
                        <p className="text-slate-500 text-sm text-center py-4">No users found for "{searchQuery}"</p>
                    )}
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-[#1a2235] border border-white/10 text-white text-sm px-5 py-3 rounded-xl shadow-xl animate-bounce-in">
                    {toast}
                </div>
            )}
        </>
    )
}
