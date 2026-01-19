'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBlog, updateBlog, Blog } from '@/app/admin/(dashboard)/blogs/actions'
import { Loader2, ArrowLeft, Save, Globe, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useDebouncedCallback } from 'use-debounce'
import Editor from './editor/Editor'

interface BlogFormProps {
    initialData?: Blog
    isEditing?: boolean
}

export default function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        status: initialData?.status || 'draft',
        featured: initialData?.featured || false,
        cover_image: initialData?.cover_image || '',
        seo_title: initialData?.seo_title || '',
        seo_description: initialData?.seo_description || '',
        content: initialData?.content || undefined,
    })

    // Auto-generate slug from title if creating new
    useEffect(() => {
        if (!isEditing && formData.title && !initialData) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            setFormData(prev => ({ ...prev, slug }))
        }
    }, [formData.title, isEditing, initialData])

    // Autosave Logic
    const autosave = useDebouncedCallback(async (currentData) => {
        if (!isEditing || !initialData) return // Only autosave existing blogs

        setSaving(true)
        const res = await updateBlog(initialData.id, currentData)
        setSaving(false)

        if (res?.error) {
            console.error('Autosave failed:', res.error)
        } else {
            setLastSaved(new Date())
        }
    }, 3000)

    // Handle Form Change
    const handleChange = (field: string, value: any) => {
        const newData = { ...formData, [field]: value }
        setFormData(newData)

        // Trigger autosave if editing
        if (isEditing) {
            autosave(newData)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isEditing && initialData) {
                // Hack: Send content as string to avoid serialization data loss
                const payload = {
                    ...formData,
                    content_json: JSON.stringify(formData.content)
                }

                const res = await updateBlog(initialData.id, payload)
                if (res?.error) {
                    toast.error(res.error)
                } else {
                    toast.success('Blog updated successfully')
                    router.push('/admin/blogs')
                    router.refresh()
                }
            } else {
                const res = await createBlog({
                    ...formData,
                    status: formData.status as 'draft' | 'published'
                })
                if (res?.error) {
                    toast.error(res.error)
                } else {
                    toast.success('Blog created successfully')
                    router.push('/admin/blogs')
                    router.refresh()
                }
            }
        } catch (error: any) {
            console.error('Submit Error:', error)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-20">

            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md py-4 z-20 border-b border-[#333] mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blogs"
                        className="p-2 rounded-lg bg-white/5 border border-[#333] hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                            {isEditing ? 'Edit Blog' : 'New Blog'}
                            {isEditing && (
                                <span className="text-xs font-mono font-normal text-gray-500 flex items-center gap-1.5 bg-[#111] px-2 py-1 rounded-full border border-[#333]">
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                                        </>
                                    ) : lastSaved ? (
                                        <>
                                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </>
                                    ) : (
                                        <span className="opacity-50">Autosave ready</span>
                                    )}
                                </span>
                            )}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/blogs"
                        className="hidden sm:inline-block px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEditing ? 'Save Changes' : 'Create Blog'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Blog Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="e.g. The Future of Web Development"
                                    className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-700 font-display font-medium text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Slug URL</label>
                                <div className="flex items-center">
                                    <span className="bg-[#111] border border-r-0 border-[#333] text-gray-500 px-3 py-2.5 rounded-l-lg text-sm font-mono">
                                        /blogs/
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => handleChange('slug', e.target.value)}
                                        className="flex-1 bg-[#111] border border-[#333] text-white rounded-r-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Excerpt</label>
                                <textarea
                                    rows={2}
                                    value={formData.excerpt}
                                    onChange={(e) => handleChange('excerpt', e.target.value)}
                                    placeholder="Short summary for SEO and cards..."
                                    className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-700 resize-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rich Text Editor */}
                    <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-1 overflow-hidden min-h-[500px] flex flex-col">
                        <Editor
                            initialContent={formData.content}
                            onChange={(content) => handleChange('content', content)}
                        />
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status & Featured */}
                    <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Publishing</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg border border-[#333]">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">Featured Blog</span>
                                    <span className="text-xs text-gray-500">Pin to home page</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleChange('featured', !formData.featured)}
                                    className={cn(
                                        "w-11 h-6 rounded-full transition-colors relative",
                                        formData.featured ? "bg-primary" : "bg-gray-700"
                                    )}
                                >
                                    <span className={cn(
                                        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                                        formData.featured ? "translate-x-5" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Media
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Cover Image URL</label>
                            <input
                                type="text"
                                value={formData.cover_image}
                                onChange={(e) => handleChange('cover_image', e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 transition-all text-sm"
                            />
                        </div>
                        {formData.cover_image && (
                            <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#333] relative bg-[#111]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={formData.cover_image} alt="Cover preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* SEO */}
                    <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-6 space-y-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Globe className="w-4 h-4" /> SEO
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.seo_title}
                                    onChange={(e) => handleChange('seo_title', e.target.value)}
                                    placeholder="Same as title if empty"
                                    className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.seo_description}
                                    onChange={(e) => handleChange('seo_description', e.target.value)}
                                    placeholder="Brief description for search results"
                                    className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 transition-all text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
