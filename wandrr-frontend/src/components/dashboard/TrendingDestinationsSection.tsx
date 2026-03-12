import { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import SkeletonLoader from '../ui/SkeletonLoader';

interface Destination {
    id: string;
    name: string;
    country: string;
    photoUrl: string;
    rating?: number;
}

export default function TrendingDestinationsSection() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const { data } = await api.get('/api/destinations?page=0&size=5');
                setDestinations(data.data.content || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading) {
        return (
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Trending Now</h3>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                    {[1, 2, 3].map(i => (
                        <SkeletonLoader key={i} className="min-w-[200px] h-[260px] rounded-2xl flex-shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    if (destinations.length === 0) return null;

    return (
        <div className="mt-6 -mx-4 px-4 overflow-hidden relative">
            <div className="flex justify-between items-end mb-4 pr-4">
                <h3 className="text-xl font-bold text-white tracking-tight">Trending Destinations</h3>
                <Link to="/explore" className="text-xs font-bold text-[#00D4C8] uppercase tracking-wider hover:text-white transition-colors">See All</Link>
            </div>
            
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 px-1">
                {destinations.map((dest) => (
                    <Link 
                        key={dest.id} 
                        to={`/explore/${dest.id}`}
                        className="min-w-[200px] h-[260px] rounded-[1.5rem] relative overflow-hidden flex-shrink-0 group shadow-lg hover:shadow-xl hover:shadow-[#00D4C8]/10 transition-all duration-300"
                    >
                        <img 
                            src={dest.photoUrl} 
                            alt={dest.name} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#0a0f1a]/90" />
                        
                        <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-full flex items-center gap-1">
                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] font-bold text-white">4.8</span>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                            <h4 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-[#00D4C8] transition-colors">{dest.name}</h4>
                            <div className="flex items-center text-gray-300 text-xs font-medium">
                                <MapPin size={10} className="mr-1 text-[#FF6B35]" />
                                {dest.country}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#13181f] to-transparent pointer-events-none" />
        </div>
    );
}
