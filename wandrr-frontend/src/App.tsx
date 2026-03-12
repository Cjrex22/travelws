import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AllTripsPage from './pages/AllTripsPage'
import TripDetailPage from './pages/TripDetailPage'
import CreateTripPage from './pages/CreateTripPage'
import ExpensesPage from './pages/ExpensesPage'
import TripExpensesPage from './pages/TripExpensesPage'
import BreakdownPage from './pages/BreakdownPage'
import ProfilePage from './pages/ProfilePage'
import ExplorePage from './pages/ExplorePage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import BookPage from './pages/BookPage'
import PackageDetailPage from './pages/PackageDetailPage'
import MyBookingsPage from './pages/MyBookingsPage'
import ItineraryPlannerPage from './pages/ItineraryPlannerPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#13181f] gap-4">
                <div className="text-2xl font-bold text-white tracking-wide">WANDRR</div>
                <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm animate-pulse">Connecting to server...</p>
            </div>
        )
    }
    return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><AllTripsPage /></ProtectedRoute>} />
            <Route path="/trips/new" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
            <Route path="/trips/:id" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
            <Route path="/explore/:id" element={<ProtectedRoute><DestinationDetailPage /></ProtectedRoute>} />
            <Route path="/book" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
            <Route path="/book/package/:id" element={<ProtectedRoute><PackageDetailPage /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
            <Route path="/itinerary" element={<ProtectedRoute><ItineraryPlannerPage /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
            <Route path="/expenses/:tripId" element={<ProtectedRoute><TripExpensesPage /></ProtectedRoute>} />
            <Route path="/expenses/:tripId/breakdown" element={<ProtectedRoute><BreakdownPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
    )
}
