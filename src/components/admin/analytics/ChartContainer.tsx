'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ChartContainerProps {
    children: (width: number, height: number) => ReactNode
    className?: string
    minHeight?: number
}

export default function ChartContainer({ children, className = "", minHeight = 200 }: ChartContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current
                if (clientWidth > 0 && clientHeight > 0) {
                    setDimensions({ width: clientWidth, height: clientHeight })
                }
            }
        }

        // Initial measurement
        updateDimensions()

        // Observer
        const observer = new ResizeObserver((entries) => {
            // Debounce slightly or just take latest
            requestAnimationFrame(() => {
                if (!Array.isArray(entries) || !entries.length) return
                updateDimensions()
            })
        })

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`} style={{ minHeight: `${minHeight}px` }}>
            {dimensions ? children(dimensions.width, dimensions.height) : <div className="w-full h-full animate-pulse bg-white/5 rounded-lg" />}
        </div>
    )
}
