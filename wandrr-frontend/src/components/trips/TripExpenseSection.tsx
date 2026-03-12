export default function TripExpenseSection({ tripId }: { tripId: string }) {
    // This is a placeholder section that will be connected to the actual API
    // by the user in the future as per their prompt requirements.
    return (
        <section className="bg-gradient-to-br from-[#0d1b35] to-[#13181f] rounded-2xl p-6 border border-white/[0.06] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF6B35]">account_balance_wallet</span>
                    Trip Expenses
                </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-6 text-center relative z-10">
                <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10 shadow-inner">
                    <span className="material-symbols-outlined text-white/40 text-3xl">receipt_long</span>
                </div>
                <p className="text-slate-400 text-sm max-w-[200px] leading-relaxed">
                    No expenses logged yet. Tap the <span className="text-[#3b82f6] font-bold">+</span> button below to add your first expense.
                </p>
            </div>

            {/* Decorative background blurs */}
            <div className="absolute -bottom-8 -right-8 size-32 bg-[#FF6B35]/10 rounded-full blur-2xl pointer-events-none" />
        </section>
    )
}
