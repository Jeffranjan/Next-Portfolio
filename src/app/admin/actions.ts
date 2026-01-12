'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath, revalidateTag } from 'next/cache'
import { logAdminAction } from '@/lib/admin/logger'

export async function restoreItem(entity: string, id: string) {
    await requireAdmin()
    const supabase = createAdminClient()

    // Map entity name to table name if different (currently they match: projects, skills, experience)
    const table = entity

    const { error } = await supabase
        .from(table)
        .update({ deleted_at: null })
        .eq('id', id)

    if (error) {
        return { error: `Failed to restore ${entity}: ${error.message}` }
    }

    await logAdminAction('RESTORE', entity as any, id, { restored_from_log: true }, 'admin-action')

    revalidateTag(entity, 'default')
    revalidatePath('/admin/activity')
    revalidatePath(`/admin/${entity}`)
}
