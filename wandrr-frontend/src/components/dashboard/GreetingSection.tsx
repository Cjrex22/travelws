import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function GreetingSection() {
    const { user } = useAuth();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours();
    let greeting = 'Good evening';
    if (hours < 12) greeting = 'Good morning';
    else if (hours < 18) greeting = 'Good afternoon';

    return (
        <div className="flex justify-between items-end mt-4 mb-2">
            <div className="flex flex-col animate-[fadeIn_0.5s_ease-out]">
                <p className="text-[#00D4C8] text-sm font-medium tracking-wider uppercase mb-1 drop-shadow-[0_0_8px_rgba(0,212,200,0.5)]">
                    {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <h1 className="text-3xl font-bold tracking-tight">
                    {greeting}, <span className="text-gradient drop-shadow-md">{user?.fullName?.split(' ')[0] || 'Explorer'}</span>.
                </h1>
                <p className="text-gray-400 mt-2 text-sm max-w-[280px] leading-relaxed">
                    Ready for your next adventure? Let's wander out yonder.
                </p>
            </div>
            {user?.avatarUrl && (
                <div className="w-12 h-12 rounded-full border-2 border-[#00D4C8]/50 overflow-hidden shadow-[0_0_15px_rgba(0,212,200,0.3)] animate-float">
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
            )}
        </div>
    );
}
