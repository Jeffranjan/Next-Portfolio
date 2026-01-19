import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Eye, ArrowUpRight } from 'lucide-react'
import { Blog } from '@/app/admin/(dashboard)/blogs/actions'
import { cn } from '@/lib/utils'

interface BlogCardProps {
    blog: Blog
    className?: string
}

export default function BlogCard({ blog, className }: BlogCardProps) {
    return (
        <Link
            href={`/blogs/${blog.slug}`}
            className={cn(
                "group flex flex-col bg-[#050505] border border-[#222] rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] hover:-translate-y-1 transition-all duration-300 h-full relative",
                className
            )}
        >
            {/* Image */}
            <div className="aspect-[16/9] w-full bg-[#111] overflow-hidden relative border-b border-[#222]">
                <div className="absolute top-2 right-2 z-10 bg-black/50 backdrop-blur-md border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-primary/80 uppercase tracking-wider">
                    Blog
                </div>
                {blog.cover_image && (
                    <Image
                        src={blog.cover_image}
                        alt={blog.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col gap-4 relative">
                {/* Decorative code line */}
                <div className="text-[10px] font-mono text-gray-700 mb-[-10px]">
                    {'// ' + new Date(blog.published_at || Date.now()).toISOString().split('T')[0]}
                </div>

                <div className="space-y-2 mt-2">
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {blog.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3">
                        {blog.excerpt || 'No excerpt available.'}
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-[#222] flex items-center justify-between text-xs text-gray-500 font-mono">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 align-middle">
                            <Clock className="w-3.5 h-3.5" />
                            {blog.reading_time || 5}min
                        </span>
                    </div>
                    {blog.views > 0 && (
                        <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            {blog.views}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
