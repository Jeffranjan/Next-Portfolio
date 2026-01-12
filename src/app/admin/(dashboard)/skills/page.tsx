
import Link from 'next/link'
import { Plus, Edit2, Box, Code, Database, Wind, Globe, Terminal } from 'lucide-react'
import { getSkills } from '@/lib/api'
import { deleteSkill } from '@/app/admin/skills/actions'
import { DeleteConfirmation } from '@/components/admin/delete-confirmation'
import { EmptyState } from '@/components/ui/empty-state'

// Helper to render icon dynamically (simple mapping for now)
const IconMap: Record<string, any> = {
    Code: Code,
    Database: Database,
    Wind: Wind,
    Globe: Globe,
    Terminal: Terminal,
    Box: Box,
    // Add more defaults or fallback
}

export default async function AdminSkillsPage() {
    const skills = await getSkills()

    if (!skills) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Skills Manager</h1>
                        <p className="text-gray-400 font-mono text-xs mt-1">Manage technical skills & categories</p>
                    </div>
                </div>
                <EmptyState title="Error" description="Could not load skills." icon={Terminal} />
            </div>
        )
    }

    // Group skills by category
    const groupedSkills = skills.reduce((acc: any, skill: any) => {
        const cat = skill.category || 'Other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(skill)
        return acc
    }, {})

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Skills Manager</h1>
                    <p className="text-gray-400 font-mono text-xs mt-1">Manage technical skills & categories</p>
                </div>
                <Link
                    href="/admin/skills/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-mono text-sm font-bold"
                >
                    <Plus className="w-4 h-4" />
                    New Skill
                </Link>
            </div>

            {skills.length === 0 ? (
                <EmptyState
                    title="No skills found"
                    description="Add your technical skills to populate the portfolio."
                    icon={Terminal}
                    action={{ label: "Add Skill", href: "/admin/skills/new" }}
                />
            ) : (
                Object.entries(groupedSkills).map(([category, categorySkills]: [string, any]) => (
                    <div key={category} className="space-y-4">
                        <h2 className="text-lg font-bold text-primary border-b border-primary/20 pb-2 flex items-center gap-2">
                            {category}
                            <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded-full">
                                {categorySkills.length}
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {categorySkills.map((skill: any) => {
                                const IconComponent = IconMap[skill.icon] || Box

                                return (
                                    <div key={skill.id} className="group relative bg-black/40 border border-[#333] rounded-xl p-4 hover:border-primary/50 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm">{skill.name}</h3>
                                                <p className="text-[10px] text-gray-500 font-mono">IDX: {skill.order_index}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/skills/${skill.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <div className="p-1.5">
                                                <DeleteConfirmation
                                                    itemTitle={skill.name}
                                                    onDelete={deleteSkill.bind(null, skill.id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
