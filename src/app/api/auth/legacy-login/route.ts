import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { syncLegacyCredentialToNeonAuth } from "@/lib/auth/sync-legacy-neon-auth";
import { LegacyLoginSchema } from "@/lib/schema";
import { jsonError } from "@/lib/api/handler";
import { logger } from "@/lib/monitoring/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = LegacyLoginSchema.safeParse(body);

    if (!result.success) {
      return jsonError(result.error.issues[0]?.message ?? "Invalid request");
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return jsonError("Invalid email or password", 401);
    }

    if (user.status === "SUSPENDED") {
      return jsonError("Account suspended", 403);
    }

    const syncResult = await syncLegacyCredentialToNeonAuth({
      email,
      password,
      name: user.name || email,
    });

    if (!syncResult.ok) {
      return jsonError(syncResult.error, 400);
    }

    return NextResponse.json({ message: "Account ready. Signing you in..." }, { status: 200 });
  } catch (error) {
    logger.error("Legacy login migration error", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonError("Something went wrong", 500);
  }
}
