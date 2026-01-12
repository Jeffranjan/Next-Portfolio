import { LucideIcon, Box } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
    title: string
    description: string
    icon?: LucideIcon
    action?: {
        label: string
        href: string
    }
}

export function EmptyState({ title, description, icon: Icon = Box, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5 w-full">
            <div className="p-3 bg-white/5 rounded-full mb-4">
                <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400 font-mono mb-6 max-w-sm">{description}</p>
            {action && (
                <Link
                    href={action.href}
                    className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-mono text-sm font-bold"
                >
                    {action.label}
                </Link>
            )}
        </div>
    )
}
