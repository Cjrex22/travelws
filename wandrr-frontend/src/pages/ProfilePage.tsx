import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Bell, Plane, Briefcase, Map, Compass, Trash2 } from 'lucide-react';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface SavedItinerary {
    id: string;
    destination: string;
    days: number;
    budget: string;
    style: string;
}

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
    
    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const { data } = await api.get('/api/itinerary/mine');
                setItineraries(data.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchItineraries();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans pb-24 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[30%] bg-blue-500/10 blur-[100px] pointer-events-none" />

            <Header />

            <div className="flex-1 px-5 pt-6 w-full max-w-lg mx-auto relative z-10 flex flex-col">
                <div className="flex justify-between items-center mb-8 pr-2">
                    <h1 className="text-3xl font-black tracking-tight">
                        My <span className="text-gradient drop-shadow-lg">Profile</span>
                    </h1>
                    <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white transition-colors">
                        <Settings size={20} />
                    </button>
                </div>

                {/* Profile Card */}
                <div className="glass-card rounded-[2rem] p-6 mb-8 flex items-center gap-5 border border-white/10 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.5)]">
                    <div className="w-20 h-20 rounded-full border-[3px] border-[#00D4C8] p-1 relative overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-[#1a2235] flex items-center justify-center text-2xl font-bold text-[#00D4C8]">
                                {user?.fullName?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">{user?.fullName}</h2>
                        <p className="text-gray-400 text-sm font-medium tracking-wide">@{user?.username || user?.email?.split('@')[0]}</p>
                    </div>
                </div>

                {/* Global Actions Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div 
                        onClick={() => navigate('/bookings')}
                        className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors border border-white/5"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#1a2235] flex items-center justify-center">
                            <Briefcase size={20} className="text-[#00D4C8]" />
                        </div>
                        <span className="text-sm font-bold tracking-wide">My Bookings</span>
                    </div>
                    <div 
                        onClick={() => navigate('/trips')}
                        className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors border border-white/5"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#1a2235] flex items-center justify-center">
                            <Plane size={20} className="text-[#FF6B35]" />
                        </div>
                        <span className="text-sm font-bold tracking-wide">Trip Groups</span>
                    </div>
                </div>

                {/* Saved AI Itineraries */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Map size={18} className="text-[#00D4C8]" /> Saved Itineraries
                    </h3>
                    <div className="space-y-3">
                        {itineraries.length > 0 ? (
                            itineraries.map((itin) => (
                                <div key={itin.id} className="glass-card p-4 rounded-2xl border border-white/5 flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-white text-[15px] group-hover:text-[#00D4C8] transition-colors cursor-pointer">{itin.destination}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{itin.days} Days • {itin.budget} budget</p>
                                    </div>
                                    <button className="text-gray-500 hover:text-red-400 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                <Compass size={24} className="mx-auto text-gray-500 mb-2" />
                                <p className="text-sm text-gray-400 font-medium">No saved itineraries yet.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Utilities Menu */}
                <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <Bell size={18} className="text-gray-400" />
                            <span className="font-bold text-sm tracking-wide">Notifications</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#FF6B35] flex items-center justify-center text-[10px] font-bold">2</div>
                    </div>
                    <div 
                        onClick={handleLogout}
                        className="px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors text-red-400"
                    >
                        <LogOut size={18} />
                        <span className="font-bold text-sm tracking-wide">Sign Out</span>
                    </div>
                </div>
            </div>

            <BottomNavBar />
        </div>
    );
}
