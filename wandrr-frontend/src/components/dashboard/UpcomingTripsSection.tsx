import { useNavigate, useLocation } from 'react-router-dom'

interface UpcomingTripsProps {
    trips: any[]
}

export default function UpcomingTripsSection({ trips = [] }: UpcomingTripsProps) {
    const navigate = useNavigate()
    const location = useLocation()

    const formatDate = (dateString?: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
    }

    const getTagStyle = (tag?: string) => {
        switch (tag) {
            case 'UPCOMING': return 'bg-[#FF6B35] text-white'
            case 'CURRENT': return 'bg-green-500 text-white'
            case 'DONE': return 'bg-slate-600 text-white'
            default: return 'bg-slate-500/90 text-white'
        }
    }

    const getTagLabel = (tag?: string) => {
        switch (tag) {
            case 'UPCOMING': return '🗓 Upcoming'
            case 'CURRENT': return '✈️ Current'
            case 'DONE': return '✓ Done'
            default: return tag || 'PLANNING'
        }
    }

    if (trips.length === 0) {
        return (
            <div className="bg-[#1a2235] rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-white/[0.06] shadow-lg">
                <span className="text-5xl mb-4 animate-float">🗺️</span>
                <h3 className="text-white font-bold text-lg mb-2">No trips yet</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                    Create your first trip and start planning your high-quality adventure!
                </p>
                <button
                    onClick={() => navigate('/trips/new')}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] hover:from-[#e55a2b] hover:to-[#FF6B35] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6B35]/25"
                >
                    Create Your First Trip
                </button>
            </div>
        )
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF6B35]">map</span>
                    My Trips
                </h3>
                {trips.length > 1 && (
                    <button
                        onClick={() => navigate('/trips')}
                        className="text-[#FF6B35] text-sm font-semibold hover:text-[#ff8e53] transition-colors flex items-center gap-1"
                    >
                        See All
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                )}
            </div>

            <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-4 pt-2 snap-x snap-mandatory">
                {trips.map(trip => (
                    <div
                        key={trip.id}
                        onClick={() => navigate(`/trips/${trip.id}`)}
                        className="flex-none w-64 rounded-2xl overflow-hidden relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] snap-center shadow-xl shadow-black/40 border border-white/10"
                    >
                        {/* Banner image */}
                        <img
                            src={trip.bannerUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=70'}
                            alt={trip.name}
                            className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#13181f] via-black/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

                        {/* Dynamic tag — top right */}
                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md ${getTagStyle(trip.currentTag)}`}>
                            {getTagLabel(trip.currentTag)}
                        </div>

                        {/* Bottom text */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-bold text-lg leading-tight mb-1 truncate">{trip.name}</p>
                            <p className="text-white/60 text-xs font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                            </p>
                            {/* Member avatars stack */}
                            {trip.members && trip.members.length > 0 && (
                                <div className="flex -space-x-1.5 mt-2">
                                    {trip.members.slice(0, 3).map((m: any) => (
                                        <img
                                            key={m.id}
                                            src={m.avatarUrl || `https://ui-avatars.com/api/?name=${m.fullName}&background=FF6B35&color=fff&size=20`}
                                            className="size-5 rounded-full border border-black/40 object-cover"
                                            alt={m.fullName}
                                        />
                                    ))}
                                    {trip.members.length > 3 && (
                                        <div className="size-5 rounded-full border border-black/40 bg-slate-700 flex items-center justify-center text-[8px] font-bold text-white">
                                            +{trip.members.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Trip CTA card */}
                <div
                    onClick={() => navigate('/trips/new')}
                    className="flex-none w-44 h-44 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FF6B35]/60 hover:bg-[#FF6B35]/5 transition-all duration-300 group snap-center"
                >
                    <div className="size-12 rounded-full bg-white/10 group-hover:bg-[#FF6B35] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#FF6B35]/40">
                        <span className="material-symbols-outlined text-white/60 group-hover:text-white text-2xl">add</span>
                    </div>
                    <span className="text-white/60 text-sm font-semibold text-center group-hover:text-white">
                        Add Trip
                    </span>
                </div>
            </div>
        </section>
    )
}
