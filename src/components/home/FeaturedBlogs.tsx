import { getFeaturedBlogs } from '@/lib/api/blogs'
import BlogCard from '@/components/blogs/BlogCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function FeaturedBlogs() {
    const blogs = await getFeaturedBlogs()

    if (blogs.length === 0) return null

    return (
        <section id="featured-blogs" className="py-20 border-t border-[#111]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-primary tracking-widest text-sm font-semibold uppercase">
                            Recent thoughts and deep dives
                        </h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-display text-white">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Blogs</span>
                        </h3>
                    </div>
                    <Link
                        href="/blogs"
                        className="group flex items-center gap-2 text-primary hover:text-white transition-colors font-mono text-sm px-4 py-2 border border-primary/20 hover:border-primary/50 rounded-lg hover:bg-primary/10"
                    >
                        View all posts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            </div>
        </section>
    )
}
