
import { createAdminClient } from '@/lib/supabase/admin'
import { VisitorsChart, DeviceDonut } from '@/components/admin/analytics/AnalyticsCharts'
import { Monitor, Users, MousePointer, Activity } from 'lucide-react'

// Helper to format date as "MMM DD"
function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
    const supabase = createAdminClient()

    // 1. Fetch Total Visitors
    const { count: totalVisitors } = await supabase.from('visitors').select('*', { count: 'exact', head: true })

    // 2. Fetch Total Page Views
    const { count: totalPageViews } = await supabase.from('page_views').select('*', { count: 'exact', head: true })

    // 3. Fetch data for generic generic daily visitors chart (last 30 days)
    // Supabase doesn't support complex aggregations easily via JS client without RPC or views.
    // For simplicity without custom SQL functions, we'll fetch last 30 days visitors and aggregate in JS.
    // This is not performant for huge datasets, but fine for a portfolio started from scratch.

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: recentVisitors } = await supabase
        .from('visitors')
        .select('created_at, device_type')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

    // Aggregate daily visitors
    const dailyVisitorsMap = new Map<string, number>()
    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = formatDate(d.toISOString())
        dailyVisitorsMap.set(dateStr, 0)
    }

    recentVisitors?.forEach(v => {
        const dateStr = formatDate(v.created_at)
        dailyVisitorsMap.set(dateStr, (dailyVisitorsMap.get(dateStr) || 0) + 1)
    })

    // Convert map to array and sort by date (simple string sort won't work perfectly for month boundaries but good enough for visual or we rely on insertion order if we iterated correctly)
    // Actually our map initialization order was reverse (today backwards). Le'ts re-sort or just build array correctly.
    const visitorsChartData = Array.from(dailyVisitorsMap).map(([date, visitors]) => ({ date, visitors })).reverse()


    // Device Breakdown
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0, unknown: 0 }
    recentVisitors?.forEach(v => {
        const type = (v.device_type || 'unknown').toLowerCase() as keyof typeof deviceCounts
        if (deviceCounts[type] !== undefined) deviceCounts[type]++
        else deviceCounts['unknown']++
    })

    const deviceData = [
        { name: 'Desktop', value: deviceCounts.desktop },
        { name: 'Mobile', value: deviceCounts.mobile },
        { name: 'Tablet', value: deviceCounts.tablet },
    ].filter(d => d.value > 0)

    // Top Pages
    const { data: pageViews } = await supabase
        .from('page_views')
        .select('path')
        .limit(1000) // limit for safety aggregation

    const pageCounts: Record<string, number> = {}
    pageViews?.forEach(pv => {
        pageCounts[pv.path] = (pageCounts[pv.path] || 0) + 1
    })

    const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                    <Activity className="text-primary w-6 h-6" />
                    System Analytics
                </h1>
                <p className="text-gray-400 font-mono text-xs mt-1">$ analytics.run --verbose</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-black/40 border border-[#333] p-6 rounded-xl hover:border-primary/50 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 font-mono text-xs group-hover:text-primary">TOTAL_VISITORS</span>
                        <Users className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                    </div>
                    <div className="text-3xl font-display font-bold text-white">
                        {totalVisitors?.toLocaleString() || 0}
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-black/40 border border-[#333] p-6 rounded-xl hover:border-primary/50 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 font-mono text-xs group-hover:text-primary">PAGE_VIEWS</span>
                        <MousePointer className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                    </div>
                    <div className="text-3xl font-display font-bold text-white">
                        {totalPageViews?.toLocaleString() || 0}
                    </div>
                </div>

                {/* Card 3 (Avg Pages/Visitor - rough calc) */}
                <div className="bg-black/40 border border-[#333] p-6 rounded-xl hover:border-primary/50 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 font-mono text-xs group-hover:text-primary">AVG_PAGES/SESSION</span>
                        <Monitor className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                    </div>
                    <div className="text-3xl font-display font-bold text-white">
                        {totalVisitors ? (totalPageViews! / totalVisitors).toFixed(1) : 0}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-black/40 border border-[#333] p-6 rounded-xl">
                    <h3 className="text-sm font-mono text-gray-400 mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Traffic Overview (Last 30 Days)
                    </h3>
                    <VisitorsChart data={visitorsChartData} />
                </div>

                {/* Side Stats */}
                <div className="space-y-6">
                    {/* Device Donut */}
                    <div className="bg-black/40 border border-[#333] p-6 rounded-xl">
                        <h3 className="text-sm font-mono text-gray-400 mb-4">Device Breakdown</h3>
                        <DeviceDonut data={deviceData} />
                    </div>

                    {/* Top Pages */}
                    <div className="bg-black/40 border border-[#333] p-6 rounded-xl">
                        <h3 className="text-sm font-mono text-gray-400 mb-4">Top Pages</h3>
                        <div className="space-y-3">
                            {topPages.map(([path, count], i) => (
                                <div key={path} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-gray-600 w-4">{i + 1}</span>
                                        <span className="text-gray-300 font-mono truncate max-w-[150px]">{path}</span>
                                    </div>
                                    <span className="text-primary font-bold font-mono">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
