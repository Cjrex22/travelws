import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Header from '../components/layout/Header'
import BottomNavBar from '../components/layout/BottomNavBar'

interface Settlement {
    from: { id: string; fullName: string; avatarUrl?: string }
    to: { id: string; fullName: string; avatarUrl?: string }
    amount: number
}

interface MemberBalance {
    user: { id: string; fullName: string; username: string; avatarUrl?: string }
    totalPaid: number
    totalOwed: number
    netBalance: number
}

export default function BreakdownPage() {
    const { tripId } = useParams<{ tripId: string }>()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [settlements, setSettlements] = useState<Settlement[]>([])
    const [memberBalances, setMemberBalances] = useState<MemberBalance[]>([])
    const [allSettled, setAllSettled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)

    useEffect(() => {
        if (!tripId) return

        const fetchData = async () => {
            try {
                const [breakdownRes, summaryRes] = await Promise.all([
                    api.get(`/api/expenses/breakdown/${tripId}`),
                    api.get(`/api/expenses/summary/${tripId}`)
                ])
                setSettlements(breakdownRes.data.settlements || [])
                setAllSettled(breakdownRes.data.allSettled || false)
                setMemberBalances(summaryRes.data.members || [])
            } catch (e) {
                console.error('Failed to fetch breakdown:', e)
            }
            setLoading(false)
        }
        fetchData()
    }, [tripId])

    const handleGenerateReport = async () => {
        setGenerating(true)
        try {
            const res = await api.get(`/api/expenses/report/${tripId}/download`, {
                responseType: 'blob'
            })
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `wandrr-expense-report-${tripId}.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (e) {
            console.error('Report download failed:', e)
        }
        setGenerating(false)
    }

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans relative pb-20">
            <Header />
            <main className="flex-1 px-4 py-6 flex flex-col gap-5 max-w-lg mx-auto w-full">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(`/expenses/${tripId}`)} className="p-2 rounded-full hover:bg-white/10">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold">💳 Full Breakdown</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Settlement Plan */}
                        {allSettled ? (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 flex flex-col items-center text-center">
                                <span className="text-5xl mb-4">🎉</span>
                                <h3 className="text-green-400 font-bold text-lg mb-2">All Settled Up!</h3>
                                <p className="text-slate-400 text-sm">No pending transactions.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">
                                    Settlement Plan — {settlements.length} transaction{settlements.length !== 1 ? 's' : ''} to clear all debts
                                </p>
                                {settlements.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-[#1a2235] rounded-2xl border border-white/[0.06]">
                                        <div className="flex items-center gap-2 flex-1">
                                            <img
                                                src={s.from.avatarUrl || `https://ui-avatars.com/api/?name=${s.from.fullName}&background=FF6B35&color=fff`}
                                                className="size-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="text-white text-sm font-bold">
                                                    {s.from.id === user?.id ? 'You' : s.from.fullName}
                                                </p>
                                                <p className="text-red-400 text-xs font-medium">Pays</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center px-2">
                                            <p className="text-white font-black text-lg">₹{s.amount.toFixed(2)}</p>
                                            <span className="material-symbols-outlined text-[#FF6B35] text-2xl">arrow_forward</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-1 justify-end">
                                            <div className="text-right">
                                                <p className="text-white text-sm font-bold">
                                                    {s.to.id === user?.id ? 'You' : s.to.fullName}
                                                </p>
                                                <p className="text-green-400 text-xs font-medium">Receives</p>
                                            </div>
                                            <img
                                                src={s.to.avatarUrl || `https://ui-avatars.com/api/?name=${s.to.fullName}&background=FF6B35&color=fff`}
                                                className="size-10 rounded-full object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Individual Balances */}
                        {memberBalances.length > 0 && (
                            <div className="space-y-3 mt-2">
                                <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">
                                    Individual Balances
                                </p>
                                {memberBalances.map(m => (
                                    <div key={m.user.id} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-white/[0.06]">
                                        <img
                                            src={m.user.avatarUrl || `https://ui-avatars.com/api/?name=${m.user.fullName}&background=FF6B35&color=fff`}
                                            className="size-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-semibold">
                                                {m.user.id === user?.id ? 'You' : m.user.fullName}
                                            </p>
                                            <p className="text-slate-500 text-xs">
                                                Paid: ₹{m.totalPaid.toFixed(2)} · Share: ₹{m.totalOwed.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className={`font-black text-base ${m.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {m.netBalance >= 0
                                                ? `+₹${m.netBalance.toFixed(2)}`
                                                : `-₹${Math.abs(m.netBalance).toFixed(2)}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Generate Report Button */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={generating}
                            className="w-full py-4 bg-[#1a2235] hover:bg-[#1e2840] rounded-2xl border border-white/[0.1] text-white font-bold flex items-center justify-center gap-2 transition-all hover:border-[#FF6B35]/40 active:scale-[0.98] disabled:opacity-50 mt-2"
                        >
                            {generating ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                    Generating Report...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[#FF6B35]">summarize</span>
                                    Generate Report
                                </>
                            )}
                        </button>
                    </>
                )}
            </main>
            <BottomNavBar />
        </div>
    )
}
