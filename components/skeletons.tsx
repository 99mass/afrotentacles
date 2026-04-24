import { Skeleton } from "@/components/ui/skeleton"

export function ArticleCardSkeleton({ variant = "default" }: { variant?: "default" | "featured" | "horizontal" | "compact" }) {
  if (variant === "featured") {
    return (
      <div className="group">
        <Skeleton className="w-full aspect-[16/9] mb-4 rounded-lg" />
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 md:h-10 w-full mb-2" />
          <Skeleton className="h-8 md:h-10 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "horizontal") {
    return (
      <div className="flex gap-4">
        <Skeleton className="w-32 h-24 md:w-40 md:h-28 shrink-0 rounded-lg" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-5 w-full mb-1" />
          <Skeleton className="h-5 w-4/5 mb-2" />
          <div className="hidden md:block">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-3 w-24 mt-2" />
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className="py-3 border-b border-border last:border-0">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-24 mt-1" />
      </div>
    )
  }

  return (
    <div className="group">
      <Skeleton className="w-full aspect-[4/3] mb-3 rounded-lg" />
      <div>
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-4/5 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
