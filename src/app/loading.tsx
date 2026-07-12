import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-5xl flex-col gap-4 px-6 py-16">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
