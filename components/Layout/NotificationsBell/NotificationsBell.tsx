"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { markNotificationRead } from "@/app/actions/notifications";
import { formatRelativeTime } from "@/lib/utils";
import { useIsClickedOutside } from "@/hooks/useIsClickedOutside";
import { NOTIFICATION_LIST_SELECT } from "./NotificationsBell.constants";
import type { NotificationItemState } from "./NotificationsBell.types";
import { mapSupabaseNotificationRow, getNotificationMessage } from "./NotificationsBell.utils";

export default function NotificationsBell({
  userId,
  initialItems,
}: {
  userId: string;
  initialItems: NotificationItemState[];
}) {
  const [items, setItems] = useState<NotificationItemState[]>(initialItems);
  const { containerRef, open, setOpen } = useIsClickedOutside();
  const supabase = useMemo(() => createClient(), []);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.isRead).length,
    [items],
  );

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const refetchOne = useCallback(
    async (id: string) => {
      const { data, error } = await supabase
        .from("notifications")
        .select(NOTIFICATION_LIST_SELECT)
        .eq("id", id)
        .single();
      if (error || !data) return null;
      return mapSupabaseNotificationRow(data);
    },
    [supabase, userId],
  );

  useEffect(() => {
    const channel = supabase
      .channel(`notifications:user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `target_user_id=eq.${userId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new as { id?: string };
            if (typeof row.id !== "string") return;
            const item = await refetchOne(row.id);
            if (item) {
              setItems((prev) => [item, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const row = payload.new as {
              id?: string;
              is_read?: boolean;
              read_at?: string | null;
            };
            if (typeof row.id !== "string") return;
            setItems((prev) =>
              prev.map((n) =>
                n.id === row.id
                  ? {
                      ...n,
                      isRead: Boolean(row.is_read),
                      readAt:
                        row.read_at === null
                          ? null
                          : typeof row.read_at === "string"
                            ? row.read_at
                            : n.readAt,
                    }
                  : n,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            const row = payload.old as { id?: string };
            if (typeof row.id === "string") {
              setItems((prev) => prev.filter((n) => n.id !== row.id));
            }
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, userId, refetchOne]);

  async function handleItemActivate(item: NotificationItemState) {
    if (item.isRead) return;
    const previous = items;
    const readAt = new Date().toISOString();
    setItems((p) =>
      p.map((n) =>
        n.id === item.id ? { ...n, isRead: true, readAt } : n,
      ),
    );
    const res = await markNotificationRead(item.id);
    if (!res.ok) {
      setItems(previous);
      toast.error(res.error ?? "Could not mark notification as read");
    }
  }

  const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="relative rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 cursor-pointer"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="notifications-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white tabular-nums"
            aria-hidden="true"
          >
            {badgeText}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id="notifications-menu"
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 max-h-96 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Notifications
            </p>
          </div>
          <ul className="max-h-80 overflow-y-auto py-1">
            {items.length === 0 ? (
              <li
                className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                role="presentation"
              >
                No notifications yet
              </li>
            ) : (
              items.map((item) => {
                const message = getNotificationMessage(
                  { ...item.payload },
                  userId,
                );
                return (
                  <li key={item.id} role="presentation">
                    <button
                      type="button"
                      role="menuitem"
                      className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/80 ${
                        item.isRead
                          ? "text-zinc-600 dark:text-zinc-400"
                          : "bg-zinc-50/80 font-medium text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-50"
                      }`}
                      onClick={() => void handleItemActivate(item)}
                    >
                      <span className="leading-snug">{message}</span>
                      <span className="text-xs font-normal text-zinc-500 dark:text-zinc-500">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
