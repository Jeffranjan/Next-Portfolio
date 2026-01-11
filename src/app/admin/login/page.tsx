'use client'

import { useActionState } from 'react'
import { login } from '@/app/auth/actions'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-900 p-8 shadow-2xl border border-gray-800">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Admin Access
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to manage your portfolio
                    </p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        {state?.error && (
                            <div className="rounded-md bg-red-900/50 border border-red-500 p-3 text-sm text-red-200">
                                {state.error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
