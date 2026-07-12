import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth/app-session";
import { StoreService } from "@/lib/services/store.service";
import { ProductService } from "@/lib/services/product.service";
import { ProductSchema } from "@/lib/schema";

export async function GET() {
  const session = await getAppSession();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "SELLER") return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });

  const store = await StoreService.getByUserId(session.user.id);
  if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });

  const products = await ProductService.listByStoreId(store.id);
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getAppSession();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "SELLER") return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });

  try {
    const json = await req.json();
    const result = ProductSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ message: result.error.issues[0].message }, { status: 400 });
    }

    const product = await ProductService.upsert(session.user.id, null, result.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.message.includes("Forbidden") ? 403 : 400 });
  }
}
