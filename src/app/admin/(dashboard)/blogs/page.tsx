import Link from 'next/link'
import BlogsTable from '@/components/admin/blogs/BlogsTable'
import { getBlogs } from './actions'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogsPage() {
    const blogs = await getBlogs()

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Blog Manager</h1>
                    <p className="text-gray-400">Manage your articles, drafts, and publications.</p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    New Blog
                </Link>
            </div>

            <BlogsTable blogs={blogs} />
        </div>
    )
}
