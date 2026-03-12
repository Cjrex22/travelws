import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import api from '../lib/api';

interface Destination {
    id: string;
    name: string;
    country: string;
    photoUrl: string;
    category: string;
    tagline: string;
}

const CATEGORIES = ["All", "Beaches", "Mountains", "Cities", "Cultural", "Adventure", "Nature", "Romantic"];

export default function ExplorePage() {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const fetchDestinations = async () => {
            setLoading(true);
            try {
                let url = '/api/destinations?page=0&size=50';
                if (activeCategory !== 'All') {
                    url += `&category=${activeCategory}`;
                }
                const { data } = await api.get(url);
                setDestinations(data.data?.content || []);
            } catch (err) {
                console.error("Failed to fetch destinations:", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            if (!searchTerm) {
                fetchDestinations();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [activeCategory, searchTerm]);

    useEffect(() => {
        if (!searchTerm) return;
        const searchDestinations = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/api/destinations/search?query=${searchTerm}`);
                setDestinations(data.data || []);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchDestinations, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans pb-24">
            <Header />

            <div className="px-5 pt-6 pb-2 sticky top-0 bg-[#13181f]/90 backdrop-blur-xl z-30">
                <h1 className="text-3xl font-black tracking-tight mb-4">
                    Explore <span className="text-gradient">World</span>
                </h1>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Where to next?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D4C8]/50 transition-all font-medium"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                        <Filter size={18} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Categories Scroll */}
                <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`flex-none px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${
                                activeCategory === category 
                                ? 'bg-[#00D4C8] text-[#0a0f1a] shadow-[0_0_15px_rgba(0,212,200,0.4)] transform scale-105' 
                                : 'glass-card text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 px-4 mt-2">
                {loading ? (
                    <div className="columns-2 gap-4 space-y-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <SkeletonLoader key={i} className={`w-full rounded-[1.5rem] ${i % 2 === 0 ? 'h-64' : 'h-48'}`} />
                        ))}
                    </div>
                ) : destinations.length > 0 ? (
                    <div className="columns-2 gap-4 space-y-4">
                        {destinations.map((dest, i) => (
                            <div 
                                key={dest.id} 
                                onClick={() => navigate(`/explore/${dest.id}`)}
                                className="break-inside-avoid relative rounded-[1.5rem] overflow-hidden group mb-4 shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <img 
                                    src={dest.photoUrl} 
                                    alt={dest.name} 
                                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/20 to-transparent" />
                                
                                <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-bold text-white">4.9</span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-bold leading-tight mb-1 text-lg group-hover:text-[#00D4C8] transition-colors">{dest.name}</h3>
                                    <div className="flex items-center text-gray-300 text-[10px] font-medium tracking-wide">
                                        <MapPin size={10} className="mr-1 text-[#FF6B35]" />
                                        {dest.country}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No destinations found</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-[250px]">Try adjusting your search or category filters to find the perfect spot.</p>
                    </div>
                )}
            </main>

            <BottomNavBar />
        </div>
    );
}
