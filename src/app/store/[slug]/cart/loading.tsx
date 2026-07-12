import { CartSkeleton } from "@/components/store/skeletons";

export default function CartLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <CartSkeleton />
    </div>
  );
}
