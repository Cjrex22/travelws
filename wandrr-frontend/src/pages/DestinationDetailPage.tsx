import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, DollarSign, Share2, Heart } from 'lucide-react';
import api from '../lib/api';
import SkeletonLoader from '../components/ui/SkeletonLoader';

interface Destination {
    id: string;
    name: string;
    country: string;
    description: string;
    photoUrl: string;
    category: string;
    bestTimeToVisit: string;
    averageCost: string;
    tagline: string;
}

export default function DestinationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const { data } = await api.get(`/api/destinations/${id}`);
                setDestination(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#13181f]">
            <SkeletonLoader className="h-[50vh] w-full rounded-b-[3rem]" />
            <div className="p-6 space-y-4">
                <SkeletonLoader className="h-10 w-3/4 rounded-xl" />
                <SkeletonLoader className="h-6 w-1/2 rounded-xl" />
                <div className="flex gap-4 mt-6">
                    <SkeletonLoader className="h-24 w-full rounded-2xl" />
                    <SkeletonLoader className="h-24 w-full rounded-2xl" />
                </div>
                <SkeletonLoader className="h-32 w-full rounded-2xl mt-6" />
            </div>
        </div>
    );

    if (!destination) return <div className="p-10 text-center text-white">Destination not found</div>;

    return (
        <div className="min-h-[100dvh] bg-[#13181f] text-white font-sans relative pb-28">
            {/* Hero Image */}
            <div className="relative h-[55vh] w-full rounded-b-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                    src={destination.photoUrl} 
                    alt={destination.name} 
                    className="absolute inset-0 w-full h-full object-cover scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13181f] via-[#13181f]/40 to-black/30" />
                
                {/* Top Nav */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pt-12">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                            <Share2 size={18} />
                        </button>
                        <button 
                            onClick={() => setSaved(!saved)}
                            className={`w-10 h-10 rounded-full glass-card flex items-center justify-center transition-colors ${saved ? 'bg-red-500/20 box-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'hover:bg-white/20'}`}
                        >
                            <Heart size={18} className={saved ? 'text-red-500 fill-red-500' : 'text-white'} />
                        </button>
                    </div>
                </div>

                {/* Main Titles */}
                <div className="absolute bottom-10 left-6 right-6 z-10">
                    <div className="glass-card w-max px-3 py-1.5 rounded-full flex items-center gap-1.5 mb-4 border-white/20">
                        <MapPin size={12} className="text-[#00D4C8]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">{destination.country}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-none drop-shadow-xl mb-2">
                        {destination.name}
                    </h1>
                    <p className="text-lg text-gray-200 font-medium drop-shadow-md">
                        {destination.tagline}
                    </p>
                </div>
            </div>

            {/* Content Body */}
            <div className="px-6 py-8 relative -mt-4 bg-[#13181f] rounded-t-[2.5rem] z-10">
                
                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="glass-card rounded-2xl p-4 flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-[#00D4C8]/10 flex items-center justify-center">
                            <Calendar size={18} className="text-[#00D4C8]" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Best Time</p>
                            <p className="text-sm font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{destination.bestTimeToVisit}</p>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl p-4 flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                            <DollarSign size={18} className="text-[#FF6B35]" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avg Cost</p>
                            <p className="text-sm font-bold text-white">{destination.averageCost}</p>
                        </div>
                    </div>
                </div>

                {/* Description sections */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            About {destination.name}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed text-justify opacity-90">
                            {destination.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-3">Popular Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {destination.category.split(',').map((cat, i) => (
                                <span key={i} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-300">
                                    {cat.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-5 glass-nav pb-safe border-t border-white/5 z-50 rounded-t-3xl">
                <div className="flex justify-between items-center max-w-md mx-auto gap-4">
                    <div className="flex flex-col pl-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Let AI Plan It</span>
                        <span className="text-lg font-bold text-white leading-none">Generate Itinerary</span>
                    </div>
                    <button 
                        onClick={() => navigate(`/itinerary?destination=${destination.name}&days=5`)}
                        className="bg-gradient-to-r from-[#00D4C8] to-[#009189] text-[#0a0f1a] px-8 py-3.5 rounded-full font-black tracking-wide shadow-[0_0_20px_rgba(0,212,200,0.3)] hover:shadow-[0_0_30px_rgba(0,212,200,0.5)] transform hover:scale-105 active:scale-95 transition-all w-max"
                    >
                        Plan Trip Now
                    </button>
                </div>
            </div>
        </div>
    );
}
