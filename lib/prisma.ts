import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Check if DATABASE_URL is configured
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Create Prisma client only if DATABASE_URL is set
export const prisma = hasDatabaseUrl
  ? (globalForPrisma.prisma ??
      new PrismaClient({
        log: ["error", "warn"]
      }))
  : null as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production" && hasDatabaseUrl) {
  globalForPrisma.prisma = prisma;
}

