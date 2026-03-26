import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import CategoryForm from "../../CategoryForm";
import { ChevronRight, Edit, Tags } from "lucide-react";
import Link from "next/link";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      storeId: true,
    }
  });

  if (!category || category.storeId !== store.id) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Link href="/dashboard/categories" className="hover:text-primary transition-colors">Categories</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Edit Category</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
           <Edit className="w-6 h-6 text-primary" />
           Edit Category: <span className="text-primary/70">{category.name}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
           Changing a category name updates all linked products automatically.
        </p>
      </div>

      <div className="bg-white/50 rounded-3xl border border-border/40 p-6 shadow-sm shadow-black/[0.02]">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}
