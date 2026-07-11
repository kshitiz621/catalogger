import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ProductSchema } from "@/lib/schema";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SELLER") {
      return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct || existingProduct.storeId !== store.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const result = ProductSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ message: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category || category.storeId !== store.id) {
        return NextResponse.json({ message: "Forbidden: Invalid category" }, { status: 403 });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        categoryId: data.categoryId === "" ? null : (data.categoryId || null),
      },
      include: { category: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT Product error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SELLER") {
      return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct || existingProduct.storeId !== store.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE Product error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
