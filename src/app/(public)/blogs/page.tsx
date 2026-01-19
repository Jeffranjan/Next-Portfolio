import { getPublishedBlogs } from '@/lib/api/blogs'
import BlogsList from '@/components/blogs/BlogsList'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blogs | Ranjan Gupta',
    description: 'Thoughts, tutorials, and insights on software engineering, system design, and product building.',
}

export const revalidate = 3600 // ISR: Revalidate every hour

export default async function BlogsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const sortBy = typeof params.sort === 'string' ? params.sort : 'latest'
    const query = typeof params.q === 'string' ? params.q : ''
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1
    const limit = 9

    const { data: blogs, total } = await getPublishedBlogs({ sortBy, query, page, limit })

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="max-w-4xl mb-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group font-mono"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="flex flex-col gap-2 mb-6">
                        <h2 className="text-primary tracking-widest text-sm font-semibold uppercase">
                            Knowledge Base & Insights
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-bold font-display text-white">
                            Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Blogs</span>
                        </h1>
                    </div>

                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                        Deep dives into system architecture, frontend performance, and the journey of building software products.
                    </p>
                </div>

                {/* Interactivity wrapper */}
                <BlogsList initialBlogs={blogs} total={total} currentPage={page} limit={limit} />
            </div>
        </div>
    )
}
