
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envConfig: Record<string, string> = {}

if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8')
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
            const key = match[1].trim()
            let value = match[2].trim()
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1)
            }
            envConfig[key] = value
        }
    })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envConfig.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables. Check .env.local')
    process.exit(1)
}

// Create client directly instead of importing specific file that might depend on process.env
const createAdminClient = () => createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function seedAnalytics() {
    const supabase = createAdminClient()
    console.log('Seeding analytics data (Last 30 days)...')

    const devices = ['desktop', 'mobile', 'desktop', 'desktop', 'mobile', 'tablet']
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge']
    const paths = ['/', '/projects', '/experience', '/contact', '/admin', '/projects']

    // Clear existing (optional, but good for clean charts)
    // await supabase.from('page_views').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    // await supabase.from('visitors').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const sessions = []

    // Generate ~50 visitors over 30 days
    for (let i = 0; i < 50; i++) {
        const daysAgo = Math.floor(Math.random() * 30)
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)

        const sessionId = crypto.randomUUID()
        const device = devices[Math.floor(Math.random() * devices.length)]
        const browser = browsers[Math.floor(Math.random() * browsers.length)]

        sessions.push({
            created_at: date.toISOString(),
            session_id: sessionId,
            device_type: device,
            browser: browser,
            user_agent: `Mozilla/5.0 (${device}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/100.0`
        })

        // Generate 1-5 page views per session
        const viewsCount = Math.floor(Math.random() * 5) + 1
        for (let j = 0; j < viewsCount; j++) {
            // Add slight time offset
            const viewDate = new Date(date.getTime() + j * 60000) // + minutes

            await supabase.from('page_views').insert({
                created_at: viewDate.toISOString(),
                path: paths[Math.floor(Math.random() * paths.length)],
                referrer: 'direct',
                session_id: sessionId
            })
        }
    }

    // Insert visitors in batch
    const { error } = await supabase.from('visitors').insert(sessions)

    if (error) console.error('Error iterating visitors:', error)
    else console.log(`Seeded ${sessions.length} visitors and associated page views.`)
}

seedAnalytics()
