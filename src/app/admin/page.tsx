import { logout } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-white">
            <div className="mx-auto max-w-4xl space-y-8">
                <header className="flex items-center justify-between border-b border-gray-800 pb-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <form action={logout}>
                        <button
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            Logout
                        </button>
                    </form>
                </header>

                <main className="grid gap-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Welcome back</h2>
                        <p className="text-gray-400">
                            You are logged in as <span className="text-indigo-400">{user.email}</span>
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-800 p-4">
                        <p className="text-sm text-gray-500">Dashboard UI coming in Step 4...</p>
                    </div>
                </main>
            </div>
        </div>
    )
}
