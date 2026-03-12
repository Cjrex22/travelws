import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import api from '../../lib/api';
import SkeletonLoader from '../ui/SkeletonLoader';

interface Destination {
    id: string;
    name: string;
    country: string;
    photoUrl: string;
    tagline: string;
}

export default function HeroCarousel() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/api/destinations/featured');
                setDestinations(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    useEffect(() => {
        if (destinations.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % destinations.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [destinations.length]);

    if (loading) return <SkeletonLoader className="h-[400px] w-full mt-6 rounded-[2rem]" />;
    if (destinations.length === 0) return null;

    const current = destinations[currentIndex];

    return (
        <div className="relative h-[400px] w-full rounded-[2rem] overflow-hidden mt-2 group shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            
            {/* Background Images with smooth fade transition */}
            {destinations.map((dest, i) => (
                <div 
                    key={dest.id}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center"
                    style={{ 
                        opacity: i === currentIndex ? 1 : 0, 
                        backgroundImage: `url(${dest.photoUrl})`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/40 to-transparent" />
                </div>
            ))}

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-10 flex flex-col items-start transform transition-transform duration-500 hover:-translate-y-2">
                <div className="glass-card px-3 py-1 rounded-full flex items-center mb-3">
                    <MapPin size={12} className="text-[#00D4C8] mr-1.5" />
                    <span className="text-xs font-semibold tracking-wide uppercase text-white drop-shadow-md">{current.country}</span>
                </div>
                
                <h2 className="text-4xl font-black text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2">
                    {current.name}
                </h2>
                <p className="text-gray-200 text-sm font-medium drop-shadow-md line-clamp-2 max-w-[85%]">
                    {current.tagline}
                </p>
                
                <button className="mt-5 bg-gradient-to-r from-[#00D4C8] to-[#009189] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(0,212,200,0.4)] hover:shadow-[0_0_30px_rgba(0,212,200,0.6)] hover:-translate-y-0.5 transition-all duration-300">
                    Explore Destination
                </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute top-5 right-5 flex gap-1.5 z-10">
                {destinations.map((_, i) => (
                    <div 
                        key={i} 
                        className={`transition-all duration-500 rounded-full h-1.5 ${i === currentIndex ? 'w-6 bg-[#00D4C8] shadow-[0_0_8px_#00D4C8]' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
                    />
                ))}
            </div>
            
            {/* Manual Controls */}
            <button 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length)}
            >
                <ChevronLeft size={20} />
            </button>
            <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % destinations.length)}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
