'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

type SkillFormProps = {
    initialData?: any
    action: (prevState: any, formData: FormData) => Promise<any>
}

const initialState = {
    error: '',
}

const CATEGORIES = ["Frontend", "Backend", "Tools", "Other"]

export default function SkillForm({ initialData, action }: SkillFormProps) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(action, initialState)

    return (
        <form action={formAction} className="space-y-8 max-w-2xl">
            {state?.error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                    Error: {state.error}
                </div>
            )}

            <div className="space-y-6 bg-black/40 p-6 rounded-xl border border-white/5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-mono text-primary">Skill Name</label>
                        <input
                            name="name"
                            defaultValue={initialData?.name}
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                            placeholder="e.g. React.js"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-gray-400">Category</label>
                        <select
                            name="category"
                            defaultValue={initialData?.category || "Frontend"}
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm appearance-none"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-gray-400">Icon (Lucide Name)</label>
                        <input
                            name="icon"
                            defaultValue={initialData?.icon}
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                            placeholder="e.g. Code, Database, Wind"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-gray-400">Order Index</label>
                        <input
                            name="order_index"
                            type="number"
                            defaultValue={initialData?.order_index || 0}
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 text-sm font-mono text-gray-500 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className={cn(
                        "px-6 py-2 rounded-lg bg-primary text-black font-bold font-mono text-sm hover:bg-primary/90 transition-all flex items-center gap-2",
                        isPending && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {initialData ? 'Update Skill' : 'Add Skill'}
                </button>
            </div>
        </form>
    )
}
