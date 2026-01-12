'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Calendar, GitCommit } from 'lucide-react'
import { cn } from '@/lib/utils'

type ExperienceFormProps = {
    initialData?: any
    action: (prevState: any, formData: FormData) => Promise<any>
}

const initialState = {
    error: '',
}

export default function ExperienceForm({ initialData, action }: ExperienceFormProps) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(action, initialState)

    return (
        <form action={formAction} className="space-y-8 max-w-2xl">
            {state?.error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                    Error: {state.error}
                </div>
            )}

            <div className="space-y-6 bg-black/40 p-6 rounded-xl border border-white/5 relative overflow-hidden">
                {/* Decorative timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-mono text-primary flex items-center gap-2">
                            <GitCommit className="w-4 h-4" />
                            Role (Commit Message Style)
                        </label>
                        <input
                            name="role"
                            defaultValue={initialData?.role}
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                            placeholder="e.g. feat(career): Senior Engineer"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-gray-400">Company</label>
                        <input
                            name="company"
                            defaultValue={initialData?.company}
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                            placeholder="e.g. Tech Corp"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-gray-400">Order Index</label>
                        <input
                            name="order_index"
                            type="number"
                            defaultValue={initialData?.order_index || 0}
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Start Date
                        </label>
                        <input
                            name="start_date"
                            type="date"
                            defaultValue={initialData?.start_date}
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> End Date (Leave empty for Present)
                        </label>
                        <input
                            name="end_date"
                            type="date"
                            defaultValue={initialData?.end_date}
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-mono text-gray-400">Description</label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description}
                            rows={4}
                            className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors font-mono text-sm resize-none"
                            placeholder="Describe your impact..."
                        />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            defaultChecked={initialData?.is_active ?? true}
                            className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary bg-black/50"
                        />
                        <label htmlFor="is_active" className="text-sm font-mono text-gray-300 cursor-pointer select-none">
                            Active (Visible on public site)
                        </label>
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
                    {initialData ? 'Update Experience' : 'Add Experience'}
                </button>
            </div>
        </form>
    )
}
