import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api, { setAccessToken, getAccessToken } from '../lib/api'

interface User {
    id: string
    fullName: string
    email: string
    bio?: string
    avatarUrl?: string
    username: string
    role: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => void
}

interface RegisterData {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    bio?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Try to restore session on mount — with a short timeout
        // so the app doesn't hang if Render backend is cold-starting
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000) // 5s max wait

        const tryRefresh = async () => {
            try {
                const { data } = await api.post('/api/auth/refresh', {}, {
                    signal: controller.signal,
                    timeout: 5000,
                })
                setAccessToken(data.accessToken)
                setUser(data.user)
            } catch {
                // No valid session or server cold-starting — let user login fresh
            } finally {
                clearTimeout(timeout)
                setIsLoading(false)
            }
        }
        tryRefresh()

        return () => {
            clearTimeout(timeout)
            controller.abort()
        }
    }, [])

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/api/auth/login', { email, password })
        setAccessToken(data.accessToken)
        setUser(data.user)
    }

    const register = async (registerData: RegisterData) => {
        await api.post('/api/auth/register', registerData)
    }

    const logout = async () => {
        try {
            await api.post('/api/auth/logout')
        } catch { /* ignore */ }
        setAccessToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
