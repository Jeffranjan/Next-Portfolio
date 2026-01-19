'use server'

import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function uploadImage(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file) {
        return { error: 'No file provided' }
    }

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { error: 'File size too large (max 5MB)' }
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
        return { error: 'Invalid file type' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    // Use Admin Client to bypass Storage RLS policies
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminSupabase = createAdminClient()

    const { error: uploadError } = await adminSupabase.storage
        .from('blog-images')
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false
        })

    if (uploadError) {
        console.error('Upload Error:', uploadError)
        return { error: uploadError.message }
    }

    const { data: { publicUrl } } = adminSupabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

    return { success: true, url: publicUrl }
}
