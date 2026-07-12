import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth/app-session";
import { prisma } from "@/lib/prisma";
import { findStoreIdByUserId } from "@/lib/prisma-compat";
import { CategorySchema } from "@/lib/schema";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAppSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SELLER") {
      return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });
    }

    const store = await findStoreIdByUserId(session.user.id);

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category || category.storeId !== store.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const result = CategorySchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ message: result.error.issues[0].message }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: result.data.name },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("PUT Category error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAppSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SELLER") {
      return NextResponse.json({ message: "Forbidden: Seller access required" }, { status: 403 });
    }

    const store = await findStoreIdByUserId(session.user.id);

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category || category.storeId !== store.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE Category error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
