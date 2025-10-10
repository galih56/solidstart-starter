import { PrismaClient } from '@prisma/client'

declare global {
  // attach to globalThis to reuse the same connection during dev/HMR.
  // This ensures we can access `globalThis.prisma` without TypeScript errors.
  // It prevents multiple PrismaClient instances during hot reloads in dev.
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export {}