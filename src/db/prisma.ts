import dotenv from 'dotenv'
dotenv.config()
import { PrismaClient } from "../../generated/prisma"
import { PrismaNeon } from '@prisma/adapter-neon'
import { env } from '../config/env.config';
let databaseUrl = process.env["DATABASE_URL"];

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
});


export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
