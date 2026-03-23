import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 flex-shrink-0">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold text-white">Catalogger Settings</h1>
        </div>
        <nav className="mt-5 px-2 flex flex-col gap-1">
          <Link href="/dashboard" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            Overview
          </Link>
          {store && (
            <>
              <Link href="/dashboard/products" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/dashboard/categories" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                Categories
              </Link>
            </>
          )}
          <Link href="/dashboard/settings" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            Store Settings
          </Link>
          
          {store && (
            <div className="mt-6 border-t border-gray-800 pt-4">
              <a 
                href={`/store/${store.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-blue-400 hover:bg-gray-800 hover:text-blue-300 transition-colors"
              >
                View Public Store ↗
              </a>
            </div>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{session.user?.email || session.user?.name}</span>
            <LogoutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
