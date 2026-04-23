import { getCache, setCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib";
import { NOTIFICATION_LIST_SELECT } from "@/components/Layout/NotificationsBell/NotificationsBell.constants";
import { NotificationItemState } from "@/components/Layout/NotificationsBell/NotificationsBell.types";
import { mapSupabaseNotificationRow } from "@/components/Layout/NotificationsBell/NotificationsBell.utils";

type NotificationsResult = {
  items: NotificationItemState[];
  unreadCount: number;
  userId: string | null;
}

export async function fetchNotifications(
  limit = 50,
): Promise<NotificationsResult> {
  const cacheKey = REDIS_KEYS.notifications();
  const cachedValue = await getCache<NotificationsResult>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  const supabase = await createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from("notifications")
    .select(NOTIFICATION_LIST_SELECT)
    .eq("target_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchNotifications:", error.message);
    return { items: [], unreadCount: 0, userId: user.id };
  }

  console.log("data", data)

  const items = (data ?? [])
    .map((row) => mapSupabaseNotificationRow(row))
    .filter((x): x is NotificationItemState => x !== null);

  const unreadCount = items.filter((n) => !n.isRead).length;
  const notificationsResult = { items, unreadCount, userId: user.id };

  await setCache(cacheKey, notificationsResult);
  return notificationsResult;
}
