import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = await prisma.user.findMany({
  select: { email: true, role: true, name: true },
});

let neonUsers = [];
try {
  neonUsers = await prisma.$queryRaw`
    SELECT email FROM neon_auth."user" ORDER BY email
  `;
} catch (error) {
  console.log("neon_auth.user query failed:", error instanceof Error ? error.message : error);
}

console.log("App users:", users);
console.log("Neon auth users:", neonUsers);

await prisma.$disconnect();
