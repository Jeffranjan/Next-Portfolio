"use client";

import { User } from "@supabase/supabase-js";
import { Bell, Search, ShieldCheck, LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";

export default function AdminHeader({ user }: { user: User }) {
    return (
        <header className="h-16 border-b border-[#333] bg-black/20 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4 text-gray-500 text-sm font-mono">
                <span className="text-primary">$</span>
                <span className="typing-effect">sys.status --check</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-mono font-bold tracking-wider">SUPERUSER</span>
                </div>

                <div className="flex items-center gap-4 border-l border-[#333] pl-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-400 font-mono">Logged in as</p>
                        <p className="text-sm font-bold text-white max-w-[200px] truncate">{user.email}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>

                    <form action={logout}>
                        <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}
