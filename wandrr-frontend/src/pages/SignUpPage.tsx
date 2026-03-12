import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [bio, setBio] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const passwordValid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        if (!passwordValid) {
            setError('Password must have 8+ chars, uppercase, number, and special character.')
            return
        }

        setIsLoading(true)
        try {
            await register({ fullName, email, password, confirmPassword, bio })
            navigate('/signin')
        } catch (err: any) {
            if (err.code === 'ECONNABORTED' || err.code === 'ERR_CANCELED' || err.message?.includes('timeout') || err.message?.includes('Network Error')) {
                setError('Server is waking up (free tier). Please try again in ~30 seconds.')
            } else {
                const msg = err.response?.data?.message || 'Registration failed.'
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
                    <span className="text-5xl mb-6">🌍</span>
                    <h2 className="text-white text-4xl font-black tracking-tight leading-tight mb-4">
                        Join Wandrr
                    </h2>
                    <p className="text-white/70 text-lg font-light leading-relaxed max-w-xs mx-auto">
                        Create your account and start planning amazing group trips today.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex flex-col justify-center bg-[#f8f9fa] px-12 lg:px-16 py-12 h-screen overflow-y-auto hide-scrollbar">
                <div className="w-full max-w-md mx-auto">
                    <div className="lg:hidden text-center mb-6">
                        <span className="text-4xl">✈️</span>
                        <h1 className="text-2xl font-extrabold text-[#0a1629]">Wandrr</h1>
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500 text-sm mb-8">Fill in your details to get started</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">person</span>
                                <input
                                    id="signup-fullname"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">mail</span>
                                <input
                                    id="signup-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock</span>
                                <input
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-4 rounded-xl border border-slate-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {/* Password strength hints */}
                            <div className="flex gap-4 mt-2 text-[10px] font-bold tracking-widest uppercase">
                                <span className={password.length >= 8 ? 'text-[#FF6B35]' : 'text-gray-400'}>✓ 8+ chars</span>
                                <span className={/[A-Z]/.test(password) ? 'text-[#FF6B35]' : 'text-gray-400'}>✓ Uppercase</span>
                                <span className={/[0-9]/.test(password) ? 'text-[#FF6B35]' : 'text-gray-400'}>✓ Number</span>
                                <span className={/[!@#$%^&*]/.test(password) ? 'text-[#FF6B35]' : 'text-gray-400'}>✓ Symbol</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock_reset</span>
                                    <input
                                        id="signup-confirm-password"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-4 text-gray-400 text-xl">description</span>
                                    <textarea
                                        id="signup-bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={1}
                                        maxLength={500}
                                        className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none transition-all resize-none text-sm"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            id="signup-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] text-white font-bold text-base shadow-lg shadow-[#FF6B35]/20 hover:shadow-xl hover:shadow-[#FF6B35]/30 transition-all duration-300 hover:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    SAVE PROFILE
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6 pb-6">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-[#FF6B35] font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>

                    <div className="flex items-center justify-center gap-4 border-t border-slate-200 pt-6 pb-8">
                        <button type="button" className="flex-1 py-3 rounded-full border border-slate-300 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors">Google</button>
                        <button type="button" className="flex-1 py-3 rounded-full border border-slate-300 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors">Apple</button>
                        <button type="button" className="flex-1 py-3 rounded-full border border-slate-300 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors">Facebook</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
