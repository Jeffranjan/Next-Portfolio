'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Blog } from '@/app/admin/(dashboard)/blogs/actions'
import BlogCard from '@/components/blogs/BlogCard'
import { Search, Clock, TrendingUp, Star } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

interface BlogsListProps {
    initialBlogs: Blog[]
}

type SortOption = 'latest' | 'views' | 'featured'

export default function BlogsList({ initialBlogs }: BlogsListProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Synce state with URL
    const initialSort = (searchParams.get('sort') as SortOption) || 'latest'
    const initialQuery = searchParams.get('q') || ''

    const [search, setSearch] = useState(initialQuery)
    const [sortBy, setSortBy] = useState<SortOption>(initialSort)
    const [isPending, setIsPending] = useState(false)

    // Debounce search URL updates
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        setIsPending(true)
        router.push(`/blogs?${params.toString()}`)
    }, 500)

    const handleSort = (sort: SortOption) => {
        setSortBy(sort)
        const params = new URLSearchParams(searchParams)
        params.set('sort', sort)
        setIsPending(true)
        router.push(`/blogs?${params.toString()}`)
    }

    // Reset pending state when data changes (handled by parent passing new initialBlogs)
    useEffect(() => {
        setIsPending(false)
    }, [initialBlogs])

    // Local filter update for input
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        handleSearch(e.target.value)
    }

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#050505] border border-[#222] p-4 rounded-xl">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={search}
                        onChange={onSearchChange}
                        className="w-full bg-black/40 border border-[#333] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {/* Sort Buttons */}
                    <SortButton
                        label="Latest" icon={Clock}
                        active={sortBy === 'latest'}
                        onClick={() => handleSort('latest')}
                    />
                    <SortButton
                        label="Popular" icon={TrendingUp}
                        active={sortBy === 'views'}
                        onClick={() => handleSort('views')}
                    />
                    <SortButton
                        label="Featured" icon={Star}
                        active={sortBy === 'featured'}
                        onClick={() => handleSort('featured')}
                    />
                </div>
            </div>

            {/* Load State Overlay */}
            <div className={`transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                {/* Results */}
                {initialBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialBlogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-[#222] rounded-xl bg-[#050505]">
                        <p className="text-gray-500 font-mono">
                            {initialQuery ? `No results for "${initialQuery}"` : "No logs found yet."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

function SortButton({ label, icon: Icon, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all whitespace-nowrap ${active
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-transparent border-[#333] text-gray-500 hover:text-gray-300'
                }`}
        >
            <Icon className="w-3 h-3" />
            {label}
        </button>
    )
}
