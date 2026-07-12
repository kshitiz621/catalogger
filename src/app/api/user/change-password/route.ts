import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getAppSession } from "@/lib/auth/app-session";

export async function POST(req: Request) {
  try {
    const session = await getAppSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || typeof currentPassword !== "string" || currentPassword.trim() === "") {
      return NextResponse.json({ message: "Current password is required" }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.trim() === "") {
      return NextResponse.json({ message: "New password is required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "New password must be at least 6 characters" }, { status: 400 });
    }

    const { error } = await auth.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      return NextResponse.json({ message: error.message || "Failed to update password" }, { status: 400 });
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Change Password error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
