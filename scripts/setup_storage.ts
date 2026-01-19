
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
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
    console.log('📦 Checking Storage Buckets...')

    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error('❌ Error listing buckets:', error)
        return
    }

    const bucketName = 'blog-images'
    const exists = buckets.find(b => b.name === bucketName)

    if (exists) {
        console.log(`✅ Bucket '${bucketName}' already exists.`)
    } else {
        console.log(`✨ Creating bucket '${bucketName}'...`)
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        })

        if (createError) {
            console.error('❌ Failed to create bucket:', createError)
        } else {
            console.log(`✅ Bucket '${bucketName}' created successfully.`)
        }
    }

    // Set public access policy (if needed, though 'public: true' usually handles it for reading)
    // Writing requires RLS policies usually.
    console.log('ℹ️ Ensure RLS policies allow Authenticated Users to INSERT into storage.objects for this bucket.')
}

setupStorage()
