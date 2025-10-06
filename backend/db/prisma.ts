import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma?: PrismaClient;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: ["query"], // optional helpful logs in dev
  });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;