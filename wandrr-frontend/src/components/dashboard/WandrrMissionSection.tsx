export default function WandrrMissionSection() {
    const features = [
        { icon: 'auto_awesome', title: 'AI Planning', desc: 'Smart itineraries tailored to your style.' },
        { icon: 'splitscreen', title: 'Splitter', desc: 'Effortless expense sharing & math.' },
        { icon: 'photo_library', title: 'Memories', desc: 'A secure vault for your group photos.' },
    ]

    return (
        <section className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#0d1b35]/90 to-[#1a2235]/95 border border-white/[0.08] text-center shadow-2xl shadow-black/40">
            {/* Background decorative elements */}
            <div className="absolute -top-12 -left-12 size-32 bg-[#FF6B35]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -right-12 size-32 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 w-full">
                <div className="inline-flex items-center justify-center p-2 rounded-xl bg-white/5 mb-4 border border-white/10 shadow-sm">
                    <span className="material-symbols-outlined text-[#FF6B35]">explore</span>
                </div>

                <h2 className="text-2xl font-black mb-3 text-white tracking-tight">
                    The Wandrr Mission
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[280px] mx-auto font-medium">
                    We believe travel should be about the moments, not the management.
                    <span className="text-slate-300"> Wandrr brings AI planning, expense math, and shared memories into one elegant space.</span>
                </p>

                {/* 3 feature pillars */}
                <div className="grid grid-cols-3 gap-3">
                    {features.map((feature, idx) => (
                        <div key={feature.title} className="flex flex-col items-center gap-3 group relative">
                            {/* Connector line for middle item (desktop sizing logic skipped for mobile specific layout) */}

                            <div className="size-14 rounded-2xl bg-gradient-to-br from-[#FF6B35]/10 to-[#ff8e53]/5 flex items-center justify-center border border-[#FF6B35]/20 group-hover:bg-[#FF6B35]/20 group-hover:border-[#FF6B35]/40 transition-all duration-300 shadow-inner group-hover:scale-110">
                                <span className="material-symbols-outlined text-[#FF6B35] text-[28px] group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 items-center">
                                <span className="text-[11px] font-black text-white/90 uppercase tracking-wider">{feature.title}</span>
                                <span className="text-[10px] text-slate-500 text-center leading-relaxed max-w-[80px] font-medium group-hover:text-slate-400 transition-colors">
                                    {feature.desc}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
