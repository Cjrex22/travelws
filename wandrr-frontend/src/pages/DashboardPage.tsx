import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

import Header from '../components/layout/Header'
import BottomNavBar from '../components/layout/BottomNavBar'
import GreetingSection from '../components/dashboard/GreetingSection'
import WeatherCard from '../components/dashboard/WeatherCard'
import AnimatedStatsBar from '../components/dashboard/AnimatedStatsBar'
import HeroCarousel from '../components/dashboard/HeroCarousel'
import UpcomingTripsSection from '../components/dashboard/UpcomingTripsSection'
import TrendingDestinationsSection from '../components/dashboard/TrendingDestinationsSection'
import SocialLinksFooter from '../components/layout/SocialLinksFooter'
import FABButton from '../components/dashboard/FABButton'

interface Trip {
    id: string
    name: string
    description?: string
    status: string
    startDate?: string
    endDate?: string
    bannerUrl?: string
    members: { id: string; fullName: string; username: string; avatarUrl?: string; role: string }[]
    createdBy: { fullName: string }
    createdAt?: string
}

function formatDate(date?: string) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DashboardPage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [showCreate, setShowCreate] = useState(false)
    const [newTripName, setNewTripName] = useState('')
    const [newTripDesc, setNewTripDesc] = useState('')
    const [newTripStart, setNewTripStart] = useState('')
    const [newTripEnd, setNewTripEnd] = useState('')

    const { data: tripsData, isLoading } = useQuery({
        queryKey: ['trips'],
        queryFn: async () => {
            const { data } = await api.get('/api/trips')
            return data.data as Trip[]
        },
    })

    const createTripMutation = useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.post('/api/trips', payload)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trips'] })
            setShowCreate(false)
            setNewTripName('')
            setNewTripDesc('')
            setNewTripStart('')
            setNewTripEnd('')
        },
    })

    const handleCreateTrip = (e: FormEvent) => {
        e.preventDefault()
        createTripMutation.mutate({
            name: newTripName,
            description: newTripDesc || null,
            startDate: newTripStart || null,
            endDate: newTripEnd || null,
            memberIds: [],
        })
    }

    const trips = tripsData || []

    return (
        <div className="min-h-screen bg-[#13181f] text-white flex flex-col font-sans relative pb-20">
            {/* Top Navigation */}
            <Header />

            {/* Main Content Area — Mobile Container Sizing */}
            <main className="flex-1 px-4 py-8 flex flex-col gap-6 max-w-lg mx-auto w-full relative z-10 overflow-x-hidden">
                <GreetingSection />
                
                <AnimatedStatsBar />

                <HeroCarousel />

                <WeatherCard />

                {isLoading ? (
                    <div className="flex items-center justify-center py-10 scale-90">
                        <div className="w-10 h-10 border-4 border-[#00D4C8] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <UpcomingTripsSection trips={trips} />
                )}

                <TrendingDestinationsSection />

                <SocialLinksFooter />
            </main>

            {/* Floating Action Button */}
            <FABButton />

            {/* Bottom Navigation */}
            <BottomNavBar />

            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 mix-blend-screen">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#FF6B35]/5 blur-[120px]" />
                <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>
        </div>
    )
}

