import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        supabaseResponse.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // 1. Refresh session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()

    // 2. Protect Admin Routes
    // If accessing /admin/* (but NOT /admin/login) and NOT logged in -> Redirect to Login
    if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login')) {
        if (!user) {
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }
    }

    // 3. Prevent Re-Login
    // If accessing /admin/login and ALREADY logged in -> Redirect to Admin Dashboard
    if (url.pathname === '/admin/login') {
        if (user) {
            url.pathname = '/admin'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
