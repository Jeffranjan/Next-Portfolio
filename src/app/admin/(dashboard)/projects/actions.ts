'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'

const BUCKET_NAME = 'project-images'

export async function createProject(prevState: any, formData: FormData) {
    // 1. Verify Admin
    await requireAdmin()

    // Use Admin Client to bypass RLS
    const supabase = createAdminClient()

    // 2. Extract Data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tagsRaw = formData.get('tags') as string
    const live_url = formData.get('live_url') as string
    const github_url = formData.get('github_url') as string
    const order_index = Number(formData.get('order_index')) || 0
    const imageFile = formData.get('image') as File | null

    let image = ''

    // 3. Upload Image (if present)
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, imageFile)

        if (uploadError) {
            return { error: `Image upload failed: ${uploadError.message}` }
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName)

        image = publicUrl
    }

    // 4. Insert into DB
    // NOTE: Using 'image', 'link', 'github' to match existing schema
    const { data: insertData, error: insertError } = await supabase
        .from('projects')
        .insert({
            title,
            description,
            tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
            image,
            link: live_url,
            github: github_url,
            order_index
        })
        .select()
        .single()

    if (insertError) {
        return { error: `Database insert failed: ${insertError.message}` }
    }

    // Log Action
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('CREATE', 'projects', insertData.id, { title, live_url }, 'admin-action')

    // 5. Revalidate and Redirect
    // 5. Revalidate
    revalidatePath('/admin/projects')
    revalidateTag('projects', 'default')

    return { success: true }
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
    await requireAdmin()
    // Use Admin Client to bypass RLS
    const supabase = createAdminClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tagsRaw = formData.get('tags') as string
    const live_url = formData.get('live_url') as string
    const github_url = formData.get('github_url') as string
    const order_index = Number(formData.get('order_index')) || 0
    const imageFile = formData.get('image') as File | null
    const existingImage = formData.get('existing_image_url') as string

    let image = existingImage

    // Handle New Image Upload
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, imageFile)

        if (uploadError) {
            return { error: `Image upload failed: ${uploadError.message}` }
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName)

        image = publicUrl
    }

    const { error: updateError } = await supabase
        .from('projects')
        .update({
            title,
            description,
            tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
            image,
            link: live_url,
            github: github_url,
            order_index
        })
        .eq('id', id)

    if (updateError) {
        return { error: `Update failed: ${updateError.message}` }
    }

    // Log Action
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('UPDATE', 'projects', id, { title, live_url }, 'admin-action')

    revalidatePath('/admin/projects')
    revalidateTag('projects', 'default')

    return { success: true }
}

export async function deleteProject(id: string) {
    await requireAdmin()
    // Use Admin Client to bypass RLS
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('projects')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    // Log Action
    const { logAdminAction } = await import('@/lib/admin/logger')
    await logAdminAction('DELETE', 'projects', id, { soft_delete: true }, 'admin-action')

    revalidatePath('/admin/projects')
    revalidateTag('projects', 'default')
}
