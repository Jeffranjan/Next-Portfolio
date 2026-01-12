'use client'

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts'
import ChartContainer from './ChartContainer'

export function VisitorsChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return <div className="h-[300px] w-full flex items-center justify-center text-gray-500 font-mono text-xs">No data available</div>

    return (
        <div className="w-full h-[220px] sm:h-[260px] md:h-[300px]">
            <ChartContainer>
                {(width, height) => (
                    <AreaChart width={width} height={height} data={data}>
                        <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#00ff41', fontFamily: 'monospace' }}
                            labelStyle={{ color: '#999', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="visitors" stroke="#00ff41" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                    </AreaChart>
                )}
            </ChartContainer>
        </div>
    )
}

export function DeviceDonut({ data }: { data: any[] }) {
    const COLORS = ['#00ff41', '#008f24', '#004c13', '#333333'];

    if (!data || data.length === 0) return <div className="h-[250px] w-full flex items-center justify-center text-gray-500 font-mono text-xs">No data available</div>

    return (
        <div className="w-full h-[220px] sm:h-[250px]">
            <ChartContainer>
                {(width, height) => (
                    <PieChart width={width} height={height}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                        />
                        <Legend iconType="circle" />
                    </PieChart>
                )}
            </ChartContainer>
        </div>
    )
}
