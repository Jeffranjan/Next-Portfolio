"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Cpu, Award, BarChart3, LogOut, Terminal, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";

const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Skills", href: "/admin/skills", icon: Award },
    { name: "Experience", href: "/admin/experience", icon: Cpu },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Activity", href: "/admin/activity", icon: Shield },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <>
            <aside className="hidden md:flex flex-col w-64 bg-black/50 border-r border-[#333] h-screen sticky top-0 backdrop-blur-xl">
                <div className="p-6 border-b border-[#333]">
                    <Link href="/admin" className="flex items-center gap-2 group">
                        <Terminal className="text-primary w-6 h-6" />
                        <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                            ADMIN<span className="text-primary">_OS</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-mono",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,255,65,0.1)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-gray-500 group-hover:text-white")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#333]">
                    <form action={logout} className="w-full">
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-mono group"
                        >
                            <LogOut className="w-5 h-5 group-hover:text-red-400" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/95 backdrop-blur-xl border-t border-[#333] z-50 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] box-content">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 group text-xs font-mono gap-1 active:scale-95",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-gray-500 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500")} />
                            <span className="text-[10px]">{item.name}</span>
                        </Link>
                    );
                })}
                <form action={logout}>
                    <button type="submit" className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-red-400">
                        <LogOut className="w-5 h-5" />
                        <span className="text-[10px]">Exit</span>
                    </button>
                </form>
            </nav>
        </>
    );
}
