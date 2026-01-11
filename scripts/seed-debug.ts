import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { projects } from '../src/data/projects'
import { skills } from '../src/data/skills'

// Manually load .env.local because running this script with tsx doesn't load it by default
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach((line) => {
        const [key, val] = line.split('=')
        if (key && val) {
            process.env[key.trim()] = val.trim()
        }
    })
}

// Re-implement admin client creation here to be sure we have the keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase environment variables.')
    console.error('URL:', supabaseUrl)
    console.error('Key exists:', !!supabaseServiceKey)
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

async function seed() {
    console.log('Seeding data with Service Role...')

    // Seed Projects
    console.log(`Migrating ${projects.length} projects...`)
    for (const p of projects) {
        const { data: existing, error: fetchError } = await supabase.from('projects').select('id').eq('title', p.title).maybeSingle()

        if (fetchError) {
            console.error('Error checking project existence:', fetchError)
            continue
        }

        if (!existing) {
            const { error, data } = await supabase.from('projects').insert({
                title: p.title,
                description: p.description,
                tags: p.tags,
                image: p.image,
                link: p.link || null,
                github: p.github || null,
            }).select()

            if (error) console.error(`Error inserting project ${p.title}:`, error)
            else console.log(`Project ${p.title} inserted via Service Role.`)
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
        }).select()

        if (error) console.error(`Error inserting skill ${s.name}:`, error)
        else console.log(`Skill ${s.name} processed.`)
    }

    console.log('Migration complete.')
}

seed()
