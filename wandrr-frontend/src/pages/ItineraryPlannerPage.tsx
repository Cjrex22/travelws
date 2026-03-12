import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Compass, Calendar, DollarSign, Sparkles, AlertCircle, Save } from 'lucide-react';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import api from '../lib/api';
import SkeletonLoader from '../components/ui/SkeletonLoader';

interface ItineraryDay {
    day: number;
    title: string;
    activities: { time: string; activity: string; type: string }[];
}

interface Itinerary {
    id?: string;
    destination: string;
    days: number;
    budget: string;
    style: string;
    dailyPlan: ItineraryDay[];
}

export default function ItineraryPlannerPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [destination, setDestination] = useState(searchParams.get('destination') || '');
    const [days, setDays] = useState(Number(searchParams.get('days')) || 3);
    const [budget, setBudget] = useState('Moderate');
    const [style, setStyle] = useState('Balanced');
    
    const [generating, setGenerating] = useState(false);
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [activeDay, setActiveDay] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    const handleGenerate = async () => {
        if (!destination) return alert("Please enter a destination");
        setGenerating(true);
        setItinerary(null);
        try {
            const { data } = await api.post('/api/itinerary/generate', {
                destination,
                days,
                budget,
                travelStyle: style
            });
            setItinerary(data.data);
            setActiveDay(1);
        } catch (err) {
            console.error(err);
            alert("Failed to generate itinerary. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!itinerary) return;
        setIsSaving(true);
        try {
            await api.post('/api/itinerary/save', {
                destination: itinerary.destination,
                days: itinerary.days,
                budget: itinerary.budget,
                style: itinerary.style,
                itineraryJson: JSON.stringify(itinerary.dailyPlan)
            });
            alert("Itinerary Saved!");
        } catch (err) {
            console.error(err);
            alert("Failed to save itinerary");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans pb-24 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-[-10%] w-[50%] h-[30%] bg-[#00D4C8]/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[30%] bg-[#FF6B35]/10 blur-[100px] pointer-events-none" />

            <Header />

            <div className="flex-1 px-5 pt-6 pb-4 w-full max-w-lg mx-auto relative z-10 flex flex-col">
                <h1 className="text-3xl font-black tracking-tight mb-2">
                    AI Trip <span className="text-gradient drop-shadow-lg">Planner</span>
                </h1>
                <p className="text-gray-400 text-sm font-medium mb-6">Create the perfect hyper-personalized itinerary in seconds.</p>

                {!itinerary && !generating && (
                    <div className="glass-card p-6 border border-white/10 shadow-2xl rounded-[2rem] space-y-5 animate-[fadeIn_0.5s_ease-out]">
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                <Compass size={14} className="text-[#00D4C8]" />
                                Destination
                            </label>
                            <input 
                                type="text"
                                placeholder="e.g. Kyoto, Japan"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#00D4C8] transition-all placeholder:text-gray-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                    <Calendar size={14} className="text-[#FF6B35]" />
                                    Duration (Days)
                                </label>
                                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                                    <button onClick={() => setDays(Math.max(1, days - 1))} className="text-xl text-gray-300 hover:text-white px-2 font-black">-</button>
                                    <span className="font-bold text-lg">{days}</span>
                                    <button onClick={() => setDays(days + 1)} className="text-xl text-gray-300 hover:text-white px-2 font-black">+</button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                    <DollarSign size={14} className="text-green-400" />
                                    Budget
                                </label>
                                <select 
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3.5 text-white text-sm font-medium focus:outline-none appearance-none"
                                >
                                    <option className="bg-[#1a2235]">Budget</option>
                                    <option className="bg-[#1a2235]">Moderate</option>
                                    <option className="bg-[#1a2235]">Luxury</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Travel Style</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Relaxed', 'Balanced', 'Action-Packed', 'Cultural'].map(s => (
                                    <button 
                                        key={s}
                                        onClick={() => setStyle(s)}
                                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${style === s ? 'bg-[#00D4C8]/20 border-[#00D4C8] text-[#00D4C8]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerate}
                            className="w-full mt-4 bg-gradient-to-r from-[#00D4C8] to-[#009189] text-[#0a0f1a] py-4 rounded-xl font-black tracking-wide shadow-[0_0_20px_rgba(0,212,200,0.3)] hover:shadow-[0_0_30px_rgba(0,212,200,0.5)] transform hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
                        >
                            <Sparkles size={18} />
                            Generate Magic
                        </button>
                    </div>
                )}

                {generating && (
                    <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.5s_ease-out]">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-4 border-[#00D4C8]/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-[#00D4C8] rounded-full border-t-transparent animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00D4C8] animate-pulse" size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Curating Perfection...</h2>
                        <p className="text-gray-400 text-sm animate-pulse">Our AI is fetching the best hidden gems in {destination || 'your destination'}.</p>
                    </div>
                )}

                {itinerary && !generating && (
                    <div className="animate-[fadeIn_0.5s_ease-out] flex flex-col h-full space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
                            <div>
                                <h2 className="text-xl font-black">{itinerary.destination}</h2>
                                <p className="text-xs text-gray-400 font-medium">{itinerary.days} Days • {itinerary.style} • {itinerary.budget}</p>
                            </div>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-10 h-10 rounded-full bg-[#00D4C8]/20 text-[#00D4C8] flex items-center justify-center hover:bg-[#00D4C8] hover:text-[#0a0f1a] transition-all disabled:opacity-50"
                            >
                                <Save size={18} />
                            </button>
                        </div>

                        {/* Day Tabs */}
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                            {itinerary.dailyPlan.map((d) => (
                                <button
                                    key={d.day}
                                    onClick={() => setActiveDay(d.day)}
                                    className={`flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeDay === d.day ? 'bg-white text-[#0a0f1a] shadow-lg' : 'glass-card text-gray-400'}`}
                                >
                                    Day {d.day}
                                </button>
                            ))}
                        </div>

                        {/* Day Content Timeline */}
                        <div className="glass-card p-5 rounded-[2rem] border border-white/10 flex-1 relative overflow-hidden">
                            {(() => {
                                const current = itinerary.dailyPlan.find(d => d.day === activeDay);
                                if (!current) return null;
                                return (
                                    <div className="relative">
                                        <h3 className="font-bold text-lg mb-6 text-[#00D4C8]">{current.title}</h3>
                                        
                                        <div className="absolute left-3 top-10 bottom-4 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
                                        
                                        <div className="space-y-6">
                                            {current.activities.map((act, i) => (
                                                <div key={i} className="relative pl-8">
                                                    <div className="absolute left-[7px] top-1.5 w-2 h-2 rounded-full bg-[#FF6B35] shadow-[0_0_8px_#FF6B35]" />
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{act.time}</div>
                                                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 shadow-sm hover:border-[#00D4C8]/30 transition-colors">
                                                        <h4 className="font-bold text-sm text-white">{act.activity}</h4>
                                                        <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#13181f] text-gray-400 uppercase tracking-widest border border-white/5">
                                                            {act.type}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        
                        <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-xl p-3 flex items-start gap-3 mt-2">
                            <AlertCircle size={16} className="text-[#FF6B35] shrink-0 mt-0.5" />
                            <p className="text-xs text-[#FF6B35] font-medium leading-relaxed">This itinerary is AI-generated. Flight and hotel bookings should be made separately via the Book tab.</p>
                        </div>
                        
                        <button 
                            onClick={() => setItinerary(null)}
                            className="bg-white/5 text-gray-300 font-bold py-3 rounded-xl hover:bg-white/10 transition-colors mt-2 border border-white/10"
                        >
                            Plan Another Trip
                        </button>
                    </div>
                )}
            </div>

            <BottomNavBar />
        </div>
    );
}
