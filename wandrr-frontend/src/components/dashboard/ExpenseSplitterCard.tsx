import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ExpenseSplitterCard() {
    const navigate = useNavigate()
    const { user } = useAuth()

    // Mock data for initial UI render
    const expenseSummary = { total: 0 }
    const userBalance = 0
    const members = [
        { id: 1, avatarUrl: user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=FF6B35&color=fff` }
    ]

    return (
        <section className="space-y-4 relative z-10 w-full">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400">payments</span>
                    Expense Splitter
                </h3>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#0d1b35] to-[#13181f] border border-white/[0.08] shadow-xl shadow-black/40">
                {/* Top row: total + icon */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <p className="text-blue-200/60 text-xs font-semibold uppercase tracking-widest mb-1">
                            Total Shared Expenses
                        </p>
                        <p className="text-4xl font-black tracking-tight text-white flex items-baseline gap-1">
                            <span className="text-2xl text-white/50">₹</span>
                            {expenseSummary.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/20 shadow-inner">
                        <span className="material-symbols-outlined text-blue-400 text-2xl">account_balance_wallet</span>
                    </div>
                </div>

                {/* Background glow decoration */}
                <div className="absolute -bottom-10 -right-10 size-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-10 -left-10 size-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Member avatar stack */}
                <div className="flex items-center justify-between relative z-10 mb-6">
                    <div className="flex -space-x-3">
                        {members.slice(0, 3).map(m => (
                            <img
                                key={m.id}
                                src={m.avatarUrl}
                                alt="Member"
                                className="size-10 rounded-full border-2 border-[#0d1b35] object-cover shadow-sm bg-[#1a2235]"
                            />
                        ))}
                        {members.length > 3 && (
                            <div className="size-10 rounded-full border-2 border-[#0d1b35] bg-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-sm z-10">
                                +{members.length - 3}
                            </div>
                        )}
                        {members.length === 1 && (
                            <div className="size-10 rounded-full border-2 border-[#0d1b35] bg-white/5 flex items-center justify-center border-dashed backdrop-blur-sm z-10">
                                <span className="material-symbols-outlined text-white/40 text-[18px]">person_add</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Divider Line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5 relative z-10" />

                {/* Balance Status */}
                <div className="flex justify-between items-center relative z-10">
                    <span className="text-slate-400 text-sm font-medium">
                        {userBalance === 0 ? 'You are settled up' : (userBalance > 0 ? 'You are owed' : 'You owe')}
                    </span>
                    <span className={`font-black text-lg font-mono ${userBalance === 0 ? 'text-slate-300' : (userBalance > 0 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]')}`}>
                        {userBalance === 0 ? '' : (userBalance > 0 ? '+' : '-')}
                        ₹{Math.abs(userBalance).toFixed(2)}
                    </span>
                </div>

                {/* View breakdown button */}
                <button
                    onClick={() => navigate('/expenses')}
                    className="mt-5 w-full py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.06] text-sm font-semibold text-white transition-all duration-300 border border-white/[0.08] flex items-center justify-center gap-2 relative z-10 backdrop-blur-md"
                >
                    View Full Breakdown
                    <span className="material-symbols-outlined text-[18px] opacity-70">arrow_forward</span>
                </button>
            </div>
        </section>
    )
}
