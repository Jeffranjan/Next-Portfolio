'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackView, trackVisitor } from '@/app/actions/analytics'

export function useAnalytics() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isReturningRef = useRef(false)

    useEffect(() => {
        // Simple session ID generation (UUID v4 style)
        // Simple session ID generation (UUID v4 style) with fallback
        const getSessionId = () => {
            let sessionId = localStorage.getItem('analytics_session_id')
            if (!sessionId) {
                // Fallback for environments where crypto.randomUUID is not available (e.g. non-secure contexts)
                if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                    sessionId = crypto.randomUUID()
                } else {
                    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        const r = Math.random() * 16 | 0
                        const v = c === 'x' ? r : (r & 0x3 | 0x8)
                        return v.toString(16)
                    })
                }
                localStorage.setItem('analytics_session_id', sessionId)
            }
            return sessionId
        }

        const sessionId = getSessionId()

        // Track Visitor (Once per session mainly, but our simple logic is just try to insert and ignore dupe)
        // We'll try to track visitor on first mount of the hook
        if (!isReturningRef.current) {
            const ua = navigator.userAgent
            let device_type = 'desktop'
            if (/mobile/i.test(ua)) device_type = 'mobile'
            else if (/tablet/i.test(ua)) device_type = 'tablet'

            // Simple Browser/OS detection via regex
            let browser = 'Unknown'
            if (/chrome|crios/i.test(ua)) browser = 'Chrome'
            else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
            else if (/safari/i.test(ua)) browser = 'Safari'
            else if (/edg/i.test(ua)) browser = 'Edge'

            let os = 'Unknown'
            if (/windows/i.test(ua)) os = 'Windows'
            else if (/macintosh/i.test(ua)) os = 'macOS'
            else if (/linux/i.test(ua)) os = 'Linux'
            else if (/android/i.test(ua)) os = 'Android'
            else if (/ios/i.test(ua)) os = 'iOS'

            trackVisitor({
                session_id: sessionId,
                user_agent: ua,
                device_type,
                browser,
                os
            })
            isReturningRef.current = true
        }

        // Track Page View
        // Combine path + search params
        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
        trackView({
            path: url,
            referrer: document.referrer || '',
            session_id: sessionId
        })

    }, [pathname, searchParams])
}
