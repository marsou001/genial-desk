import Redis from 'ioredis';
import { isSerializable } from '../utils';

const redis = new Redis();

export async function getCache<T>(key: string): Promise<T | null> {
  let value: string | null;

  try {
    value = await redis.get(key);
    if (!value) return null;
  } catch (error) {
    console.error("From Redis cache: failed to fetch for key", key, error);
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    console.error("From Redis cache: failed to parse JSON for key", key, value);
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  if (!isSerializable(value)) {
    return console.error("Non-serializable value provided for key", key, value);
  }

  try {
    if (ttlSeconds === undefined) {
      await redis.set(key, JSON.stringify(value));
    } else {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    }
  } catch (error) {
    console.error("To Redis cache: failed to set for key", key, error);
  }
}

export async function invalidateCache(key: string) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Failed to invalidate cache for key", key, error);
  }
}

