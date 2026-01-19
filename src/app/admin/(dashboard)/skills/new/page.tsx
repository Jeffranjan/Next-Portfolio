
import SkillForm from '@/components/admin/skills/SkillForm'
import { createSkill } from '@/app/admin/(dashboard)/skills/actions'

export default function NewSkillPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Add New Skill</h1>
                <p className="text-gray-400 font-mono text-xs mt-1">Create a new technical skill entry</p>
            </div>

            <SkillForm action={createSkill} />
        </div>
    )
}
