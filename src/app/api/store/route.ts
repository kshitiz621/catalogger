import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { StoreUpdateSchema } from "@/lib/schema";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "SELLER") {
      return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });
    }

    const json = await req.json();
    const result = StoreUpdateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // --- Verify ownership ---
    const userStore = await prisma.store.findUnique({
      where: { userId: session.user.id },
    });

    if (!userStore) {
      return NextResponse.json({ message: "Store not found for your account" }, { status: 404 });
    }

    // --- Check slug uniqueness (exclude current store) ---
    const existingStore = await prisma.store.findUnique({
      where: { slug: data.slug },
    });

    if (existingStore && existingStore.id !== userStore.id) {
      return NextResponse.json(
        { message: "This slug is already taken. Please choose a different one." },
        { status: 409 }
      );
    }

    // --- Update ---
    const updatedStore = await prisma.store.update({
      where: { id: userStore.id },
      data: {
        name: data.name,
        slug: data.slug,
        whatsappNumber: data.whatsappNumber,
        logoUrl: data.logoUrl,
        storeTitle: data.storeTitle,
        showCategoryImages: data.showCategoryImages,
        categoryImageStyle: data.categoryImageStyle,
        themeColor: data.themeColor,
        headerCode: data.headerCode,
        footerCode: data.footerCode,
        productsPerRow: data.productsPerRow,
        fontFamily: data.fontFamily,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
        cardRadius: data.cardRadius,
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
