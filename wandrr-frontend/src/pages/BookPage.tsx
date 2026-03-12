import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Briefcase, MapPin, Clock, Star } from 'lucide-react';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import api from '../lib/api';

interface TripPackage {
    id: string;
    name: string;
    destination: string;
    duration: string;
    price: number;
    photoUrl: string;
    rating: number;
    reviewCount: number;
}

export default function BookPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'packages' | 'flights'>('packages');
    const [packages, setPackages] = useState<TripPackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const { data } = await api.get('/api/packages');
                setPackages(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans pb-24">
            <Header />

            <div className="px-5 pt-6 pb-4 sticky top-0 bg-[#13181f]/90 backdrop-blur-xl z-30 border-b border-white/5">
                <h1 className="text-3xl font-black tracking-tight mb-4">
                    Book <span className="text-gradient">Travel</span>
                </h1>

                {/* Tabs */}
                <div className="flex bg-white/5 rounded-2xl p-1 shadow-inner border border-white/5">
                    <button
                        onClick={() => setActiveTab('packages')}
                        className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                            activeTab === 'packages' 
                            ? 'bg-[#00D4C8] text-[#0a0f1a] shadow-md transform scale-[1.02]' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Briefcase size={16} /> Packages
                    </button>
                    <button
                        onClick={() => setActiveTab('flights')}
                        className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                            activeTab === 'flights' 
                            ? 'bg-[#00D4C8] text-[#0a0f1a] shadow-md transform scale-[1.02]' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Plane size={16} /> Flights
                    </button>
                </div>
            </div>

            <main className="flex-1 px-5 pt-4">
                {activeTab === 'packages' ? (
                    <div className="space-y-5">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <SkeletonLoader key={i} className="h-32 w-full rounded-3xl" />
                            ))
                        ) : packages.length > 0 ? (
                            packages.map((pkg) => (
                                <div 
                                    key={pkg.id}
                                    onClick={() => navigate(`/book/package/${pkg.id}`)}
                                    className="glass-card rounded-[1.5rem] overflow-hidden flex cursor-pointer hover:-translate-y-1 transition-transform group shadow-lg border-white/10"
                                >
                                    <div className="w-1/3 relative overflow-hidden">
                                        <img 
                                            src={pkg.photoUrl} 
                                            alt={pkg.name} 
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="w-2/3 p-4 flex flex-col justify-between ml-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    <MapPin size={10} className="mr-1 text-[#FF6B35]" />
                                                    {pkg.destination}
                                                </div>
                                                <div className="flex items-center gap-0.5 glass-card px-1.5 py-0.5 rounded-md">
                                                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                                    <span className="text-[10px] font-bold text-white">{pkg.rating}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-white text-[15px] leading-tight mb-1.5 group-hover:text-[#00D4C8] transition-colors">{pkg.name}</h3>
                                            <div className="flex items-center text-xs text-gray-400 font-medium">
                                                <Clock size={12} className="mr-1" />
                                                {pkg.duration}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-medium">From</span>
                                                <span className="text-xl font-black text-[#00D4C8] leading-none">${pkg.price}</span>
                                            </div>
                                            <div className="bg-white/10 p-2 rounded-xl group-hover:bg-[#00D4C8] transition-colors">
                                                <Plane size={14} className="text-white group-hover:text-[#0a0f1a] rotate-45 transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 mt-10">No packages found.</div>
                        )}
                    </div>
                ) : (
                    <div className="text-center mt-10">
                        {/* Placeholder for Flights for now, will refine next */}
                        <div className="glass-card rounded-2xl p-6">
                            <Plane size={48} className="mx-auto text-gray-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Flight Search</h3>
                            <p className="text-gray-400 text-sm">Find and book the best flights to your destinations globally.</p>
                            <button className="mt-6 w-full bg-white/10 text-white font-bold py-3 rounded-xl border border-white/20">
                                Coming Soon
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <BottomNavBar />
        </div>
    );
}
