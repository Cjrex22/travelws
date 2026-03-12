import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 15000, // 15s timeout — prevents hanging on Render cold starts
})

// Access token stored in memory (not localStorage for security)
let accessToken: string | null = null
let isRefreshing = false

export const setAccessToken = (token: string | null) => {
    accessToken = token
}

export const getAccessToken = () => accessToken

// Request interceptor — attach Bearer token
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Skip refresh logic for auth endpoints to prevent loops
        const isAuthEndpoint = originalRequest?.url?.includes('/api/auth/')

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint &&
            !isRefreshing
        ) {
            originalRequest._retry = true
            isRefreshing = true
            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                )
                setAccessToken(data.accessToken)
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
                return api(originalRequest)
            } catch {
                setAccessToken(null)
                // Don't redirect here — let the ProtectedRoute component handle it
                // This prevents the infinite reload loop
            } finally {
                isRefreshing = false
            }
        }
        return Promise.reject(error)
    }
)

export default api
