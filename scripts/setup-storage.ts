
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envConfig: Record<string, string> = {}

if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8')
    envFile.split('\n').forEach(line => {
        // Basic parsing: KEY="VALUE" or KEY=VALUE
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
            const key = match[1].trim()
            let value = match[2].trim()
            // Remove quotes if present
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
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
    const bucketName = 'project-images'

    console.log(`Checking storage bucket: ${bucketName}...`)

    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
        console.error('Error listing buckets:', listError)
        // Don't exit, try to create anyway just in case list fails but create works (RLS)
    }

    const bucketExists = buckets?.find(b => b.name === bucketName)

    if (bucketExists) {
        console.log(`Bucket '${bucketName}' already exists.`)
        // Update public setting just in case
        await supabase.storage.updateBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
        })
    } else {
        console.log(`Creating bucket '${bucketName}'...`)
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
        })

        if (createError) {
            console.error('Error creating bucket:', createError)
        } else {
            console.log(`Bucket '${bucketName}' created successfully.`)
        }
    }
}

setupStorage()
