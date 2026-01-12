'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'
import { logAdminAction } from '@/lib/admin/logger'
import { revalidatePath, revalidateTag } from 'next/cache'

export type TrashItem = {
    id: string
    title: string // mapped from title, name, or role+company
    deleted_at: string
    entity: 'projects' | 'skills' | 'experience'
    details?: any
}

export async function getTrashItems() {
    await requireAdmin()
    const supabase = createAdminClient()

    const [projects, skills, experience] = await Promise.all([
        supabase.from('projects').select('*').not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
        supabase.from('skills').select('*').not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
        supabase.from('experience').select('*').not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
    ])

    const trashItems: TrashItem[] = []

    if (projects.data) {
        trashItems.push(...projects.data.map(p => ({
            id: p.id,
            title: p.title,
            deleted_at: p.deleted_at,
            entity: 'projects' as const,
            details: p
        })))
    }

    if (skills.data) {
        trashItems.push(...skills.data.map(s => ({
            id: s.id,
            title: s.name,
            deleted_at: s.deleted_at,
            entity: 'skills' as const,
            details: s
        })))
    }

    if (experience.data) {
        trashItems.push(...experience.data.map(e => ({
            id: e.id,
            title: `${e.role} at ${e.company}`,
            deleted_at: e.deleted_at,
            entity: 'experience' as const,
            details: e
        })))
    }

    // Sort combined list by most recently deleted
    return trashItems.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime())
}

export async function permanentDelete(entity: string, id: string) {
    await requireAdmin()
    const supabase = createAdminClient()

    const { error } = await supabase
        .from(entity)
        .delete()
        .eq('id', id)

    if (error) {
        return { error: `Failed to permanently delete from ${entity}: ${error.message}` }
    }

    await logAdminAction('HARD_DELETE', entity as any, id, { reason: 'manual permanent deletion' }, 'admin-action')

    revalidateTag(entity, 'default')
    revalidatePath('/admin/activity')
}
