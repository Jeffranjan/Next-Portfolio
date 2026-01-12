'use client'

import { TrashItem } from '@/app/admin/trash/actions'
import { permanentDelete } from '@/app/admin/trash/actions'
import { restoreItem } from '@/app/admin/actions'
import { Trash2, RotateCcw, AlertTriangle, Archive } from 'lucide-react'
import { useTransition, useState } from 'react'

function TrashItemRow({ item }: { item: TrashItem }) {
    const [isRestoring, startRestore] = useTransition()
    const [isDeleting, startDelete] = useTransition()

    const handleRestore = () => {
        startRestore(async () => {
            await restoreItem(item.entity, item.id)
        })
    }

    const handleDelete = () => {
        const confirmed = prompt(`⚠ IRREVERSIBLE ACTION ⚠\n\nType DELETE to confirm permanent deletion of "${item.title}"`)
        if (confirmed === 'DELETE') {
            startDelete(async () => {
                await permanentDelete(item.entity, item.id)
            })
        }
    }

    return (
        <div className="flex items-center justify-between p-4 bg-black/40 border border-[#333] rounded-lg group hover:border-red-900/30 transition-colors">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">{item.title}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5">
                        {item.entity}
                    </span>
                </div>
                <span className="text-xs text-gray-500 font-mono">
                    Deleted {new Date(item.deleted_at).toLocaleString()}
                </span>
            </div>

            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleRestore}
                    disabled={isRestoring || isDeleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-yellow-500 bg-yellow-500/10 rounded hover:bg-yellow-500/20 disabled:opacity-50 transition-colors"
                >
                    <RotateCcw className={`w-3 h-3 ${isRestoring ? 'animate-spin' : ''}`} />
                    {isRestoring ? 'Restoring...' : 'Restore'}
                </button>

                <button
                    onClick={handleDelete}
                    disabled={isRestoring || isDeleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-500/10 rounded hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                >
                    <Trash2 className="w-3 h-3" />
                    {isDeleting ? 'Deleting...' : 'Purge'}
                </button>
            </div>
        </div>
    )
}

export default function TrashList({ items }: { items: TrashItem[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-black/20 border border-[#333] rounded-xl border-dashed">
                <Archive className="w-10 h-10 text-gray-600 mb-4" />
                <p className="text-gray-400 font-mono text-sm">$ trash --status</p>
                <p className="text-gray-500 text-xs mt-1">No archived items. System clean.</p>
            </div>
        )
    }

    const grouped = {
        projects: items.filter(i => i.entity === 'projects'),
        skills: items.filter(i => i.entity === 'skills'),
        experience: items.filter(i => i.entity === 'experience'),
    }

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([entity, groupItems]) => {
                if (groupItems.length === 0) return null
                return (
                    <div key={entity} className="space-y-3">
                        <h3 className="text-xs uppercase font-mono text-gray-500 flex items-center gap-2">
                            {entity}
                            <span className="bg-[#222] text-gray-300 px-1.5 rounded-full text-[10px]">{groupItems.length}</span>
                        </h3>
                        <div className="space-y-2">
                            {groupItems.map(item => (
                                <TrashItemRow key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
