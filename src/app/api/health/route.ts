import { getHealthStatus } from "@/lib/monitoring/health";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getHealthStatus();
  const status = health.status === "ok" ? 200 : 503;
  return NextResponse.json(health, { status });
}
