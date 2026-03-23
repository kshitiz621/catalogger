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

    const { name, slug } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ message: "Name and slug are required" }, { status: 400 });
    }

    // Ensure the new slug is unique, except if it already belongs to the same user
    const existingStore = await prisma.store.findUnique({
      where: { slug }
    });

    if (existingStore && existingStore.userId !== session.user.id) {
      return NextResponse.json({ message: "Slug is already taken by another store." }, { status: 400 });
    }

    // Find the user's store
    const userStore = await prisma.store.findFirst({
      where: { userId: session.user.id }
    });

    if (!userStore) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    // Update the store
    const updatedStore = await prisma.store.update({
      where: { id: userStore.id },
      data: { name, slug },
    });

    return NextResponse.json({ message: "Store updated successfully", store: updatedStore }, { status: 200 });
  } catch (error) {
    console.error("Store update error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
