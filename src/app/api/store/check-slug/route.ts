import { NextResponse } from "next/server";
import { findStoreIdBySlug } from "@/lib/prisma-compat";
import { StoreSlugSchema } from "@/lib/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "";

  const result = StoreSlugSchema.safeParse({ slug });
  if (!result.success) {
    return NextResponse.json(
      { available: false, message: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const existing = await findStoreIdBySlug(result.data.slug);

  return NextResponse.json({
    available: !existing,
    slug: result.data.slug,
    message: existing ? "This store URL is already taken" : "Available",
  });
}
