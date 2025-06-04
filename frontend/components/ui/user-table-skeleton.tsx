import { Skeleton } from "@/components/ui/skeleton";

export function UserTableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
          <div className="col-span-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="col-span-2 flex items-center">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="col-span-2 flex items-center">
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="col-span-2 flex items-center">
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="col-span-2 flex items-center justify-end">
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}
