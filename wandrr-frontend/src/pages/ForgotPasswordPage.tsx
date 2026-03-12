import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [resetToken, setResetToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            await api.post('/api/auth/forgot-password', { email })
            setStep('otp')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const { data } = await api.post('/api/auth/verify-otp', { email, otp })
            setResetToken(data.data)
            setStep('reset')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        setIsLoading(true)
        try {
            await api.post('/api/auth/reset-password', {
                resetToken,
                newPassword,
                confirmPassword,
            })
            setStep('done')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] px-8">
            <div className="w-full max-w-md">
                <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
                    <span className="text-3xl">✈️</span>
                    <span className="text-2xl font-extrabold text-[#0a1629]">Wandrr</span>
                </Link>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                {step === 'email' && (
                    <>
                        <h1 className="text-3xl font-black text-[#0a1629] mb-2">Forgot Password</h1>
                        <p className="text-gray-500 mb-8">We'll send a 6-digit OTP to your email</p>
                        <form onSubmit={handleEmailSubmit} className="space-y-5">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">mail</span>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] outline-none transition-all" placeholder="you@example.com" />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] text-white font-bold shadow-lg shadow-[#FF6B35]/25 hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send OTP'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'otp' && (
                    <>
                        <h1 className="text-3xl font-black text-[#0a1629] mb-2">Enter OTP</h1>
                        <p className="text-gray-500 mb-8">Check your email for the 6-digit code</p>
                        <form onSubmit={handleOtpSubmit} className="space-y-5">
                            <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 text-center text-2xl font-bold tracking-[12px] focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] outline-none transition-all" placeholder="000000" />
                            <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] text-white font-bold shadow-lg shadow-[#FF6B35]/25 hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify OTP'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'reset' && (
                    <>
                        <h1 className="text-3xl font-black text-[#0a1629] mb-2">New Password</h1>
                        <p className="text-gray-500 mb-8">Enter your new password</p>
                        <form onSubmit={handleResetSubmit} className="space-y-5">
                            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] outline-none transition-all" placeholder="New password" />
                            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] outline-none transition-all" placeholder="Confirm password" />
                            <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] text-white font-bold shadow-lg shadow-[#FF6B35]/25 hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'done' && (
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                        </div>
                        <h1 className="text-3xl font-black text-[#0a1629] mb-2">Password Reset!</h1>
                        <p className="text-gray-500 mb-8">You can now sign in with your new password</p>
                        <Link to="/signin" className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#ff8e53] text-white font-bold shadow-lg shadow-[#FF6B35]/25 hover:scale-[1.02] transition-all">
                            Sign In
                        </Link>
                    </div>
                )}

                <p className="text-center text-sm text-gray-500 mt-8">
                    <Link to="/signin" className="text-[#FF6B35] font-semibold hover:underline">
                        Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
