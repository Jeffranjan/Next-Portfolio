'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'

export async function createExperience(prevState: any, formData: FormData) {
    await requireAdmin()
    const supabase = createAdminClient()

    const role = formData.get('role') as string
    const company = formData.get('company') as string
    const description = formData.get('description') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') ? formData.get('end_date') as string : null
    const order_index = Number(formData.get('order_index')) || 0
    const is_active = formData.get('is_active') === 'on'

    // Generate year_range (keep existing logic)
    const getYear = (dateStr: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).getFullYear().toString()
    }
    const year_range = `${getYear(start_date)} - ${end_date ? getYear(end_date) : 'Present'}`

    const { data: insertData, error } = await supabase
        .from('experience')
        .insert({
            role,
            company,
            description,
            start_date,
            end_date,
            order_index,
            is_active,
            year_range
        })
        .select()
        .single()

    if (error) {
        return { error: `Failed to create experience: ${error.message}` }
    }

    // Log
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('CREATE', 'experience', insertData.id, { role, company }, 'admin-action')

    revalidateTag('experience', 'default')
    revalidatePath('/admin/experience')
    redirect('/admin/experience')
}

export async function updateExperience(id: string, prevState: any, formData: FormData) {
    await requireAdmin()
    const supabase = createAdminClient()

    const role = formData.get('role') as string
    const company = formData.get('company') as string
    const description = formData.get('description') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') ? formData.get('end_date') as string : null
    const order_index = Number(formData.get('order_index')) || 0
    const is_active = formData.get('is_active') === 'on'

    const getYear = (dateStr: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).getFullYear().toString()
    }
    const year_range = `${getYear(start_date)} - ${end_date ? getYear(end_date) : 'Present'}`

    const { error } = await supabase
        .from('experience')
        .update({
            role,
            company,
            description,
            start_date,
            end_date,
            order_index,
            is_active,
            year_range
        })
        .eq('id', id)

    if (error) {
        return { error: `Failed to update experience: ${error.message}` }
    }

    // Log
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('UPDATE', 'experience', id, { role, company }, 'admin-action')

    revalidateTag('experience', 'default')
    revalidatePath('/admin/experience')
    redirect('/admin/experience')
}

export async function deleteExperience(id: string) {
    await requireAdmin()
    const supabase = createAdminClient()

    // Soft Delete
    const { error } = await supabase
        .from('experience')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        return { error: `Failed to delete experience: ${error.message}` }
    }

    // Log
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('DELETE', 'experience', id, { soft_delete: true }, 'admin-action')

    revalidateTag('experience', 'default')
    revalidatePath('/admin/experience')
}
