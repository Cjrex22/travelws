export default function SocialLinksFooter() {
    const socials = [
        { name: 'Instagram', icon: 'photo_camera', href: 'https://instagram.com/wandrr', color: 'hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-500/10' },
        { name: 'Twitter', icon: 'tag', href: 'https://twitter.com/wandrr', color: 'hover:text-sky-400 hover:border-sky-500/30 hover:bg-sky-500/10' },
        { name: 'Facebook', icon: 'groups', href: 'https://facebook.com/wandrr', color: 'hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/10' },
    ]

    return (
        <footer className="pb-8 pt-4 w-full text-center relative z-10">
            <p className="text-slate-500 text-[10px] mb-5 uppercase tracking-[0.2em] font-bold">
                Follow Our Journey
            </p>

            <div className="flex justify-center gap-5">
                {socials.map(social => (
                    <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center gap-2 text-slate-400 transition-all duration-300 group`}
                    >
                        <div className={`size-12 rounded-2xl bg-white/[0.04] flex items-center justify-center transition-all duration-300 border border-white/[0.06] group-hover:scale-110 shadow-lg ${social.color}`}>
                            <span className="material-symbols-outlined text-[20px] transition-colors">{social.icon}</span>
                        </div>
                        <span className="text-[10px] font-bold tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                            {social.name}
                        </span>
                    </a>
                ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
                <div className="w-12 h-1 bg-white/[0.06] rounded-full" />
                <p className="text-slate-600/80 text-[11px] font-medium tracking-wide">
                    © {new Date().getFullYear()} Wandrr Technologies. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
