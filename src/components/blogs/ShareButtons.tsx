'use client'

import { Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
    title: string
    slug: string
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)

    // In server components or build time, window is undefined. 
    // We can rely on `slug` to form URL or use origin on mount.
    // Better to use origin on click to be safe.

    const url = `https://ranjangupta.online/blogs/${slug}`
    const text = `Check out "${title}" by Ranjan Gupta`

    const shareLinks = [
        {
            name: 'X (Twitter)',
            icon: Twitter,
            onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        }
    ]

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wider mr-2">Share:</span>
            {shareLinks.map((link) => (
                <button
                    key={link.name}
                    onClick={link.onClick}
                    className="p-2 rounded-full border border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-white/20 hover:bg-[#222] transition-all duration-300 group"
                    aria-label={`Share on ${link.name}`}
                >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
            ))}
            <button
                onClick={handleCopy}
                className={cn(
                    "p-2 rounded-full border bg-[#111] transition-all duration-300 group relative",
                    copied
                        ? "border-green-500/50 text-green-500 bg-green-500/10"
                        : "border-[#333] text-gray-400 hover:text-white hover:border-white/20 hover:bg-[#222]"
                )}
                aria-label="Copy Link"
            >
                {copied ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <LinkIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
            </button>
        </div>
    )
}
