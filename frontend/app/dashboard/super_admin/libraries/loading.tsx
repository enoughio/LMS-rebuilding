import { Skeleton } from "@/components/ui/skeleton"

export default function LibrariesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-10 w-full md:w-1/3" />
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <Skeleton className="h-[200px] w-full" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[250px] w-full" />
        ))}
      </div>
    </div>
  )
}
