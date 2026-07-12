import { NextRequest, NextResponse } from "next/server";
import { PublicStoreService } from "@/lib/services/public-store.service";
import { StorefrontProductQuerySchema, StorefrontSlugSchema } from "@/lib/schema";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const slugResult = StorefrontSlugSchema.safeParse({ slug });

  if (!slugResult.success) {
    return NextResponse.json({ error: "Invalid store slug" }, { status: 400 });
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const queryResult = StorefrontProductQuerySchema.safeParse(searchParams);

  if (!queryResult.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: queryResult.error.flatten() },
      { status: 400 }
    );
  }

  const result = await PublicStoreService.listProductsBySlug(
    slugResult.data.slug,
    queryResult.data
  );

  if (!result) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
