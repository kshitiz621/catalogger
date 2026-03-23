import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductForm from "../../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // @ts-ignore
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
  });

  if (!store) {
    redirect("/dashboard/settings");
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || product.storeId !== store.id) {
    return <div className="p-6 text-red-500">Product not found or access denied.</div>;
  }

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
