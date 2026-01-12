
import Link from 'next/link'
import { Plus, Edit2, GitCommit, Calendar } from 'lucide-react'
import { getAdminExperience } from '@/lib/api'
import { deleteExperience } from '@/app/admin/experience/actions'
import { DeleteConfirmation } from '@/components/admin/delete-confirmation'
import { EmptyState } from '@/components/ui/empty-state'

export default async function AdminExperiencePage() {
    const experience = await getAdminExperience()

    if (!experience) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Experience Manager</h1>
                        <p className="text-gray-400 font-mono text-xs mt-1">Manage career timeline & commit history</p>
                    </div>
                </div>
                <EmptyState title="Error" description="Could not load experience data." icon={GitCommit} />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Experience Manager</h1>
                    <p className="text-gray-400 font-mono text-xs mt-1">Manage career timeline & commit history</p>
                </div>
                <Link
                    href="/admin/experience/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-mono text-sm font-bold"
                >
                    <Plus className="w-4 h-4" />
                    New Entry
                </Link>
            </div>

            {experience.length === 0 ? (
                <EmptyState
                    title="No experience listed"
                    description="Add your career history to populate the timeline."
                    icon={GitCommit}
                    action={{ label: "Add Experience", href: "/admin/experience/new" }}
                />
            ) : (
                <div className="relative pl-8 border-l-2 border-[#333] space-y-12">
                    {experience.map((exp: any) => (
                        <div key={exp.id} className="relative group">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-black ${exp.is_active ? 'bg-primary' : 'bg-gray-600'} transition-colors`} />

                            <div className="bg-black/40 border border-[#333] rounded-xl p-6 hover:border-primary/50 transition-all group-hover:bg-white/5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-white text-lg font-mono">{exp.role}</h3>
                                            {!exp.is_active && (
                                                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-mono border border-red-500/20">
                                                    INACTIVE
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-500 font-mono border border-gray-800 px-1.5 py-0.5 rounded">
                                                IDX: {exp.order_index}
                                            </span>
                                        </div>
                                        <p className="text-primary font-mono text-sm mb-4">{exp.company}</p>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                                            <Calendar className="w-3 h-3" />
                                            <span>{exp.start_date}</span>
                                            <span>—</span>
                                            <span>{exp.end_date || 'Present'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/admin/experience/${exp.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <div className="p-2">
                                            <DeleteConfirmation
                                                itemTitle={`${exp.role} at ${exp.company}`}
                                                onDelete={deleteExperience.bind(null, exp.id)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {exp.description && (
                                    <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-3xl">
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
