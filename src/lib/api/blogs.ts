import { createStaticClient } from '@/lib/supabase/server'
import { Blog } from '@/app/admin/(dashboard)/blogs/actions'
import { unstable_cache } from 'next/cache'

export const revalidate = 3600 // Default fallback

export async function getPublishedBlogs(params?: { sortBy?: string, query?: string }) {
    return unstable_cache(
        async () => {
            const supabase = createStaticClient()
            let query = supabase
                .from('blogs')
                .select('*')
                .eq('status', 'published')
                .is('deleted_at', null)

            // Search
            if (params?.query) {
                query = query.ilike('title', `%${params.query}%`)
            }

            // Sort
            // Note: 'latest' is default
            if (params?.sortBy === 'views') {
                query = query.order('views', { ascending: false })
            } else if (params?.sortBy === 'featured') {
                query = query.order('featured', { ascending: false })
                    .order('published_at', { ascending: false })
            } else {
                query = query.order('published_at', { ascending: false })
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching published blogs:', error)
                return []
            }
            return data as Blog[]
        },
        ['blogs', JSON.stringify(params)], // Cache key
        { tags: ['blogs'], revalidate: 3600 }
    )()
}

export async function getFeaturedBlogs() {
    return unstable_cache(
        async () => {
            const supabase = createStaticClient()
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('status', 'published')
                .eq('featured', true)
                .is('deleted_at', null)
                .order('published_at', { ascending: false })
                .limit(3)

            if (error) return []
            return data as Blog[]
        },
        ['featured-blogs'],
        { tags: ['blogs', 'featured'], revalidate: 3600 }
    )()
}

export async function getBlogBySlug(slug: string) {
    return unstable_cache(
        async () => {
            const supabase = createStaticClient()
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'published')
                .is('deleted_at', null)
                .single()

            if (error) return null
            return data as Blog
        },
        [`blog-${slug}`],
        { tags: [`blog:${slug}`, 'blogs'], revalidate: 3600 }
    )()
}
