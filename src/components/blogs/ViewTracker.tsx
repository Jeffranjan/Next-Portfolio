'use client'

import { useEffect, useRef } from 'react'
import { incrementView } from '@/app/(public)/blogs/actions'

interface ViewTrackerProps {
    blogId: string
}

export default function ViewTracker({ blogId }: ViewTrackerProps) {
    const effectRan = useRef(false)

    useEffect(() => {
        // Prevent double fire in React 18 Strict Mode
        if (effectRan.current) return

        // Basic session dedupe using sessionStorage
        const storageKey = `viewed_blog_${blogId}`
        if (!sessionStorage.getItem(storageKey)) {
            incrementView(blogId)
            sessionStorage.setItem(storageKey, 'true')
            effectRan.current = true
        }
    }, [blogId])

    return null
}
