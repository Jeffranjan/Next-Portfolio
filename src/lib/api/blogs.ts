import { createClient } from '@/lib/supabase/server'
import { Blog } from '@/app/admin/(dashboard)/blogs/actions'
import { cache } from 'react'

export const revalidate = 3600 // Revalidate every hour by default

export const getPublishedBlogs = cache(async () => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('published_at', { ascending: false })

    if (error) {
        console.error('Error fetching published blogs:', error)
        return []
    }

    return data as Blog[]
})

export const getFeaturedBlogs = cache(async () => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .is('deleted_at', null)
        .order('published_at', { ascending: false })
        .limit(3)

    if (error) {
        console.error('Error fetching featured blogs:', error)
        return []
    }

    return data as Blog[]
})

export const getBlogBySlug = cache(async (slug: string) => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .is('deleted_at', null)
        .single()

    if (error) {
        return null
    }

    return data as Blog
})
