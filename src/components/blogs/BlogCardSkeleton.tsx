export default function BlogCardSkeleton() {
    return (
        <div className="group relative bg-[#050505] border border-[#222] rounded-xl overflow-hidden h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="relative aspect-video w-full bg-[#111] animate-pulse">
                <div className="absolute top-3 left-3 w-16 h-6 bg-[#222] rounded animate-pulse" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 p-5 flex flex-col animate-pulse">
                {/* Date */}
                <div className="w-24 h-4 bg-[#111] rounded mb-3" />

                {/* Title */}
                <div className="w-3/4 h-8 bg-[#111] rounded mb-3" />

                {/* Excerpt */}
                <div className="space-y-2 mb-6 flex-1">
                    <div className="w-full h-4 bg-[#111] rounded" />
                    <div className="w-5/6 h-4 bg-[#111] rounded" />
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 pt-4 border-t border-[#222] mt-auto">
                    <div className="w-16 h-4 bg-[#111] rounded" />
                    <div className="w-16 h-4 bg-[#111] rounded" />
                </div>
            </div>
        </div>
    )
}
