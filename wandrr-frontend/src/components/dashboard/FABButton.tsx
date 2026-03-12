import { useNavigate } from 'react-router-dom'

export default function FABButton() {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate('/trips/new')}
            className="fixed bottom-24 right-5 z-40 size-14 bg-[#FF6B35] hover:bg-[#e55a2b] rounded-full shadow-xl shadow-[#FF6B35]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
            aria-label="Create New Trip"
        >
            <span className="material-symbols-outlined text-white text-3xl transition-transform duration-300 group-hover:rotate-90">
                add
            </span>
        </button>
    )
}
