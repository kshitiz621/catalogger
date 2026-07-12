import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = "kshitizmishra21@gmail.com";

const user = await prisma.user.findUnique({
  where: { email },
  include: { store: { select: { id: true, name: true, slug: true } } },
});

console.log(JSON.stringify(user, null, 2));
await prisma.$disconnect();
