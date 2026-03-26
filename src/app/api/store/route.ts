import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, whatsappNumber, logoUrl, showCategoryImages, categoryImageStyle } = await req.json();

    // --- Validate required fields ---
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ message: "Store name is required" }, { status: 400 });
    }

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json({ message: "Store slug is required" }, { status: 400 });
    }

    // --- Validate slug format (lowercase alphanumeric + hyphens only) ---
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const cleanSlug = slug.trim().toLowerCase();
    if (!slugRegex.test(cleanSlug)) {
      return NextResponse.json(
        { message: "Slug must contain only lowercase letters, numbers, and hyphens. It cannot start or end with a hyphen." },
        { status: 400 }
      );
    }

    if (cleanSlug.length < 3) {
      return NextResponse.json({ message: "Slug must be at least 3 characters long" }, { status: 400 });
    }

    if (cleanSlug.length > 48) {
      return NextResponse.json({ message: "Slug must be 48 characters or fewer" }, { status: 400 });
    }

    // --- Validate WhatsApp number ---
    if (whatsappNumber !== undefined && whatsappNumber !== null && whatsappNumber !== "") {
      const cleanNumber = String(whatsappNumber).replace(/\D/g, "");
      if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        return NextResponse.json(
          { message: "WhatsApp number must be between 10 and 15 digits (with country code, e.g. 919876543210)" },
          { status: 400 }
        );
      }
    }

    // --- Verify ownership ---
    const userStore = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!userStore) {
      return NextResponse.json({ message: "Store not found for your account" }, { status: 404 });
    }

    // --- Check slug uniqueness (exclude current store) ---
    const existingStore = await prisma.store.findUnique({
      where: { slug: cleanSlug },
    });

    if (existingStore && existingStore.id !== userStore.id) {
      return NextResponse.json(
        { message: "This slug is already taken. Please choose a different one." },
        { status: 409 }
      );
    }

    // --- Update ---
    const updatedStore = await (prisma as any).store.update({
      where: { id: userStore.id },
      data: {
        name: name.trim(),
        slug: cleanSlug,
        whatsappNumber: whatsappNumber ? String(whatsappNumber).replace(/\D/g, "") : null,
        logoUrl: logoUrl || null,
        showCategoryImages: !!showCategoryImages,
        categoryImageStyle: categoryImageStyle || "square",
      },
    });

    return NextResponse.json(
      { message: "Store updated successfully", store: updatedStore },
      { status: 200 }
    );
  } catch (error) {
    console.error("Store update error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
