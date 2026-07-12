import { StoreCatalogueSkeleton } from "@/components/store/skeletons";

export default function StoreLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <StoreCatalogueSkeleton />
    </div>
  );
}
