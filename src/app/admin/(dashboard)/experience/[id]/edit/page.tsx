
import ExperienceForm from '@/components/admin/experience/ExperienceForm'
import { updateExperience } from '@/app/admin/experience/actions'
import { getExperienceById } from '@/lib/api'
import { notFound } from 'next/navigation'

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const experience = await getExperienceById(id)

    if (!experience) {
        notFound()
    }

    // Bind ID to update action
    const updateExperienceWithId = updateExperience.bind(null, id)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Edit Experience</h1>
                <p className="text-gray-400 font-mono text-xs mt-1">Update career details</p>
            </div>

            <ExperienceForm initialData={experience} action={updateExperienceWithId} />
        </div>
    )
}
