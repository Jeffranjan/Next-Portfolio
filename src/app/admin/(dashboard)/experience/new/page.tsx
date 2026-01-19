
import ExperienceForm from '@/components/admin/experience/ExperienceForm'
import { createExperience } from '@/app/admin/(dashboard)/experience/actions'

export default function NewExperiencePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Add Experience</h1>
                <p className="text-gray-400 font-mono text-xs mt-1">Add a new career milestone</p>
            </div>

            <ExperienceForm action={createExperience} />
        </div>
    )
}
