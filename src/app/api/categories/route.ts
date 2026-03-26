import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { StoreService } from "@/lib/services/store.service";
import { CategoryService } from "@/lib/services/category.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const store = await StoreService.getByUserId(session.user.id);
  if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });

  const categories = await CategoryService.listByStoreId(store.id);
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { name } = await req.json();
    const category = await CategoryService.upsert(session.user.id, null, name);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
