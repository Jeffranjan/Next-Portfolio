import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getProjects = cache(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data
})

export const getProjectById = cache(async (id: string) => {
    const supabase = await createClient()
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
})

export const getSkills = cache(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order', { ascending: true })

    if (error) {
        console.error('Error fetching skills:', error)
        return []
    }

    return data
})

export const getExperience = cache(async () => {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching experience:', error)
        return []
    }

    return data
})
