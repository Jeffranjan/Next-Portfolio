'use client'

import { restoreItem } from '@/app/admin/actions'
import { RotateCcw } from 'lucide-react'
import { useTransition } from 'react'

export default function RestoreButton({ entity, id }: { entity: string, id: string }) {
    const [isPending, startTransition] = useTransition()

    const handleRestore = () => {
        if (!confirm('Are you sure you want to restore this item? It will become visible again.')) return

        startTransition(async () => {
            const result = await restoreItem(entity, id)
            if (result?.error) {
                alert(result.error)
            }
        })
    }

    return (
        <button
            onClick={handleRestore}
            disabled={isPending}
            className="flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-400 disabled:opacity-50 transition-colors ml-auto border border-yellow-500/30 px-2 py-1 rounded bg-yellow-500/5 hover:bg-yellow-500/10"
            title="Restore Item"
        >
            <RotateCcw className={`w-3 h-3 ${isPending ? 'animate-spin' : ''}`} />
            {isPending ? 'Restoring...' : 'Undo Delete'}
        </button>
    )
}
