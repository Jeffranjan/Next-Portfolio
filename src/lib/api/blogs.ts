import { createStaticClient } from '@/lib/supabase/server'
import { Blog } from '@/app/admin/(dashboard)/blogs/actions'
import { unstable_cache } from 'next/cache'

export const revalidate = 3600 // Default fallback

export async function getPublishedBlogs(params?: { sortBy?: string, query?: string, page?: number, limit?: number }) {
    return unstable_cache(
        async () => {
            const supabase = createStaticClient()
            let query = supabase
                .from('blogs')
                .select('id, title, slug, excerpt, cover_image, published_at, views, reading_time, featured, updated_at', { count: 'exact' })
                .eq('status', 'published')
                .is('deleted_at', null)

            // Search
            if (params?.query) {
                query = query.ilike('title', `%${params.query}%`)
            }

            // Sort
            if (params?.sortBy === 'views') {
                query = query.order('views', { ascending: false })
            } else if (params?.sortBy === 'featured') {
                query = query.order('featured', { ascending: false })
                    .order('published_at', { ascending: false })
            } else {
                query = query.order('published_at', { ascending: false })
            }

            // Pagination
            const page = params?.page || 1
            const limit = params?.limit || 9
            const from = (page - 1) * limit
            const to = from + limit - 1

            query = query.range(from, to)

            const { data, error, count } = await query

            if (error) {
                console.error('Error fetching published blogs:', error)
                return { data: [], total: 0 }
            }
            return { data: data as Blog[], total: count || 0 }
        },
        ['blogs-paginated', JSON.stringify(params)],
        { tags: ['blogs'], revalidate: 3600 }
    )()
}

export async function getAllPublishedBlogs() {
    return unstable_cache(
        async () => {
            const supabase = createStaticClient()
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('status', 'published')
                .is('deleted_at', null)
                .order('published_at', { ascending: false })

            if (error) return []
            return data as Blog[]
        },
        ['all-published-blogs'],
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
