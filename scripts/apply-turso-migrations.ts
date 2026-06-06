#!/usr/bin/env tsx
/**
 * Apply all Prisma migration SQL files to a remote Turso database.
 *
 * Usage (after creating a Turso DB):
 *   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npm run turso:migrate
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

async function main() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const migrationsRoot = path.join(process.cwd(), "prisma", "migrations");
  const folders = fs
    .readdirSync(migrationsRoot)
    .filter((name) => fs.statSync(path.join(migrationsRoot, name)).isDirectory())
    .sort();

  for (const folder of folders) {
    const sqlPath = path.join(migrationsRoot, folder, "migration.sql");
    if (!fs.existsSync(sqlPath)) continue;
    const sql = fs.readFileSync(sqlPath, "utf8");
    console.log(`Applying ${folder}…`);
    await client.executeMultiple(sql);
  }

  console.log("Turso migrations applied.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
