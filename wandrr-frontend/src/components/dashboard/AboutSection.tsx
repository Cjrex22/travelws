export default function AboutSection() {
    return (
        <section className="rounded-2xl p-6 bg-[#1a2235] border border-white/[0.06] shadow-lg w-full relative overflow-hidden group">
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

            <div className="relative z-10">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-slate-400 text-xl">info</span>
                    About Wandrr
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed mb-5 font-medium">
                    Wandrr was founded by a group of passionate travellers who were tired of juggling
                    spreadsheets, messy group chats, and fragmented photo albums. We built the app we always wished existed.
                </p>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 line-clamp-2">
                    <div className="bg-[#0a1629] p-2 rounded-lg border border-white/10 shadow-sm shrink-0">
                        <span className="text-xl">✈️</span>
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold tracking-wide">Wandrr Technologies</p>
                        <p className="text-[#FF6B35] text-[11px] font-bold uppercase tracking-widest mt-0.5">Built for explorers</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
