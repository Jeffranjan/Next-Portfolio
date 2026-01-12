'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'

export type AnalyticsSummary = {
    totalVisitors: number
    pageViews: number
    avgPagesPerSession: number
    activeToday: number
    topPage: { path: string, views: number } | null
    trafficTrend: number[] // Last 7 days visitors count
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
    await requireAdmin()
    const supabase = createAdminClient()

    // Date Ranges
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Parallel Queries
    const [visitors, pageViews, events] = await Promise.all([
        supabase.from('visitors').select('created_at').gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('page_views').select('path, created_at, session_id').gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('visitors').select('session_id').gte('created_at', todayStart.toISOString()) // Active today
    ])

    const totalVisitors = visitors.data?.length || 0
    const totalViews = pageViews.data?.length || 0
    const activeToday = events.data?.length || 0
    const avgPagesPerSession = totalVisitors > 0 ? parseFloat((totalViews / totalVisitors).toFixed(1)) : 0

    // Top Page Logic
    const pageCounts: Record<string, number> = {}
    pageViews.data?.forEach(v => {
        pageCounts[v.path] = (pageCounts[v.path] || 0) + 1
    })
    const sortedPages = Object.entries(pageCounts).sort(([, a], [, b]) => b - a)
    const topPage = sortedPages.length > 0 ? { path: sortedPages[0][0], views: sortedPages[0][1] } : null

    // Traffic Trend (Last 7 Days)
    const trend: number[] = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        const dEnd = new Date(dStart.getTime() + 24 * 60 * 60 * 1000)

        const count = visitors.data?.filter(v => {
            const vDate = new Date(v.created_at)
            return vDate >= dStart && vDate < dEnd
        }).length || 0

        trend.push(count)
    }

    return {
        totalVisitors,
        pageViews: totalViews,
        avgPagesPerSession,
        activeToday,
        topPage,
        trafficTrend: trend
    }
}
