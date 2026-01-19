
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Helper to manually parse .env.local
function getEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env.local')
        if (!fs.existsSync(envPath)) return {}
        const content = fs.readFileSync(envPath, 'utf-8')
        const env: Record<string, string> = {}
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/)
            if (match) {
                const key = match[1].trim()
                const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1')
                env[key] = value
            }
        })
        return env
    } catch (e) {
        console.error('Error reading .env.local', e)
        return {}
    }
}

const env = getEnv()
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    console.log('Tried loading from:', path.resolve(__dirname, '../.env.local'))
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixPublishedDates() {
    console.log('🔍 Checking for published blogs with missing published_at dates...')

    const { data: brokenBlogs, error: fetchError } = await supabase
        .from('blogs')
        .select('id, title, created_at')
        .eq('status', 'published')
        .is('published_at', null)

    if (fetchError) {
        console.error('Error fetching broken blogs:', fetchError)
        return
    }

    if (!brokenBlogs || brokenBlogs.length === 0) {
        console.log('✅ All published blogs have valid published_at dates.')
        return
    }

    console.log(`⚠️ Found ${brokenBlogs.length} blogs to fix.`)

    for (const blog of brokenBlogs) {
        console.log(`🛠️ Fixing: "${blog.title}" (ID: ${blog.id})`)

        // Use created_at as fallback for published_at
        const { error: updateError } = await supabase
            .from('blogs')
            .update({ published_at: blog.created_at })
            .eq('id', blog.id)

        if (updateError) {
            console.error(`❌ Failed to update blog ${blog.id}:`, updateError)
        } else {
            console.log(`✅ Fixed: "${blog.title}" -> published_at set to ${blog.created_at}`)
        }
    }

    console.log('🎉 Repair complete.')
}

fixPublishedDates()
