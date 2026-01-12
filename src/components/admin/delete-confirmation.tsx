'use client'

import { useState } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteConfirmationProps {
    itemTitle: string
    onDelete: () => Promise<{ error?: string } | void>
    description?: string
}

export function DeleteConfirmation({ itemTitle, onDelete, description }: DeleteConfirmationProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await onDelete()
            if (result && typeof result === 'object' && 'error' in result && result.error) {
                toast.error(result.error)
            } else {
                toast.success(`${itemTitle} deleted successfully`)
                setIsOpen(false)
                router.refresh()
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsDeleting(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                type="button"
                title="Delete"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-red-500/10 rounded-full text-red-500 mb-2">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Delete {itemTitle}?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {description || "This item will be moved to trash and can be restored later."}
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-mono text-sm transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-mono text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Confirm Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
