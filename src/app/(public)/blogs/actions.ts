'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function incrementView(id: string) {
    const supabase = createAdminClient()

    // Simple increment. In production, you might want to debounce this per session/IP
    // or use a separate analytics table to aggregate later.
    const { error } = await supabase.rpc('increment_blog_views', { blog_id: id })

    if (error) {
        // Fallback if RPC doesn't exist
        const { data: blog } = await supabase
            .from('blogs')
            .select('views')
            .eq('id', id)
            .single()

        if (blog) {
            const { error: updateError } = await supabase
                .from('blogs')
                .update({ views: blog.views + 1 })
                .eq('id', id)

            if (updateError) {
                console.error('Error incrementing view:', updateError)
            }
        }
    }
}
