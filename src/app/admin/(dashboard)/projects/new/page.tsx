
import ProjectForm from '@/components/admin/projects/ProjectForm'
import { createProject } from '@/app/admin/projects/actions'

export default function NewProjectPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">New Project</h1>
                <p className="text-gray-400 font-mono text-xs mt-1">Deploy a new project to your portfolio</p>
            </div>

            <ProjectForm action={createProject} />
        </div>
    )
}
