import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const userId = 'cmn1u60ll0000nn87i9tc0c3c'
  const store = await prisma.store.findFirst({ where: { userId } })
  if (!store) {
    console.log('No store for user')
    return
  }
  const products = await prisma.product.findMany({ where: { storeId: store.id } })
  console.log(`User ${userId} (Store ${store.id}): Found ${products.length} products`)
  products.forEach(p => console.log(`- ${p.name}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
