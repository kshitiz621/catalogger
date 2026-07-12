import { NextResponse } from "next/server";
import { PublicStoreService } from "@/lib/services/public-store.service";
import { StorefrontSlugSchema } from "@/lib/schema";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const parsed = StorefrontSlugSchema.safeParse({ slug });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid store slug" }, { status: 400 });
  }

  const store = await PublicStoreService.getStoreBySlug(parsed.data.slug);

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  return NextResponse.json({ store });
}
