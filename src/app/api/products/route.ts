import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { storeId: store.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET Products error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, price, description, imageUrl, categoryId } = await req.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ message: "Valid product name is required" }, { status: 400 });
    }

    // Ensure price is a valid number > 0
    if (price === undefined || typeof price !== "number" || price <= 0) {
      return NextResponse.json({ message: "Valid numeric price > 0 is required" }, { status: 400 });
    }

    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category || category.storeId !== store.id) {
        return NextResponse.json({ message: "Forbidden: Invalid category" }, { status: 403 });
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        price,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        categoryId: categoryId || null,
        storeId: store.id,
      },
      include: { category: true },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST Product error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
