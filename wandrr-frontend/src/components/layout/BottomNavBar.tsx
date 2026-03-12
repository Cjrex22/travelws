import { Link, useLocation } from 'react-router-dom';
import { Compass, Home, Briefcase, Map, User } from 'lucide-react';

export default function BottomNavBar() {
    const location = useLocation();
    
    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/explore', icon: Compass, label: 'Explore' },
        { path: '/book', icon: Briefcase, label: 'Book' },
        { path: '/itinerary', icon: Map, label: 'Itinerary' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 glass-nav z-50 px-6 py-3 pb-safe border-t border-white/10">
            <div className="flex justify-between items-center max-w-md mx-auto relative">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path) || 
                                    (item.path === '/dashboard' && location.pathname === '/');
                    
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className="relative flex flex-col items-center p-2 group"
                        >
                            <div className={`relative transition-all duration-300 ${isActive ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
                                <Icon 
                                    size={24} 
                                    className={`transition-colors duration-300 ${isActive ? 'text-[#00D4C8] drop-shadow-[0_0_8px_rgba(0,212,200,0.5)]' : 'text-gray-400 group-hover:text-white'}`} 
                                />
                                {isActive && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4C8] shadow-[0_0_8px_#00D4C8]" />
                                )}
                            </div>
                            <span className={`text-[10px] mt-1.5 font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
