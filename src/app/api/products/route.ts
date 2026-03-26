import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { StoreService } from "@/lib/services/store.service";
import { ProductService } from "@/lib/services/product.service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const store = await StoreService.getByUserId(session.user.id);
  if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });

  const products = await ProductService.listByStoreId(store.id);
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const product = await ProductService.upsert(session.user.id, null, data);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.message.includes("Forbidden") ? 403 : 400 });
  }
}
