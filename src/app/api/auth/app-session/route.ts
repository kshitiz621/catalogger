import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth/app-session";

export async function GET() {
  const session = await getAppSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
