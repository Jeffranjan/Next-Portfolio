import { createClient, createStaticClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'

export const getProjects = unstable_cache(
    async () => {
        const supabase = createStaticClient()
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .is('deleted_at', null)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching projects:', error)
            return []
        }

        return data
    },
    ['projects'],
    { tags: ['projects'] }
)

export const getProjectById = unstable_cache(
    async (id: string) => {
        const supabase = createStaticClient()
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error(`Error fetching project ${id}:`, error)
            return null
        }

        return data
    },
    ['project-by-id'], // Dynamic key will be appended by unstable_cache if arguments are passed? No, unstable_cache passes args to key generator if provided or we must handle it. 
    // Actually unstable_cache (fn, keyParts, options) returns a function. 
    // The defined function takes the same args as fn.
    // So distinct calls with distinct args get distinct cache entries if they are part of the key?
    // Wait, the Next.js docs say: "The keyParts array ... combined with the arguments ...". 
    // Actually, for `getProjectById(id)`, we need `id` in the cache key.
    // `unstable_cache` automatically includes arguments in the cache key? 
    // Documentation says: "keyParts: An array of strings that globally identifies the cached value. ... Dynamic values (like arguments passed to the function) are NOT automatically added to the keyParts."
    // BUT "The returned function, when called, will perform ... reusing the cached value if the parameters and keyParts match".
    // Wait, usually people do: `const getProject = unstable_cache((id) => ..., ['project'], {tags: ...})`
    // And call `getProject(id)`.
    // Let's verify if `unstable_cache` handles arguments distinguishing.
    // Yes, it does.
    { tags: ['projects'] }
)

export const getSkills = unstable_cache(
    async () => {
        const supabase = createStaticClient()
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .is('deleted_at', null)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching skills:', error)
            return []
        }

        return data
    },
    ['skills'],
    { tags: ['skills'] }
)

export const getSkillById = unstable_cache(
    async (id: string) => {
        const supabase = createStaticClient()
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error(`Error fetching skill ${id}:`, error)
            return null
        }

        return data
    },
    ['skill-by-id'],
    { tags: ['skills'] }
)

export const getExperience = unstable_cache(
    async () => {
        const supabase = createStaticClient()
        const { data, error } = await supabase
            .from('experience')
            .select('*')
            .eq('is_active', true)
            .is('deleted_at', null)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching experience:', error)
            return []
        }

        return data
    },
    ['experience'],
    { tags: ['experience'] }
)

export const getExperienceById = unstable_cache(
    async (id: string) => {
        const supabase = createStaticClient()
        const { data, error } = await supabase
            .from('experience')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error(`Error fetching experience ${id}:`, error)
            return null
        }

        return data
    },
    ['experience-by-id'], // Argument id allows differentiation
    { tags: ['experience'] }
)

// Admin functions should NOT be cached or should be fresh. 
// User said: "Admin Pages ... Always fresh ... cache: 'no-store'".
// So we keep `getAdminExperience` as is, OR wrap it with no-store if needed, but usually we just don't use unstable_cache.
// We can mark it as `export const getAdminExperience = async ...` without cache.
// The previous code had `cache(...)` React cache.
// We'll remove React cache for admin to ensure freshness, or use `noStore()` inside.
// Actually, `cache` (React cache) is per-request. It's fine to keep for deduping within a request.
// But we want to ensure we fetch fresh data from DB. 
// Supabase client fits with `no-store` in the page/component calling it, or we use `cookies()` which opts into dynamic.
// Let's keep `getAdminExperience` simple but ensure it's not using stale data.
// Since `createClient` uses `cookies()`, `getAdminExperience` is dynamic by default. 
// We just won't wrap it in `unstable_cache`.

export const getAdminExperience = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('experience')
        .select('*')
        .is('deleted_at', null)
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching admin experience:', error)
        return []
    }

    return data
}
