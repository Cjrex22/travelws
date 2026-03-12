import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import SearchPanel from '../dashboard/SearchPanel'

export default function Header() {
    const { user } = useAuth()
    const [searchOpen, setSearchOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full bg-[#13181f]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center justify-between relative">
            {/* Left: Logo */}
            <div className="flex items-center gap-2.5">
                <div className="bg-[#0a1629] p-1.5 rounded-lg border border-white/5 shadow-sm">
                    <span className="material-symbols-outlined text-white text-2xl">explore</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Wandrr</span>
            </div>

            {/* Right: Search icon + Avatar */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className={`p-2 rounded-full transition-colors ${searchOpen ? 'bg-[#FF6B35]/20 text-[#FF6B35]' : 'hover:bg-white/10 text-slate-400'}`}
                >
                    <span className="material-symbols-outlined">{searchOpen ? 'close' : 'search'}</span>
                </button>
                {/* Avatar circle */}
                <div className="size-10 rounded-full overflow-hidden border-2 border-white/10 shadow-sm cursor-pointer hover:border-[#FF6B35] transition-colors">
                    <img
                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=FF6B35&color=fff`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Search Panel */}
            <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </header>
    )
}
