import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name, businessName, whatsappNumber, storeSlug } = await req.json();

    if (!email || !password || !name || !businessName || !storeSlug) {
      return NextResponse.json({ message: "All required fields must be provided" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const existingStore = await prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (existingStore) {
      return NextResponse.json({ message: "Store URL slug is already taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const store = await prisma.store.create({
      data: {
        name: businessName,
        slug: storeSlug,
        whatsappNumber: whatsappNumber || null,
        userId: user.id,
      }
    });

    await prisma.category.create({
      data: {
        name: "General",
        storeId: store.id,
      }
    });

    return NextResponse.json({ message: "User created successfully", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
