import Redis from "ioredis";

const REDIS_URL = Deno.env.get("REDIS_URL")!;
const redis = new Redis(REDIS_URL);

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value));
  } catch {
    console.error("Failed to set cache for key", key);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    console.error("Failed to invalidate cache for key", key);
  }
}
