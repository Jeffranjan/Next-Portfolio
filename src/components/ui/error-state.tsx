import { AlertTriangle } from "lucide-react"

interface ErrorStateProps {
    title?: string
    message: string
    retry?: () => void
}

export function ErrorState({ title = "Something went wrong", message, retry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 w-full">
            <AlertTriangle className="w-8 h-8 mb-2 opacity-80" />
            <h3 className="font-bold mb-1">{title}</h3>
            <p className="text-sm font-mono opacity-80 mb-4">{message}</p>
            {retry && (
                <button
                    onClick={retry}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-mono transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    )
}
