import { getAllPublishedBlogs } from '@/lib/api/blogs'

export async function GET() {
    const blogs = await getAllPublishedBlogs()
    const siteUrl = 'https://ranjangupta.online'

    const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>Ranjan Gupta | Engineering &amp; Systems</title>
        <link>${siteUrl}</link>
        <description>Deep dives into system architecture, frontend performance, and the journey of building software products.</description>
        <language>en-us</language>
        ${blogs
            .map((blog) => {
                return `
        <item>
            <title><![CDATA[${blog.title}]]></title>
            <link>${siteUrl}/blogs/${blog.slug}</link>
            <guid>${blog.id}</guid>
            <pubDate>${new Date(blog.published_at!).toUTCString()}</pubDate>
            <description><![CDATA[${blog.excerpt || ''}]]></description>
        </item>`
            })
            .join('')}
    </channel>
</rss>`

    return new Response(feed, {
        headers: {
            'Content-Type': 'text/xml',
            // Cache for 1 hour CDN side
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    })
}
