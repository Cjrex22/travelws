import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Calendar, CheckCircle2, ChevronDown, CheckSquare, Plus, X } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from '../components/ui/SkeletonLoader';

interface TripPackage {
    id: string;
    name: string;
    destination: string;
    duration: string;
    price: number;
    description: string;
    photoUrl: string;
    highlights: string;
    inclusions: string;
}

export default function PackageDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pkg, setPkg] = useState<TripPackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState('');
    const [persons, setPersons] = useState(1);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const { data } = await api.get(`/api/packages/${id}`);
                setPkg(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);

    const handleBook = async () => {
        if (!bookingDate) return alert("Please select a date");
        setIsBooking(true);
        try {
            await api.post('/api/bookings/create', {
                packageId: id,
                travelDate: bookingDate,
                totalPersons: persons,
                buddyUserIds: [] 
            });
            alert("Booking Confirmed!");
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert("Booking failed");
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#13181f]">
            <SkeletonLoader className="h-[45vh] w-full rounded-b-[2.5rem]" />
        </div>
    );

    if (!pkg) return <div className="p-10 text-center text-white">Package not found</div>;

    const highlightsList = pkg.highlights.split('\n').filter(Boolean);
    const inclusionsList = pkg.inclusions.split('\n').filter(Boolean);

    return (
        <div className="min-h-[100dvh] bg-[#13181f] text-white font-sans relative pb-28">
            {/* Hero Image */}
            <div className="relative h-[45vh] w-full rounded-b-[2rem] overflow-hidden shadow-2xl">
                <img src={pkg.photoUrl} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13181f] via-black/40 to-black/20" />
                
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-5 w-10 h-10 rounded-full glass-card flex items-center justify-center text-white backdrop-blur-md z-20"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Main Content */}
            <div className="px-5 relative z-10 -mt-20">
                <div className="glass-card p-6 rounded-[2rem] shadow-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4C8]/10 blur-3xl rounded-full" />
                    
                    <div className="flex items-center text-xs text-[#00D4C8] font-bold uppercase tracking-wider mb-2">
                        <MapPin size={12} className="mr-1" />
                        {pkg.destination}
                    </div>
                    
                    <h1 className="text-2xl font-black leading-tight mb-3 text-white">{pkg.name}</h1>
                    
                    <div className="flex items-center gap-4 text-gray-300 text-sm font-medium border-b border-white/10 pb-4 mb-4">
                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-[#FF6B35]" /> {pkg.duration}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} className="text-[#00D4C8]" /> Flexible Dates</span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                        {pkg.description}
                    </p>

                    <h3 className="text-lg font-bold mb-3 text-white flex items-center gap-2">Highlights</h3>
                    <ul className="space-y-2 mb-6">
                        {highlightsList.map((hl, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 font-medium">
                                <CheckCircle2 size={16} className="text-[#00D4C8] mt-0.5 shrink-0" />
                                <span>{hl}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Booking Options Block */}
                <div className="mt-5 p-5 glass-card rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold mb-4">Book your slot</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1.5 block">Travel Date</label>
                            <input 
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#00D4C8] transition-all"
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1.5 block">Travelers</label>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-max">
                                <button onClick={() => setPersons(Math.max(1, persons - 1))} className="text-xl text-[#00D4C8] hover:text-white px-2 font-bold">-</button>
                                <span className="font-black text-lg w-4 text-center">{persons}</span>
                                <button onClick={() => setPersons(persons + 1)} className="text-xl text-[#00D4C8] hover:text-white px-2 font-bold">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Nav CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-5 glass-nav pb-safe border-t border-white/5 z-50 rounded-t-3xl">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    <div className="flex flex-col pl-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Price</span>
                        <span className="text-2xl font-black text-white leading-none">${pkg.price * persons}</span>
                    </div>
                    <button 
                        onClick={handleBook}
                        disabled={isBooking}
                        className="bg-gradient-to-r from-[#FF6B35] to-[#D14F1D] text-white px-10 py-3.5 rounded-full font-black tracking-wide shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] transform hover:scale-105 active:scale-95 transition-all text-[15px] disabled:opacity-70 disabled:filter-grayscale"
                    >
                        {isBooking ? 'Processing...' : 'Book Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}
