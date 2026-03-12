import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignInPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err: any) {
            if (err.code === 'ECONNABORTED' || err.code === 'ERR_CANCELED' || err.message?.includes('timeout') || err.message?.includes('Network Error')) {
                setError('Server is waking up (free tier). Please try again in ~30 seconds.')
            } else {
                const msg = err.response?.data?.message || 'Login failed. Please try again.'
                setError(msg)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left — Decorative Jungle River Panel */}
            <div className="relative hidden lg:flex w-1/2 h-screen overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ filter: 'brightness(0.55) saturate(1.1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70" />

                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-12 text-center">
                    <span className="text-5xl mb-6">✈️</span>
                    <h2 className="text-white text-4xl font-black tracking-tight leading-tight mb-4">
                        Welcome Back
                    </h2>
                    <p className="text-white/70 text-lg font-light leading-relaxed max-w-xs mx-auto">
                        Your adventures await. Sign in to continue planning your next trip.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex flex-col justify-center bg-[#f8f9fa] px-12 lg:px-16">
                <div className="w-full max-w-md mx-auto">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <span className="text-4xl">✈️</span>
                        <h1 className="text-2xl font-extrabold text-[#0a1629]">Wandrr</h1>
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-2">Sign In</h1>
                    <p className="text-slate-500 text-sm mb-8">Enter your credentials to access your account</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                    mail
                                </span>
                                <input
                                    id="signin-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                    lock
                                </span>
                                <input
                                    id="signin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-4 rounded-xl border border-slate-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 accent-[#FF6B35]" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-[#FF6B35] hover:underline font-semibold"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            id="signin-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold text-base transition-all duration-300 hover:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="text-[#FF6B35] font-semibold hover:underline">
                            Get Started
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
