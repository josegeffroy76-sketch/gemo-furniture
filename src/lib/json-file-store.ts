import fs from "node:fs";
import path from "node:path";

/**
 * Minimal JSON-file "database" used for admin edits (product overrides,
 * custom products, order log) so the admin panel works with zero external
 * setup.
 *
 * IMPORTANT — production note: on serverless hosts (e.g. Vercel) the
 * filesystem is read-only/ephemeral at runtime, so writes here will not
 * persist across deployments or cold starts. This is fine for local
 * development and demos. Before going live, swap these read/write calls for
 * a real database (see prisma/schema.prisma + README "Moving to Postgres").
 */

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read data/${filename}:`, err);
    return fallback;
  }
}

export function writeJsonFile<T>(filename: string, data: T): void {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Failed to write data/${filename}:`, err);
    throw new Error("Couldn't save changes to disk.");
  }
}
