'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { toast } from 'sonner' // Added import

type ProjectFormProps = {
    initialData?: any
    action: (prevState: any, formData: FormData) => Promise<any>
}

const initialState = {
    error: '',
    success: false
}

export default function ProjectForm({ initialData, action }: ProjectFormProps) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(action, initialState)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)

    const [error, setError] = useState<string>('')

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? 'Project updated successfully' : 'Project created successfully')
            router.push('/admin/projects')
            router.refresh()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, initialData, router])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 4.5 * 1024 * 1024) { // 4.5MB limit to be safe
                alert("File size exceeds 4.5MB limit. Please upload a smaller image.")
                e.target.value = '' // Clear input
                return
            }
            const url = URL.createObjectURL(file)
            setImagePreview(url)
            setError('')
        }
    }

    return (
        <form action={formAction} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Image Upload */}
                <div className="lg:col-span-1 space-y-4">
                    <label className="block text-sm font-mono text-gray-400">Project Thumbnail</label>
                    <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-800 bg-black/20 hover:border-primary/50 transition-colors overflow-hidden group">
                        {imagePreview ? (
                            <>
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-xs text-white font-mono">Change Image</p>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-xs font-mono">Upload Image</span>
                            </div>
                        )}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    {/* Hidden input to pass existing URL if no new file is chosen */}
                    {initialData?.image && (
                        <input type="hidden" name="existing_image_url" value={initialData.image} />
                    )}
                    <p className="text-xs text-gray-600 font-mono">
                        Recommended: 1920x1080 (16:9). Max 5MB.
                    </p>
                </div>

                {/* Right Column - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    {state?.error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                            Error: {state.error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-mono text-primary">Project Title</label>
                            <input
                                name="title"
                                defaultValue={initialData?.title}
                                required
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                                placeholder="e.g. Neural Network Viz"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-mono text-gray-400">Description</label>
                            <textarea
                                name="description"
                                defaultValue={initialData?.description}
                                rows={4}
                                required
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors text-sm"
                                placeholder="Describe the project logic and tech stack..."
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-mono text-gray-400">Tags (comma separated)</label>
                            <input
                                name="tags"
                                defaultValue={initialData?.tags?.join(', ')}
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                                placeholder="React, Three.js, TypeScript"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400">Live URL</label>
                            <input
                                name="live_url"
                                type="url"
                                defaultValue={initialData?.link}
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400">GitHub URL</label>
                            <input
                                name="github_url"
                                type="url"
                                defaultValue={initialData?.github}
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400">Order Index</label>
                            <input
                                name="order_index"
                                type="number"
                                defaultValue={initialData?.order_index || 0}
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4 fixed bottom-0 left-0 right-0 bg-[#050505]/95 border-t border-[#333] p-4 z-40 md:static md:bg-transparent md:border-0 md:p-0 md:pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 text-sm font-mono text-gray-500 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                "px-6 py-2 rounded-lg bg-primary text-black font-bold font-mono text-sm hover:bg-primary/90 transition-all flex items-center gap-2 w-full md:w-auto justify-center",
                                isPending && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {initialData ? 'Update Project' : 'Deploy Project'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
