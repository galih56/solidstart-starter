import { PrismaClient } from '@prisma/client'

declare global {
  // Prevent redeclaration errors during hot reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export {}