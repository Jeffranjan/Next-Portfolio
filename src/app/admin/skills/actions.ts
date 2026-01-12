'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { randomUUID } from 'crypto'

export async function createSkill(prevState: any, formData: FormData) {
    await requireAdmin()
    const supabase = createAdminClient()

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const icon = formData.get('icon') as string
    const order_index = Number(formData.get('order_index')) || 0

    // Generate a simple slug for ID if we wanted, but we let uuid handle it usually.
    // However, for skills sometimes manual ID is useful. Let's stick to gen_random_uuid in DB.
    // We just insert.

    const { data: insertData, error } = await supabase
        .from('skills')
        .insert({
            id: randomUUID(),
            name,
            category,
            icon,
            order_index
        })
        .select()
        .single()

    if (error) {
        return { error: `Failed to create skill: ${error.message}` }
    }

    // Log
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('CREATE', 'skills', insertData.id, { name, category }, 'admin-action')

    revalidateTag('skills', 'default')
    revalidatePath('/admin/skills')

    return { success: true }
}

export async function updateSkill(id: string, prevState: any, formData: FormData) {
    await requireAdmin()
    const supabase = createAdminClient()

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const icon = formData.get('icon') as string
    const order_index = Number(formData.get('order_index')) || 0

    const { error } = await supabase
        .from('skills')
        .update({
            name,
            category,
            icon,
            order_index
        })
        .eq('id', id)

    if (error) {
        return { error: `Failed to update skill: ${error.message}` }
    }

    // Log
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('UPDATE', 'skills', id, { name, category }, 'admin-action')

    revalidateTag('skills', 'default')
    revalidatePath('/admin/skills')

    return { success: true }
}

export async function deleteSkill(id: string) {
    await requireAdmin()
    const supabase = createAdminClient()

    // Soft Delete
    const { error } = await supabase
        .from('skills')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        return { error: `Failed to delete skill: ${error.message}` }
    }

    // Log
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('DELETE', 'skills', id, { soft_delete: true }, 'admin-action')

    revalidateTag('skills', 'default')
    revalidatePath('/admin/skills')
}
