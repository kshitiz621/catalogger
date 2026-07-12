import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json({ message: "Account suspended" }, { status: 403 });
    }

    const { error: signUpError } = await auth.signUp.email({
      email,
      password,
      name: user.name || email,
    });

    if (
      signUpError &&
      !signUpError.message?.toLowerCase().includes("already exists") &&
      !signUpError.message?.toLowerCase().includes("user already")
    ) {
      return NextResponse.json(
        { message: signUpError.message || "Failed to migrate account to Neon Auth" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Account ready. Signing you in..." }, { status: 200 });
  } catch (error) {
    console.error("Legacy login migration error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
