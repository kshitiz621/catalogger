import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductForm from "../ProductForm";
import { ChevronRight, Plus, Package } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
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

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Link href="/dashboard/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">New Product</span>
      </nav>

      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
           <Plus className="w-6 h-6 text-primary" />
           Add New Product
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Create a standout listing with clear images and pricing.
        </p>
      </div>

      <div className="bg-white/50 rounded-3xl border border-border/40 p-6 md:p-10 shadow-sm shadow-black/[0.02]">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
