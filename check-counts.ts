import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const userCount = await prisma.user.count()
  const storeCount = await prisma.store.count()
  const productCount = await prisma.product.count()
  console.log({ userCount, storeCount, productCount })
}

main().catch(console.error).finally(() => prisma.$disconnect())
