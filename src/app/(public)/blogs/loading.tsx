import BlogCardSkeleton from '@/components/blogs/BlogCardSkeleton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Loading() {
    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Skeleton */}
                <div className="max-w-4xl mb-16 animate-pulse">
                    <div className="w-32 h-6 bg-[#111] rounded mb-8" />
                    <div className="w-48 h-4 bg-[#111] rounded mb-6" />
                    <div className="w-96 h-12 bg-[#111] rounded mb-6" />
                    <div className="w-full max-w-2xl h-6 bg-[#111] rounded" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-full">
                            <BlogCardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
