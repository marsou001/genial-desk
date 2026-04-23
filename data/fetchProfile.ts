import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib";
import { ProfileData } from "@/types";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { getCache, setCache } from "@/lib/redis";

export async function fetchProfile(): Promise<ProfileData> {
  const { id } = await getUser();

  const cacheKey = REDIS_KEYS.profile(id);
  const cachedValue = await getCache<ProfileData>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", id)
    .single();

  const profileData: ProfileData = {
    id: id,
    fullName: profile?.full_name ?? null,
    email: profile?.email ?? "",
    avatarUrl: profile?.avatar_url ?? null,
  };

  await setCache(cacheKey, profileData);
  return profileData;
}