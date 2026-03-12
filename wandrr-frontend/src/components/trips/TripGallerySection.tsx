import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

interface GalleryPhoto {
    id: string
    imageUrl: string
    caption?: string
    createdAt?: string
}

interface TripGallerySectionProps {
    tripId: string
}

export default function TripGallerySection({ tripId }: TripGallerySectionProps) {
    const uploadRef = useRef<HTMLInputElement>(null)
    const [photos, setPhotos] = useState<GalleryPhoto[]>([])
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!tripId) return
        api.get(`/api/gallery?tripId=${tripId}`)
            .then(({ data }) => {
                if (data.data) setPhotos(data.data)
            })
            .catch((err) => {
                console.error('Failed to fetch trip gallery:', err)
                if (err.response?.status === 403) {
                    setError("You don't have permission to view this gallery.")
                }
            })
    }, [tripId])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        setError(null)
        try {
            const formData = new FormData()
            Array.from(files).forEach(f => formData.append('images', f))
            // Specify that this is for the trip gallery
            formData.append('isPersonal', 'false')

            const { data } = await api.post(`/api/gallery?tripId=${tripId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (data.data) {
                // Add the newly uploaded photos to the top of the grid
                setPhotos(prev => [...data.data, ...prev])
            }
        } catch (err: any) {
            console.error('Upload failed:', err)
            setError(err.response?.data?.message || 'Failed to upload photos')
        }
        setUploading(false)
        // Reset input
        if (uploadRef.current) uploadRef.current.value = ''
    }

    return (
        <section className="bg-gradient-to-br from-[#0d1b35] to-[#13181f] rounded-2xl p-5 border border-white/[0.06] shadow-xl relative overflow-hidden mt-8">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="font-bold text-base flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF6B35]">photo_library</span>
                    Trip Memories
                </h3>
                <button
                    onClick={() => uploadRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 hover:bg-[#FF6B35]/20 transition-colors disabled:opacity-50"
                >
                    {uploading ? (
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    ) : (
                        <span className="material-symbols-outlined text-sm">add_a_photo</span>
                    )}
                    {uploading ? 'Uploading...' : 'Add Photo'}
                </button>
            </div>

            <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
            />

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4 text-center">
                    {error}
                </div>
            )}

            {photos.length === 0 && !uploading && !error ? (
                <div className="bg-[#1a2235]/50 rounded-xl p-6 text-center border border-white/[0.04]">
                    <span className="text-3xl block mb-2 opacity-50">📸</span>
                    <p className="text-white/70 text-sm font-medium">No memories yet.</p>
                    <p className="text-white/40 text-xs mt-1">Upload the first photo from this trip!</p>
                </div>
            ) : (
                <div className="columns-2 gap-2 space-y-2 relative z-10">
                    {photos.map((photo, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.3 }}
                            key={photo.id}
                            className="break-inside-avoid rounded-lg overflow-hidden relative group cursor-pointer border border-white/5"
                        >
                            <img
                                src={photo.imageUrl}
                                alt={photo.caption || 'Trip memory'}
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {photo.caption && <p className="text-white text-[10px] truncate">{photo.caption}</p>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    )
}
