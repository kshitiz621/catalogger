import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const host = process.env.DATABASE_URL?.match(/@([^/]+)/)?.[1] ?? "unknown";
  console.log("DATABASE_URL host:", host);
  const result = await prisma.$queryRaw`SELECT 1 AS ok`;
  console.log("Connection OK:", result);
} catch (error) {
  console.error("Connection FAILED:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
