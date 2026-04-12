"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib";

export async function markNotificationRead(
  notificationId: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await getUser();

  const supabase = await createClient();
  const readAt = new Date().toISOString();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, read_at: readAt })
    .eq("id", notificationId)
    .eq("target_user_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
