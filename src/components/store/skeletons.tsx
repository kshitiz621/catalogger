import { Skeleton } from "@/components/ui/skeleton";

export function StoreCatalogueSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 border-b border-border pb-5">
        <Skeleton className="h-11 w-full md:w-96 rounded-xl" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <Skeleton className="h-5 w-40" />
      <div className="rounded-[32px] border border-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Skeleton className="aspect-square md:aspect-auto md:h-[500px]" />
          <div className="p-8 md:p-14 space-y-6">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
