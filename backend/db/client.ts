import { PrismaClient } from '@prisma/client'

// Reuse the existing PrismaClient in development to avoid
// exhausting the database connection limit due to hot reloading.
const prisma = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma
