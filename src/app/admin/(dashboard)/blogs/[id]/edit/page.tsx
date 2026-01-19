import { notFound } from 'next/navigation'
import BlogForm from '@/components/admin/blogs/BlogForm'
import { getBlog } from '../../actions'

interface EditBlogPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    const { id } = await params
    const blog = await getBlog(id)

    if (!blog) {
        notFound()
    }

    return <BlogForm initialData={blog} isEditing />
}
