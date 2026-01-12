
import { createAdminClient } from '@/lib/supabase/admin'

export type AdminAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'REORDER' | 'HARD_DELETE'
export type EntityType = 'projects' | 'skills' | 'experience'

export async function logAdminAction(
    action: AdminAction,
    entity: EntityType,
    entityId: string,
    details: any,
    adminEmail: string = 'system' // Fallback if not provided, though it should be
) {
    const supabase = createAdminClient()

    try {
        const { error } = await supabase.from('audit_logs').insert({
            action,
            entity,
            entity_id: entityId,
            details,
            admin_email: adminEmail
        })

        if (error) {
            console.error('Failed to log admin action:', error)
        }
    } catch (e) {
        console.error('Exception logging admin action:', e)
    }
}
