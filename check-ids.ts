import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  const stores = await prisma.store.findMany()
  const products = await prisma.product.findMany()
  
  console.log('USERS:', users.map(u => ({ id: u.id, email: u.email })))
  console.log('STORES:', stores.map(s => ({ id: s.id, userId: s.userId, slug: s.slug })))
  console.log('PRODUCTS:', products.map(p => ({ id: p.id, storeId: p.storeId, name: p.name })))
}

main().catch(console.error).finally(() => prisma.$disconnect())
