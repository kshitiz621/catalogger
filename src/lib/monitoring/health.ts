import { prisma } from "@/lib/prisma";
import { isMaintenanceMode } from "@/lib/env";

export async function getHealthStatus() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startedAt;

    return {
      status: "ok" as const,
      timestamp: new Date().toISOString(),
      database: "connected" as const,
      latencyMs,
      maintenance: isMaintenanceMode(),
    };
  } catch (error) {
    return {
      status: "error" as const,
      timestamp: new Date().toISOString(),
      database: "disconnected" as const,
      latencyMs: Date.now() - startedAt,
      maintenance: isMaintenanceMode(),
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}
