'use client'

import { AnalyticsSummary } from '@/app/admin/overview/actions'
import { Activity, ArrowRight, BarChart3, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { Area, AreaChart } from 'recharts'
import ChartContainer from '../analytics/ChartContainer'

export default function AdminOverviewAnalytics({ data }: { data: AnalyticsSummary }) {
    // Format trend data for Recharts
    // Format trend data for Recharts
    const graphData = data.trafficTrend.map((val, i) => ({ i, val }))

    return (
        <div className="bg-black/40 border border-[#333] rounded-xl p-4 md:p-6 relative overflow-hidden group">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-white font-display font-medium text-lg flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        System Pulse
                    </h2>
                    <p className="text-gray-500 font-mono text-xs mt-1">$ analytics.peek --overview</p>
                </div>
                <Link
                    href="/admin/analytics"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors group/link"
                >
                    View Full Analytics
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <div className="flex flex-col gap-6 md:grid md:grid-cols-4 md:gap-8">
                {/* Metric 1: Visitors */}
                <div>
                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-2xl font-bold text-white tracking-tight">{data.totalVisitors}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Total Visitors (30d)</p>
                </div>

                {/* Metric 2: Page Views + Sparkline */}
                <div className="relative">
                    <div className="flex items-end gap-2 mb-1 z-10 relative">
                        <span className="text-2xl font-bold text-white tracking-tight">{data.pageViews}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Page Views (30d)</p>

                    {/* Absolute Sparkline Overlay - Positioned safely */}
                    <div className="absolute -bottom-2 -right-4 w-24 h-12 opacity-30 pointer-events-none">
                        <div className="w-full h-full">
                            {/* Absolute Sparkline Overlay - Positioned safely */}
                            <div className="absolute -bottom-2 -right-4 w-24 h-12 opacity-30 pointer-events-none">
                                <div className="w-full h-full">
                                    <ChartContainer minHeight={0}>
                                        {(width, height) => (
                                            <AreaChart width={width} height={height} data={graphData}>
                                                <Area
                                                    type="monotone"
                                                    dataKey="val"
                                                    stroke="#00ff41"
                                                    fill="#00ff41"
                                                    strokeWidth={2}
                                                    isAnimationActive={false} // Disable animation for stability
                                                />
                                            </AreaChart>
                                        )}
                                    </ChartContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metric 3: Active Today */}
                <div>
                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-2xl font-bold text-white tracking-tight">{data.activeToday}</span>
                        {data.activeToday > 0 && (
                            <span className="relative flex h-2 w-2 mb-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Unique Visitors Today</p>
                </div>

                {/* Metric 4: Top Page */}
                <div className="pt-4 border-t border-[#333] md:pt-0 md:border-t-0 md:border-l md:pl-6">
                    <div className="flex flex-col h-full justify-center">
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">Most Visited Page</p>
                        {data.topPage ? (
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white truncate max-w-[150px] font-mono" title={data.topPage.path}>
                                    {data.topPage.path}
                                </span>
                                <span className="text-xs text-primary/80 font-mono">
                                    {data.topPage.views} views
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-600 font-mono">-</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Link click overlay for whole card interaction */}
            <Link href="/admin/analytics" className="absolute inset-0 z-0" aria-label="Go to analytics" />
        </div>
    )
}
