import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2] || "kshitizmishra21@gmail.com";

try {
  const users = await prisma.$queryRaw`
    SELECT id, email, name, "emailVerified"
    FROM neon_auth."user"
    WHERE email = ${email}
  `;
  console.log("neon_auth.user:", users);

  if (users.length > 0) {
    const userId = users[0].id;
    const accounts = await prisma.$queryRaw`
      SELECT id, "providerId", "accountId", password IS NOT NULL AS has_password
      FROM neon_auth.account
      WHERE "userId" = ${userId}::uuid
    `;
    console.log("neon_auth.account:", accounts);
  }
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
