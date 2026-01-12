
import { createAdminClient } from '@/lib/supabase/admin'
import { getTrashItems } from '@/app/admin/trash/actions'
import ActivityTabs from '@/components/admin/activity/ActivityTabs'
import { Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
    const supabase = createAdminClient()

    // Fetch Logs
    const { data: logs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

    // Fetch Trash
    const trashItems = await getTrashItems()

    if (error) {
        return <div className="text-red-500 font-mono">Failed to load logs.</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                    <Shield className="text-primary w-6 h-6" />
                    System Activity
                </h1>
                <p className="text-gray-400 font-mono text-xs mt-1">$ tail -f /var/log/syslog</p>
            </div>

            <ActivityTabs logs={logs || []} trashItems={trashItems} />
        </div>
    )
}
