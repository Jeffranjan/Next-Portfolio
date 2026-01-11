import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Manually load .env.local
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase environment variables.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

const experienceData = [
    {
        year_range: "Oct 2024 - Present",
        role: "Full-Stack Developer",
        company: "Freelancing",
        description: "Delivered multiple client web applications using React.js and Next.js, improving overall UI/UX and engagement. Currently developing a full-stack e-commerce platform with admin analytics using React, Redux, Node.js, Express.js, MongoDB and Supabase to optimize inventory, cart, and payment workflows. Additionally, provided backend support and security for healthcare applications, strengthening IT operations and system reliability.",
        order_index: 0,
        is_head: true
    },
    {
        year_range: "Jan 2024 - Sep 2024",
        role: "Backend Developer",
        company: "Grow Academy Pvt. Ltd.",
        description: "Managed full-stack development for internal web applications using Node.js, Express, and MongoDB, improving system efficiency by 40%. Led the complete project lifecycle, including requirement analysis, RESTful API development, frontend integration, testing, and deployment. Also introduced best practices for version control and code reviews to enhance team workflow and code quality.",
        order_index: 1,
        is_head: false
    },
    {
        year_range: "Jan 2023 - Dec 2023",
        role: "Web & Databases Management",
        company: "digiDZN (digiCart India Pvt. Ltd.",
        description: "Designed and developed responsive web interfaces using HTML5, CSS3, and JavaScript, increasing user engagement by 45% through improved UI design. Managed and optimized a 10,000+ record Freshdesk CRM database, enhancing data workflows and reducing ticket resolution time by 25%. Additionally, collaborated on SEO strategies for product pages, contributing to a 50% boost in organic search rankings.",
        order_index: 2,
        is_head: false
    },
    {
        year_range: "Nov 2021 - Nov 2022",
        role: "Web Developer Intern",
        company: "Webpandits & Smarden | 30 Days Technologies Pvt. Ltd.",
        description: "Assisted in developing and maintaining client websites while creating digital marketing graphics and UI elements for social campaigns. Additionally analyzed website performance metrics and prepared reports to guide improvements in design and content strategy.",
        order_index: 3,
        is_head: false
    },
];

async function seed() {
    console.log('Seeding experience data...')

    for (const exp of experienceData) {
        const { data: existing, error: fetchError } = await supabase.from('experience').select('id').eq('role', exp.role).eq('company', exp.company).maybeSingle()

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows" which is fine for maybeSingle
            console.error(`Error checking existing experience: ${fetchError.message}`)
        }

        if (!existing) {
            const { error } = await supabase.from('experience').insert({
                role: exp.role,
                company: exp.company,
                description: exp.description,
                year_range: exp.year_range,
                order_index: exp.order_index,
                is_head: exp.is_head
            })
            if (error) console.error(`Error inserting experience ${exp.role}:`, error)
            else console.log(`Experience ${exp.role} inserted.`)
        } else {
            console.log(`Experience ${exp.role} already exists.`)
        }
    }

    console.log('Migration complete.')
}

seed()
