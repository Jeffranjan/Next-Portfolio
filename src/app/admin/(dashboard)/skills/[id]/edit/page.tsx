
import SkillForm from '@/components/admin/skills/SkillForm'
import { updateSkill } from '@/app/admin/(dashboard)/skills/actions'
import { getSkillById } from '@/lib/api'
import { notFound } from 'next/navigation'

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const skill = await getSkillById(id)

    if (!skill) {
        notFound()
    }

    const updateSkillWithId = updateSkill.bind(null, id)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Edit Skill</h1>
                <p className="text-gray-400 font-mono text-xs mt-1">Update skill details</p>
            </div>

            <SkillForm initialData={skill} action={updateSkillWithId} />
        </div>
    )
}
