import Link from "next/link";
import { fetchNotifications } from "@/data/fetchNotifications";
import { fetchUserMemberships } from "@/data/memberships";
import AppLogo from "../common/AppLogo";
import UserAvatar from "../common/UserAvatar";
import OrganizationSwitcher from "./OrganizationSwitcher";
import OrgUsageBadge from "./OrgUsageBadge";
import NotificationsBell from "./NotificationsBell/NotificationsBell";

export default async function AppHeader() {
  const [userMemberships, notifications] = await Promise.all([
    fetchUserMemberships(),
    fetchNotifications(),
  ]);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="h-16 flex items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-3">
          <AppLogo />
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <OrganizationSwitcher userMemberships={userMemberships} />
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <OrgUsageBadge />
          {notifications.userId ? (
            <NotificationsBell
              userId={notifications.userId}
              initialItems={notifications.items}
            />
          ) : null}
          <Link
            href="/profile"
            className="relative block w-9 h-9 rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 hover:ring-zinc-400 dark:hover:ring-zinc-500 transition-colors"
            aria-label="Go to profile"
          >
            <UserAvatar />
          </Link>
        </div>
      </div>
    </header>
  );
}
