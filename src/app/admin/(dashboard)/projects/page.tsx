
import Link from 'next/link'
import { Plus, Edit2, ExternalLink, Box } from 'lucide-react'
import { getProjects } from '@/lib/api'
import { deleteProject } from '@/app/admin/projects/actions'
import Image from 'next/image'
import { DeleteConfirmation } from '@/components/admin/delete-confirmation'
import { EmptyState } from '@/components/ui/empty-state'

export default async function AdminProjectsPage() {
    const projects = await getProjects()

    // Defensive check
    if (!projects) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Projects Manager</h1>
                        <p className="text-gray-400 font-mono text-xs mt-1">Manage your portfolio projects</p>
                    </div>
                </div>
                <EmptyState
                    title="Error loading projects"
                    description="Could not load projects. Please try refreshing."
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Projects Manager</h1>
                    <p className="text-gray-400 font-mono text-xs mt-1">Manage your portfolio projects</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-mono text-sm font-bold"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <EmptyState
                    title="No projects deployed yet"
                    description="Create your first project to showcase your work."
                    icon={Box}
                    action={{ label: "Create Project", href: "/admin/projects/new" }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project: any) => (
                        <div key={project.id} className="group relative bg-black/40 border border-[#333] rounded-xl overflow-hidden hover:border-primary/50 transition-all">
                            {/* Image Header */}
                            <div className="relative aspect-video w-full bg-gray-900 border-b border-[#333]">
                                {project.image ? (
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-mono text-xs">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/admin/projects/${project.id}/edit`}
                                        className="p-2 bg-black/80 text-white rounded-lg hover:text-primary transition-colors border border-gray-800"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <div className="flex items-center justify-center bg-black/80 rounded-lg border border-gray-800">
                                        <DeleteConfirmation
                                            itemTitle={project.title}
                                            onDelete={deleteProject.bind(null, project.id)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-white truncate">{project.title}</h3>
                                    <span className="text-[10px] font-mono text-gray-500 border border-gray-800 px-1.5 py-0.5 rounded">
                                        IDX: {project.order_index}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {project.tags?.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="text-[10px] font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags?.length > 3 && (
                                        <span className="text-[10px] font-mono text-gray-500 px-1 py-0.5">
                                            +{project.tags.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-2 border-t border-[#333] text-xs font-mono text-gray-500">
                                    {project.link && (
                                        <a href={project.link} target="_blank" className="hover:text-white flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" /> Live
                                        </a>
                                    )}
                                    {project.github && (
                                        <a href={project.github} target="_blank" className="hover:text-white flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" /> Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
