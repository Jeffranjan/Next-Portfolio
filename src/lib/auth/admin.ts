import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// You can move this to a config file if preferred
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())

/**
 * Retrieves the current authenticated user only if they are an admin.
 * Returns null if not authenticated or not an admin.
 * 
 * ARCHITECTURE NOTE:
 * We use a hybrid approach for Admin Auth:
 * 1. Supabase Auth handles identity (Who is this?)
 * 2. Environment Variables (ADMIN_EMAILS) handle authorization (What can they do?)
 * 
 * Why not a DB table for admins?
 * - For a personal portfolio, hardcoded env vars are safer and simpler (Infrastructure as Code).
 * - No risk of accidentally deleting the only admin from the DB.
 * - Zero DB reads required for initial permission check (faster).
 */
export async function getAdminSession() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user || !user.email) {
        return null
    }

    if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        console.warn(`Unauthorized access attempt by: ${user.email}`)
        return null
    }

    return user
}

/**
 * Enforces admin access. Use this in Server Components and Server Actions.
 * Redirects to /admin/login if unauthorized.
 */
export async function requireAdmin() {
    const user = await getAdminSession()

    if (!user) {
        redirect('/admin/login')
    }

    return user
}
