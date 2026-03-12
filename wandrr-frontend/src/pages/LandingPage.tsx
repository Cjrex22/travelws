import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
    const { isAuthenticated } = useAuth()

    return (
        <div className="min-h-screen bg-[#0a1629] text-white overflow-hidden">
            {/* Mountain Parallax Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85"
                    alt=""
                    className="w-full h-full object-cover object-center scale-105"
                    style={{ filter: 'brightness(0.35) saturate(0.8)' }}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
                {/* Subtle radial glow */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 70% 50% at 50% 55%, rgba(255,107,53,0.08) 0%, transparent 70%)'
                    }}
                />
            </div>

            {/* NAV */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">✈️</span>
                    <span className="text-2xl font-extrabold tracking-tight">Wandrr</span>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <Link
                            to="/dashboard"
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] font-semibold text-sm hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all duration-300 hover:scale-105"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/signin"
                                className="px-6 py-2.5 rounded-xl border border-white/20 font-medium text-sm hover:bg-white/10 transition-all duration-300"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] font-semibold text-sm hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all duration-300 hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* HERO */}
            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden px-8 -mt-20">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-sm text-white/70">
                        <span className="material-symbols-outlined text-[#FF6B35] text-lg">rocket_launch</span>
                        AI-Powered Travel Planning
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                        Your Next{' '}
                        <span className="bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] bg-clip-text text-transparent">
                            Adventure
                        </span>{' '}
                        Starts Here
                    </h1>

                    <p className="text-xl text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
                        Plan trips with friends, split expenses effortlessly, and store your
                        travel memories — all in one beautiful app.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="group px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] font-bold text-lg shadow-xl shadow-[#FF6B35]/25 hover:shadow-2xl hover:shadow-[#FF6B35]/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            Start Planning
                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                                arrow_forward
                            </span>
                        </Link>
                        <button className="px-8 py-3.5 rounded-2xl border border-white/20 font-semibold text-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">play_circle</span>
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="absolute bottom-0 left-0 right-0 w-full px-8 pb-12">
                    <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                        {[
                            { stat: '50k+', label: 'Trips Planned' },
                            { stat: '120+', label: 'Destinations' },
                            { stat: '4.9⭐', label: 'User Rating' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="text-center p-6 rounded-2xl glass hover:bg-white/10 transition-all duration-300 backdrop-blur-md bg-white/5 border border-white/10"
                            >
                                <div className="text-3xl font-black text-[#FF6B35]">
                                    {item.stat}
                                </div>
                                <div className="text-sm text-white/50 mt-1 font-medium tracking-wide uppercase">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Features */}
            <section className="relative z-10 py-32 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-8">
                {[
                    {
                        icon: 'flight_takeoff',
                        title: 'Smart Trip Planning',
                        desc: 'AI-powered itinerary suggestions tailored to your group preferences.',
                    },
                    {
                        icon: 'account_balance_wallet',
                        title: 'Expense Splitting',
                        desc: 'Automatic equal splits with one-tap settlement tracking.',
                    },
                    {
                        icon: 'photo_camera',
                        title: 'Shared Memories',
                        desc: 'Collaborative photo gallery for your group travel moments.',
                    },
                ].map((feature) => (
                    <div
                        key={feature.title}
                        className="group p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#FF6B35]/30 transition-all duration-300"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#FF6B35] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-[#FF6B35]/20">
                            <span className="material-symbols-outlined text-white text-2xl">
                                {feature.icon}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 border-t border-white/10 py-8 px-8 max-w-7xl mx-auto text-center text-sm text-white/40">
                © {new Date().getFullYear()} Wandrr. Made with ❤️ for travellers.
            </footer>
        </div>
    )
}
