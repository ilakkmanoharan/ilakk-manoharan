import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  // SQLite DB is created at build (gitignored); include it for serverless routes that read Prisma at runtime.
  outputFileTracingIncludes: {
    "/*": ["./prisma/**/*.db", "./prisma/**/*.db-journal", "./**/*.db"],
  },
};

export default nextConfig;
