import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { StoreService } from "@/lib/services/store.service";
import { CategoryService } from "@/lib/services/category.service";
import { CategorySchema } from "@/lib/schema";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "SELLER") return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });

  const store = await StoreService.getByUserId(session.user.id);
  if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });

  const categories = await CategoryService.listByStoreId(store.id);
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "SELLER") return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });

  try {
    const json = await req.json();
    const result = CategorySchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ message: result.error.issues[0].message }, { status: 400 });
    }

    const { name } = result.data;
    const category = await CategoryService.upsert(session.user.id, null, name);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
