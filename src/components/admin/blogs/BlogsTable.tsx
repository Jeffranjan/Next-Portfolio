'use client'

import { Blog, deleteBlog, toggleFeatured } from '@/app/admin/(dashboard)/blogs/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Edit, Trash2, Star, Eye, Calendar, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BlogsTableProps {
    blogs: Blog[]
}

export default function BlogsTable({ blogs }: BlogsTableProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
        e.preventDefault()
        e.stopPropagation()

        toast("Are you sure?", {
            description: `You are about to delete "${title}"`,
            action: {
                label: "Delete",
                onClick: async () => {
                    setDeletingId(id)
                    try {
                        const res = await deleteBlog(id)

                        if (res.error) {
                            toast.error(res.error)
                        } else {
                            toast.success('Blog deleted')
                            window.location.reload()
                        }
                    } catch (err) {
                        toast.error('Failed to trigger delete action')
                    } finally {
                        setDeletingId(null)
                    }
                }
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        })
    }

    const handleToggleFeatured = async (id: string, current: boolean) => {
        const res = await toggleFeatured(id, !current)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(current ? 'Removed from featured' : 'Added to featured')
            router.refresh()
        }
    }

    return (
        <div className="bg-[#0A0A0A] border border-[#333] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#111] border-b border-[#333] text-gray-400 font-mono uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Title</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-center">Featured</th>
                            <th className="px-6 py-4 font-semibold">Published</th>
                            <th className="px-6 py-4 font-semibold text-right">Views</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {blogs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No blogs found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            blogs.map((blog) => (
                                <tr
                                    key={blog.id}
                                    className="group hover:bg-[#111] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-white flex items-center gap-2">
                                                {blog.title}
                                                {blog.deleted_at && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                                                        DELETED
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">/{blog.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                'px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1.5',
                                                blog.status === 'published'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : blog.status === 'archived'
                                                        ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                            )}
                                        >
                                            <span className={cn("w-1.5 h-1.5 rounded-full",
                                                blog.status === 'published' ? "bg-green-500" :
                                                    blog.status === 'archived' ? "bg-yellow-500" :
                                                        "bg-gray-400"
                                            )} />
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleToggleFeatured(blog.id, blog.featured)}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                blog.featured
                                                    ? "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20"
                                                    : "text-gray-600 hover:text-gray-400 hover:bg-white/5"
                                            )}
                                            title="Toggle Featured"
                                        >
                                            <Star className={cn("w-4 h-4", blog.featured && "fill-current")} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 opacity-50" />
                                            {blog.published_at
                                                ? new Date(blog.published_at).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })
                                                : <span className="text-gray-600 italic">Draft</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-400 font-mono">
                                        <div className="flex items-center justify-end gap-2">
                                            <Eye className="w-3.5 h-3.5 opacity-50" />
                                            {blog.views.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/blogs/${blog.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={(e) => handleDelete(e, blog.id, blog.title)}
                                                disabled={deletingId === blog.id}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
