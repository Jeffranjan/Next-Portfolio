'use client'

import { Activity, Edit, Plus, RotateCcw, Trash2 } from 'lucide-react'
import RestoreButton from '@/components/admin/RestoreButton'

// Helper to format date relative ("2 mins ago") or absolute if old
function timeAgo(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

function getIcon(action: string) {
    switch (action) {
        case 'CREATE': return <Plus className="w-4 h-4 text-green-500" />
        case 'UPDATE': return <Edit className="w-4 h-4 text-blue-500" />
        case 'DELETE': return <Trash2 className="w-4 h-4 text-red-500" />
        case 'RESTORE': return <RotateCcw className="w-4 h-4 text-yellow-500" />
        case 'HARD_DELETE': return <Trash2 className="w-4 h-4 text-red-700" />
        default: return <Activity className="w-4 h-4 text-gray-500" />
    }
}

export default function AuditLogList({ logs }: { logs: any[] }) {
    return (
        <div className="bg-black/40 border border-[#333] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse block md:table">
                    <thead className="hidden md:table-header-group">
                        <tr className="border-b border-[#333] bg-black/60">
                            <th className="p-4 font-mono text-xs text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="p-4 font-mono text-xs text-gray-500 uppercase tracking-wider">Admin</th>
                            <th className="p-4 font-mono text-xs text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="p-4 font-mono text-xs text-gray-500 uppercase tracking-wider">Entity</th>
                            <th className="p-4 font-mono text-xs text-gray-500 uppercase tracking-wider w-full">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222] block md:table-row-group space-y-4 md:space-y-0 p-4 md:p-0">
                        {logs?.map((log) => (
                            <tr key={log.id} className="hover:bg-[#111] transition-colors group block md:table-row bg-black/40 md:bg-transparent border md:border-0 border-[#333] rounded-xl overflow-hidden mb-4 md:mb-0">
                                <td className="p-4 font-mono text-xs text-gray-500 whitespace-nowrap block md:table-cell border-b md:border-b-0 border-[#333/50]">
                                    <span title={new Date(log.created_at).toLocaleString()}>
                                        {timeAgo(log.created_at)}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-xs text-white block md:table-cell border-b md:border-b-0 border-[#333/50]">
                                    <span className="md:hidden text-gray-500 mr-2">User:</span>
                                    {log.admin_email.split('@')[0]}
                                </td>
                                <td className="p-4 block md:table-cell border-b md:border-b-0 border-[#333/50]">
                                    <div className="flex items-center gap-2 font-mono text-xs font-bold">
                                        {getIcon(log.action)}
                                        <span className={
                                            log.action === 'CREATE' ? 'text-green-500' :
                                                log.action === 'UPDATE' ? 'text-blue-500' :
                                                    log.action === 'DELETE' ? 'text-red-500' :
                                                        log.action === 'HARD_DELETE' ? 'text-red-700' :
                                                            log.action === 'RESTORE' ? 'text-yellow-500' :
                                                                'text-gray-400'
                                        }>
                                            {log.action}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-xs text-gray-300 uppercase block md:table-cell border-b md:border-b-0 border-[#333/50]">
                                    <span className="md:hidden text-gray-500 mr-2">Entity:</span>
                                    {log.entity}
                                </td>
                                <td className="p-4 font-mono text-xs text-gray-400 break-all block md:table-cell">
                                    {Object.entries(log.details || {}).map(([key, value]) => {
                                        if (key === 'soft_delete') return null
                                        if (typeof value === 'object') return null
                                        return (
                                            <span key={key} className="mr-3 block md:inline">
                                                <span className="text-gray-600">{key}:</span> <span className="text-gray-300">{String(value).substring(0, 30)}</span>
                                            </span>
                                        )
                                    })}
                                    {log.action === 'DELETE' && <span className="text-gray-600 italic">Item archived</span>}

                                    {log.action === 'DELETE' && log.entity_id && (
                                        <div className="mt-2">
                                            <RestoreButton entity={log.entity} id={log.entity_id} />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {(!logs || logs.length === 0) && (
                            <tr className="block md:table-row">
                                <td colSpan={5} className="p-8 text-center text-gray-500 font-mono text-sm block md:table-cell">
                                    No activity recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
