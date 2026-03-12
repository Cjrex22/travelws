import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../lib/api'

interface GalleryPhoto {
    id: string
    imageUrl: string
    caption?: string
    createdAt?: string
}

export default function SharedMemoriesSection() {
    const navigate = useNavigate()
    const uploadRef = useRef<HTMLInputElement>(null)
    const [photos, setPhotos] = useState<GalleryPhoto[]>([])
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        api.get('/api/gallery/personal')
            .then(({ data }) => {
                if (data.data) setPhotos(data.data)
            })
            .catch(() => { })
    }, [])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        try {
            const formData = new FormData()
            Array.from(files).forEach(f => formData.append('images', f))
            formData.append('isPersonal', 'true')

            const { data } = await api.post('/api/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (data.data) {
                setPhotos(prev => [...data.data, ...prev])
            }
        } catch (err) {
            console.error('Upload failed:', err)
        }
        setUploading(false)
        // Reset input
        if (uploadRef.current) uploadRef.current.value = ''
    }

    if (photos.length === 0 && !uploading) {
        return (
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#FF6B35]">photo_library</span>
                        Shared Memories
                    </h3>
                    <button
                        onClick={() => uploadRef.current?.click()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 hover:bg-[#FF6B35]/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">upload</span>
                        Upload
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
                <div className="bg-[#1a2235] rounded-2xl p-8 text-center border border-white/[0.06] shadow-lg">
                    <span className="text-4xl block mb-4 animate-float">📸</span>
                    <p className="text-white font-semibold text-sm">No memories yet</p>
                    <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                        Upload your personal travel photos. Only you can see them.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF6B35]">photo_library</span>
                    Shared Memories
                </h3>
                <button
                    onClick={() => uploadRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 hover:bg-[#FF6B35]/20 transition-colors"
                >
                    {uploading ? (
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    ) : (
                        <span className="material-symbols-outlined text-sm">upload</span>
                    )}
                    {uploading ? 'Uploading...' : 'Upload'}
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

            {/* Masonry layout */}
            <div className="columns-2 gap-3 space-y-3">
                {photos.map((photo, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        key={photo.id}
                        className="break-inside-avoid rounded-xl overflow-hidden relative group cursor-pointer border border-white/10 shadow-lg"
                    >
                        <img
                            src={photo.imageUrl}
                            alt={photo.caption || 'Trip memory'}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="material-symbols-outlined text-white/90 text-4xl drop-shadow-lg scale-50 group-hover:scale-100 transition-transform duration-300 ease-out">
                                favorite
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
