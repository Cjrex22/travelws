import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import api from '../lib/api';
import SkeletonLoader from '../components/ui/SkeletonLoader';

interface Booking {
    id: string;
    tripPackage: {
        id: string;
        name: string;
        photoUrl: string;
        destination: string;
    };
    travelDate: string;
    totalPersons: number;
    totalCost: number;
    status: string;
    createdAt: string;
}

export default function MyBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/api/bookings/mine');
                setBookings(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans pb-10">
            <div className="px-5 pt-12 pb-4 sticky top-0 bg-[#13181f]/90 backdrop-blur-xl z-30 border-b border-white/5 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-black tracking-tight">My Bookings</h1>
            </div>

            <main className="flex-1 px-5 pt-6 space-y-5">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <SkeletonLoader key={i} className="h-40 w-full rounded-3xl" />
                    ))
                ) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} className="glass-card rounded-[1.5rem] overflow-hidden shadow-lg border border-white/10">
                            <div className="flex h-24 relative">
                                <img 
                                    src={booking.tripPackage.photoUrl} 
                                    alt={booking.tripPackage.name} 
                                    className="w-1/3 h-full object-cover"
                                />
                                <div className="w-2/3 p-3 flex flex-col justify-center">
                                    <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{booking.tripPackage.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{booking.tripPackage.destination}</p>
                                </div>
                                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 flex justify-between items-center border-t border-white/5">
                                <div className="space-y-1.5 ">
                                    <div className="flex items-center gap-2 text-xs text-gray-300 font-medium tracking-wide">
                                        <Calendar size={12} className="text-[#00D4C8]" />
                                        {new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-300 font-medium tracking-wide">
                                        <Users size={12} className="text-[#00D4C8]" />
                                        {booking.totalPersons} Travelers
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Paid</p>
                                    <p className="text-xl font-black text-[#FF6B35] leading-none">${booking.totalCost}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
                            <Clock size={32} className="text-[#00D4C8]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8">You haven't booked any packages or flights yet. Time to plan an adventure!</p>
                        <button 
                            onClick={() => navigate('/book')}
                            className="bg-[#00D4C8] text-[#0a0f1a] font-black px-8 py-3 rounded-xl hover:bg-[#00D4C8]/90 transition"
                        >
                            Explore Packages
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
