
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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspect() {
    const tableName = process.argv[2] || 'projects'
    console.log(`Inspecting table: ${tableName}`)
    const { data, error } = await supabase.from(tableName).select('*').limit(1)
    if (error) {
        console.error('Error:', error)
    } else {
        if (data && data.length > 0) {
            console.log('Columns found:', Object.keys(data[0]))
        } else {
            console.log('Table is empty, cannot inspect columns easily without insert.')
            // Try to insert a dummy to see errors? No, safer to just report empty.
        }
    }
}

inspect()
