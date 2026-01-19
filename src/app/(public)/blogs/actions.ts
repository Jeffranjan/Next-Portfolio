'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function incrementView(id: string) {
    const supabase = createAdminClient()

    // Simple increment. In production, you might want to debounce this per session/IP
    // or use a separate analytics table to aggregate later.
    const { error } = await supabase.rpc('increment_blog_views', { blog_id: id })

    if (error) {
        // Fallback if RPC doesn't exist (though we should ideally create it)
        // Or just using simple update (racey but acceptable for simple counter)
        const { error: updateError } = await supabase.from('blogs').select('views').eq('id', id).single().then(async ({ data }) => {
            if (!data) return { error: 'Blog not found' }
            return await supabase
                .from('blogs')
                .update({ views: data.views + 1 })
                .eq('id', id)
        })

        if (updateError) {
            console.error('Error incrementing view:', updateError)
        }
    }

    // We typically DO NOT revalidatePath here because we don't want to rebuild static pages 
    // just for a view count update. We rely on client-side fetching or occasional ISR for that,
    // or just let it be stale until next content update.
}
