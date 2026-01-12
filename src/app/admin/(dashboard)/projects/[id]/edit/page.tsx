
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/projects/ProjectForm'
import { updateProject } from '@/app/admin/projects/actions'
import { getProjectById } from '@/lib/api'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = await getProjectById(id)

    if (!project) {
        notFound()
    }

    // Bind ID to the update action
    const updateAction = updateProject.bind(null, id)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Edit Project</h1>
                <p className="text-gray-400 font-mono text-xs mt-1">Update project details</p>
            </div>

            <ProjectForm initialData={project} action={updateAction} />
        </div>
    )
}
