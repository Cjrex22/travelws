import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import BottomNavBar from '../components/layout/BottomNavBar'
import Header from '../components/layout/Header'

export default function AllTripsPage() {
    const navigate = useNavigate()

    const { data: tripsData, isLoading } = useQuery({
        queryKey: ['trips'],
        queryFn: async () => {
            const { data } = await api.get('/api/trips')
            return data.data
        },
    })

    const trips = tripsData || []
    const formatDate = (dateString?: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
    }

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans relative pb-20">
            <Header />

            <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-white">All Trips</h1>
                        <p className="text-slate-400 text-sm mt-1">Your entire travel history</p>
                    </div>
                    <button onClick={() => navigate('/trips/new')}
                        className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors border border-white/10">
                        <span className="material-symbols-outlined text-white">add</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : trips.length === 0 ? (
                    <div className="bg-[#1a2235] rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-white/[0.06]">
                        <span className="text-5xl mb-4 animate-float">🗺️</span>
                        <h3 className="text-white font-bold text-lg mb-2">No trips yet</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Create your first trip and start your adventure!
                        </p>
                        <button onClick={() => navigate('/trips/new')}
                            className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
                            Create Trip
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {trips.map((trip: any) => (
                            <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)}
                                className="flex flex-col w-full rounded-2xl overflow-hidden relative group cursor-pointer
                                            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                                            border border-white/10 shadow-lg shadow-black/30">
                                {/* Banner image */}
                                <div className="h-32 w-full relative overflow-hidden">
                                    <img src={trip.bannerUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=70'}
                                        alt={trip.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#13181f] via-black/30 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

                                    {/* Status badge */}
                                    <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-md
                                         ${trip.status === 'CONFIRMED' ? 'bg-green-500/90 text-white' :
                                            trip.status === 'PLANNING' ? 'bg-orange-500/90 text-white' :
                                                'bg-slate-500/90 text-white'}`}>
                                        {trip.status}
                                    </div>
                                </div>

                                {/* Bottom text */}
                                <div className="p-3 bg-gradient-to-b from-[#13181f] to-[#1a2235]">
                                    <p className="text-white font-bold text-sm leading-tight mb-1 truncate">{trip.name}</p>
                                    <p className="text-slate-400 text-[10px] font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                                        {formatDate(trip.startDate)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <BottomNavBar />
        </div>
    )
}
