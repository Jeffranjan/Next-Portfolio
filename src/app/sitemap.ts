import { getAllPublishedBlogs } from '@/lib/api/blogs'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const blogs = await getAllPublishedBlogs()
    const baseUrl = 'https://ranjangupta.online'

    const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updated_at || blog.published_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        ...blogEntries,
    ]
}
