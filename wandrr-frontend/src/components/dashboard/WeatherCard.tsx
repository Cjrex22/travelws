import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, MapPin, Wind, Droplets } from 'lucide-react';
import api from '../../lib/api';
import SkeletonLoader from '../ui/SkeletonLoader';

interface WeatherData {
    weather: { description: string; main: string }[];
    main: { temp: number; humidity: number };
    wind: { speed: number };
    name: string;
}

export default function WeatherCard({ city = 'New York' }: { city?: string }) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // If OpenWeatherAPI takes too long, fall back gracefully
                const { data } = await api.get(`/api/weather/current?city=${city}`);
                setWeather(data);
            } catch (err) {
                console.error("Failed to fetch weather", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [city]);

    if (loading) return <SkeletonLoader className="h-32 w-full rounded-2xl" />;
    
    // Fallback if failing entirely
    if (!weather) return null;

    const temp = Math.round(weather.main?.temp || 0);
    const mainCondition = weather.weather?.[0]?.main || 'Clear';
    
    let Icon = Sun;
    if (mainCondition.includes('Cloud')) Icon = Cloud;
    if (mainCondition.includes('Rain') || mainCondition.includes('Drizzle')) Icon = CloudRain;

    return (
        <div className="glass-card rounded-3xl p-5 relative overflow-hidden group hover:border-[#00D4C8]/50 transition-all duration-500">
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-[#00D4C8]/20 to-transparent rounded-full blur-2xl group-hover:bg-[#00D4C8]/30 transition-all duration-700" />
            
            <div className="flex justify-between items-center relative z-10">
                <div>
                    <div className="flex items-center text-gray-400 text-xs font-medium tracking-wider uppercase mb-1">
                        <MapPin size={12} className="mr-1 text-[#FF6B35]" />
                        {weather.name || city}
                    </div>
                    <div className="flex items-end gap-2 text-white mt-2">
                        <span className="text-5xl font-bold tracking-tighter drop-shadow-lg">{temp}°</span>
                        <span className="text-lg text-gray-400 mb-1 capitalize relative top-[-4px]">{weather.weather?.[0]?.description}</span>
                    </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Icon size={32} className="text-[#00D4C8] drop-shadow-[0_0_10px_rgba(0,212,200,0.8)]" />
                </div>
            </div>
        </div>
    );
}
