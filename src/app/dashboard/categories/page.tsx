import { getSellerCategories } from "@/lib/actions/seller.actions";
import CategoriesClient from "./categories-client";

export default async function CategoriesPage() {
  const categories = await getSellerCategories();
  return <CategoriesClient initialCategories={categories} />;
}
