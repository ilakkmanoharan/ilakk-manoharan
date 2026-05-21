import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma";

function createPrismaClient() {
  const url =
    process.env.DATABASE_URL ??
    (process.env.NODE_ENV !== "production" ? "file:./dev.db" : undefined);
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. For production, set DATABASE_URL. For local dev, copy .env.example to .env or rely on the default SQLite URL.",
    );
  }
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
