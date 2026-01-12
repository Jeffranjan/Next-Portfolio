
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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugAnalytics() {
    console.log('Testing analytics insertion with Admin Client...')
    console.log('URL:', supabaseUrl)
    // Don't log full key for security, just prefix
    console.log('Key:', supabaseServiceKey.substring(0, 10) + '...')

    const sessionId = 'debug-' + crypto.randomUUID()

    // 1. Insert Visitor
    const visitorData = {
        session_id: sessionId,
        user_agent: 'Debug Script',
        device_type: 'desktop',
        browser: 'Chrome',
        os: 'Windows',
        country: 'US',
        city: 'Debug City'
    }

    console.log('Inserting visitor:', sessionId)
    const { data: vData, error: vError } = await supabase.from('visitors').insert(visitorData).select()

    if (vError) {
        console.error('Visitor Insert Error:', vError)
    } else {
        console.log('Visitor Inserted:', vData)
    }

    // 2. Insert Page View
    const pageViewData = {
        session_id: sessionId,
        path: '/debug-test',
        referrer: 'direct',
        created_at: new Date().toISOString()
    }

    console.log('Inserting page_view...')
    const { data: pData, error: pError } = await supabase.from('page_views').insert(pageViewData).select()

    if (pError) {
        console.error('Page View Insert Error:', pError)
    } else {
        console.log('Page View Inserted:', pData)
    }
}

debugAnalytics()
