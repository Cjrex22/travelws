import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import BottomNavBar from '../components/layout/BottomNavBar'
import TripExpenseSection from '../components/trips/TripExpenseSection'
import TripGallerySection from '../components/trips/TripGallerySection'
import { useState } from 'react'

export default function TripDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expenseModalOpen, setExpenseModalOpen] = useState(false)

    // Fetch trip detail
    const { data: trip, isLoading } = useQuery({
        queryKey: ['trip', id],
        queryFn: async () => {
            const { data } = await api.get(`/api/trips/${id}`)
            return data.data
        },
        enabled: !!id
    })

    const formatDate = (dateString?: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#13181f] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-[#13181f] text-white flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-2">Trip Not Found</h2>
                <button onClick={() => navigate('/dashboard')} className="text-[#FF6B35] hover:underline">
                    Return to Dashboard
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans relative pb-20">
            {/* Context constraint for mobile feel */}
            <div className="max-w-lg mx-auto w-full flex-1 flex flex-col relative">

                {/* BANNER — full width, 250px tall, same image as flashcard */}
                <div className="relative h-64 w-full overflow-hidden shrink-0">
                    <img
                        src={trip.bannerUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=70'}
                        alt={trip.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#13181f]" />

                    {/* Back button — top left */}
                    <button onClick={() => navigate(-1)}
                        className="absolute top-safe pt-4 left-4 z-10 
                                    size-10 bg-black/40 backdrop-blur-sm rounded-full
                                    flex items-center justify-center border border-white/20
                                    hover:bg-black/60 transition-colors">
                        <span className="material-symbols-outlined text-white">arrow_back</span>
                    </button>

                    {/* Trip name overlaid at bottom of banner */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg mr-2
                            ${trip.status === 'CONFIRMED' ? 'bg-green-500/90 text-white' :
                                trip.status === 'PLANNING' ? 'bg-orange-500/90 text-white' :
                                    'bg-slate-500/90 text-white'}`}>
                            {trip.status}
                        </span>
                        <h1 className="text-3xl font-black mt-2 leading-tight tracking-tight shadow-black/50 drop-shadow-md">{trip.name}</h1>
                        <p className="text-white/80 font-medium text-sm mt-1 flex items-center gap-1 drop-shadow-md">
                            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 pt-6 pb-28 space-y-8 flex-1">
                    {/* Description */}
                    {trip.description && (
                        <div className="bg-[#1a2235] rounded-2xl p-5 border border-white/[0.06] shadow-lg">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[#FF6B35] text-[18px]">description</span>
                                About Trip
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{trip.description}</p>
                        </div>
                    )}

                    {/* Members */}
                    <section className="bg-gradient-to-br from-[#0d1b35] to-[#13181f] rounded-2xl p-5 border border-white/[0.06] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                        <h3 className="font-bold text-base mb-4 flex items-center gap-2 relative z-10">
                            <span className="material-symbols-outlined text-blue-400">group</span>
                            Travel Buddies
                        </h3>
                        <div className="flex flex-wrap gap-2.5 relative z-10">
                            {trip.members?.map((m: any) => (
                                <div key={m.id} className="flex items-center gap-2 bg-[#1a2235]/80 backdrop-blur-sm 
                                                            rounded-full pr-4 pl-1.5 py-1.5 border border-white/[0.08] shadow-sm hover:bg-white/10 transition-colors">
                                    <img
                                        src={m.avatarUrl || `https://ui-avatars.com/api/?name=${m.fullName || 'User'}&background=3b82f6&color=fff`}
                                        className="size-7 rounded-full object-cover border border-white/10 shadow-sm"
                                        alt={m.fullName}
                                    />
                                    <span className="text-sm font-medium text-white/90">{m.fullName}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* BUY / Book Button — large, prominent */}
                    <button className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] hover:from-[#e55a2b] hover:to-[#FF6B35] 
                                    rounded-2xl text-white font-bold text-base
                                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                                    shadow-xl shadow-[#FF6B35]/25 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        Book This Trip
                    </button>

                    {/* Trip specific memories gallery */}
                    <TripGallerySection tripId={trip.id} />

                    {/* Expense section for this trip */}
                    <TripExpenseSection tripId={trip.id} />
                </div>

                {/* FAB — add expense */}
                <button onClick={() => setExpenseModalOpen(true)}
                    className="fixed bottom-24 right-5 lg:absolute lg:right-5 z-40 size-14 bg-[#3b82f6] hover:bg-[#2563eb] 
                                rounded-full shadow-xl shadow-blue-500/30
                                flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
                    <span className="material-symbols-outlined text-white text-3xl">add</span>
                </button>

            </div>
            <BottomNavBar />
        </div>
    )
}
