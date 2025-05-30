import { Skeleton } from "@/components/ui/skeleton"

export default function MembersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <div className="rounded-md border">
        <div className="border-b p-4">
          <div className="grid grid-cols-12 gap-4">
            <Skeleton className="col-span-4 h-4" />
            <Skeleton className="col-span-2 h-4" />
            <Skeleton className="col-span-2 h-4" />
            <Skeleton className="col-span-2 h-4" />
            <Skeleton className="col-span-2 h-4" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b p-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[120px]" />
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <Skeleton className="h-4 w-[80px]" />
              </div>
              <div className="col-span-2 flex items-center">
                <Skeleton className="h-4 w-[60px]" />
              </div>
              <div className="col-span-2 flex items-center">
                <Skeleton className="h-6 w-[70px] rounded-full" />
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
