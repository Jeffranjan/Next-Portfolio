'use client'

import { useState } from 'react'
import { Shield, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import AuditLogList from './AuditLogList'
import TrashList from './TrashList'
import { TrashItem } from '@/app/admin/trash/actions'

export default function ActivityTabs({ logs, trashItems }: { logs: any[], trashItems: TrashItem[] }) {
    const [activeTab, setActiveTab] = useState<'audits' | 'trash'>('audits')

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-1 p-1 bg-black/40 border border-[#333] rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('audits')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                        activeTab === 'audits'
                            ? "bg-[#222] text-white shadow-sm"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    <Shield className="w-4 h-4" />
                    Audit Log
                </button>
                <button
                    onClick={() => setActiveTab('trash')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                        activeTab === 'trash'
                            ? "bg-[#222] text-white shadow-sm"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    <Trash2 className="w-4 h-4" />
                    Trash
                    {trashItems.length > 0 && (
                        <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full">
                            {trashItems.length}
                        </span>
                    )}
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'audits' ? (
                    <AuditLogList logs={logs} />
                ) : (
                    <TrashList items={trashItems} />
                )}
            </div>
        </div>
    )
}
