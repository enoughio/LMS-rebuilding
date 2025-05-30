import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="space-y-4">
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  )
}
