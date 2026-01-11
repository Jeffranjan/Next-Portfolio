import { createAdminClient } from '../src/lib/supabase/admin'
import { projects } from '../src/data/projects'
import { skills } from '../src/data/skills'

async function seed() {
    const supabase = createAdminClient()
    console.log('Seeding data...')

    // Seed Projects
    console.log(`Migrating ${projects.length} projects...`)
    for (const p of projects) {
        const { data: existing } = await supabase.from('projects').select('id').eq('title', p.title).maybeSingle()

        if (!existing) {
            const { error } = await supabase.from('projects').insert({
                title: p.title,
                description: p.description,
                tags: p.tags,
                image: p.image,
                link: p.link || null,
                github: p.github || null,
            })
            if (error) console.error(`Error inserting project ${p.title}:`, error)
            else console.log(`Project ${p.title} inserted.`)
        } else {
            console.log(`Project ${p.title} already exists.`)
        }
    }

    // Seed Skills
    console.log(`Migrating ${skills.length} skills...`)
    for (const s of skills) {
        const { error } = await supabase.from('skills').upsert({
            id: s.id,
            name: s.name,
            category: s.category,
            icon: s.icon,
        })
        if (error) console.error(`Error inserting skill ${s.name}:`, error)
        else console.log(`Skill ${s.name} processed.`)
    }

    console.log('Migration complete.')
}

seed()
