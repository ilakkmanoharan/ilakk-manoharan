#!/usr/bin/env tsx
/**
 * Watch private/ content and rebuild the local knowledge graph overlay on change.
 * Also watches Nature-Foundation-Models/private/ when the local repo is present.
 *
 * Usage:
 *   npm run agent:watch-private
 *   npm run agent:watch-private -- --also-public   # run full public sync once at start
 */
import fs from "node:fs";
import path from "node:path";
import { syncKnowledgeGraph } from "../src/lib/agent/sync-knowledge";
import {
  listPrivateWatchPaths,
  syncPrivateContentOverlay,
} from "../src/lib/agent/private-content-sync";

const args = process.argv.slice(2);
const DEBOUNCE_MS = 800;

let timer: ReturnType<typeof setTimeout> | null = null;
let running = false;

async function runPrivateOverlaySync(cwd: string, label: string) {
  if (running) {
    console.log(`[skip] sync already running (${label})`);
    return;
  }
  running = true;
  const started = Date.now();
  try {
    const { stats } = syncPrivateContentOverlay(cwd);
    console.log(
      `[${new Date().toLocaleTimeString()}] ${label} → ${stats.claims} private claims from ${stats.files} files (${Date.now() - started}ms)`,
    );
  } catch (err) {
    console.error("[error]", err);
  } finally {
    running = false;
  }
}

function schedulePrivateSync(cwd: string, label: string) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    void runPrivateOverlaySync(cwd, label);
  }, DEBOUNCE_MS);
}

function watchPath(cwd: string, target: string) {
  if (!fs.existsSync(target)) {
    console.warn(`[warn] missing watch path: ${path.relative(cwd, target)}`);
    return;
  }

  const stat = fs.statSync(target);
  const label = path.relative(cwd, target);
  const allowHtml = target.includes("Nature-Foundation-Models");
  const ok = (ext: string) => TEXT_OK(ext) || (allowHtml && ext === ".html");

  if (stat.isFile()) {
    fs.watch(target, () => schedulePrivateSync(cwd, label));
    console.log(`  watching file  ${label}`);
    return;
  }

  try {
    fs.watch(target, { recursive: true }, (_event, filename) => {
      if (!filename) {
        schedulePrivateSync(cwd, label);
        return;
      }
      const ext = path.extname(filename).toLowerCase();
      if (ok(ext)) schedulePrivateSync(cwd, `${label}/${filename}`);
    });
    console.log(`  watching dir    ${label}/`);
  } catch {
    fs.watch(target, () => schedulePrivateSync(cwd, label));
    console.log(`  watching dir    ${label}/ (non-recursive)`);
  }
}

function TEXT_OK(ext: string) {
  return ext === ".md" || ext === ".txt" || ext === ".markdown" || ext === "";
}

async function main() {
  const cwd = process.cwd();

  if (args.includes("--also-public")) {
    console.log("Initial public knowledge sync…");
    await syncKnowledgeGraph(cwd);
  }

  console.log("Initial private overlay sync…");
  await runPrivateOverlaySync(cwd, "initial");

  console.log("\nWatching private content (Ctrl+C to stop):");
  for (const p of listPrivateWatchPaths(cwd)) {
    watchPath(cwd, p);
  }

  console.log("\nPrivate knowledge watcher running.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
