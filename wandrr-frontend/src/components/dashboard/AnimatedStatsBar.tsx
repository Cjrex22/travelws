import { Map, Users, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

interface Stats {
    totalTrips: number;
    buddies: number;
    upcoming: number;
}

export default function AnimatedStatsBar() {
    const { data: stats } = useQuery({
        queryKey: ['userStats'],
        queryFn: async () => {
            const { data } = await api.get('/api/user/stats'); // Backend endpoint we added in UserService
            return data.data as Stats;
        },
    });

    const items = [
        { label: 'Upcoming', count: stats?.upcoming || 0, icon: Calendar, color: 'from-[#00D4C8] to-[#009189]' },
        { label: 'Past Trips', count: stats?.totalTrips || 0, icon: Map, color: 'from-[#FF6B35] to-[#D14F1D]' },
        { label: 'Buddies', count: stats?.buddies || 0, icon: Users, color: 'from-[#8A2BE2] to-[#6A1CB2]' },
    ];

    return (
        <div className="grid grid-cols-3 gap-3 w-full my-2">
            {items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div key={item.label} 
                         className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden group cursor-default hover:bg-white/10 transition-colors duration-300"
                         style={{ animationDelay: `${index * 150}ms` }}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-lg" />
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon size={20} className="text-white drop-shadow-md" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight mb-1">{item.count}</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
