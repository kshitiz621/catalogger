import { getSellerProducts } from "@/lib/actions/seller.actions";
import ProductsClient from "./products-client";

export default async function ProductsPage() {
  const products = await getSellerProducts();
  return <ProductsClient initialProducts={products} />;
}
