import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import DashboardLayoutClient from "./DashboardLayoutClient";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  if (!session) return { title: "Dashboard" };

  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
    select: { name: true, storeTitle: true, logoUrl: true }
  });

  if (!store) return { title: "Dashboard | Catalogger" };

  const title = store.storeTitle ? `Dashboard | ${store.storeTitle}` : `Dashboard | ${store.name}`;

  return {
    title,
    icons: store.logoUrl ? [
      { rel: "icon", url: store.logoUrl },
      { rel: "apple-touch-icon", url: store.logoUrl }
    ] : undefined
  };
}

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
    select: { id: true, name: true, slug: true, logoUrl: true, storeTitle: true }
  });

  return (
    <DashboardLayoutClient 
      session={JSON.parse(JSON.stringify(session))} 
      store={store ? JSON.parse(JSON.stringify(store)) : null}
    >
      {children}
    </DashboardLayoutClient>
  );
}
