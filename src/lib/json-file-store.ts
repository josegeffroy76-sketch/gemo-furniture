import fs from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Persistent key-value storage for admin edits (product overrides, custom
 * products, order log).
 *
 * On serverless hosts like Vercel, the application filesystem is read-only
 * at runtime — writing to disk throws instantly. So whenever Redis
 * credentials are present (a Redis/KV store connected via the Vercel
 * Marketplace, e.g. Upstash), reads/writes go there instead, which is what
 * makes admin edits and the order log actually persist in production.
 *
 * Without Redis credentials (plain local development with no store
 * connected), this falls back to local JSON files under /data so the admin
 * panel still works with zero external setup.
 */

// Different Redis/KV marketplace integrations name their injected env vars
// differently (KV_REST_API_* historically, UPSTASH_REDIS_REST_* for a direct
// Upstash integration, etc.) — check the common variants rather than assume
// one exact name.
function resolveRedisCredentials(): { url: string; token: string } | null {
  const pairs = [
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
    ["REDIS_KV_REST_API_URL", "REDIS_KV_REST_API_TOKEN"],
  ] as const;

  for (const [urlKey, tokenKey] of pairs) {
    const url = process.env[urlKey];
    const token = process.env[tokenKey];
    if (url && token) return { url, token };
  }
  return null;
}

const credentials = resolveRedisCredentials();
const redis = credentials ? new Redis({ url: credentials.url, token: credentials.token }) : null;

if (!redis && process.env.NODE_ENV === "production") {
  // Loud, once-per-cold-start warning rather than a silent fallback to a
  // filesystem that will fail on every write in this environment.
  console.warn(
    "No Redis/KV store detected — admin edits and orders will not persist in production. " +
      "Connect a Redis store via Vercel's Storage tab and redeploy."
  );
}

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readFileFallback<T>(filename: string, fallback: T): T {
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

function writeFileFallback<T>(filename: string, data: T): void {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Failed to write data/${filename}:`, err);
    throw new Error("Couldn't save changes.");
  }
}

/**
 * Reads a stored JSON value by key (historically a filename, now doubles as
 * a Redis key — e.g. "product-overrides.json").
 */
export async function readJsonFile<T>(key: string, fallback: T): Promise<T> {
  if (redis) {
    try {
      const value = await redis.get<T>(key);
      return value ?? fallback;
    } catch (err) {
      console.error(`Failed to read "${key}" from Redis:`, err);
      return fallback;
    }
  }
  return readFileFallback(key, fallback);
}

export async function writeJsonFile<T>(key: string, data: T): Promise<void> {
  if (redis) {
    try {
      await redis.set(key, data);
      return;
    } catch (err) {
      console.error(`Failed to write "${key}" to Redis:`, err);
      throw new Error("Couldn't save changes. Please try again.");
    }
  }
  writeFileFallback(key, data);
}
