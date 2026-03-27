import Link from "next/link";
import { fetchOrganizations } from "@/data/fetchOrganizations";
import OrganizationSwitcher from "./OrganizationSwitcher";
import UserAvatar from "../common/UserAvatar";
import AppLogo from "../common/AppLogo";

export default async function AppHeader() {
  const organizations = await fetchOrganizations();
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <AppLogo />
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <OrganizationSwitcher organizations={organizations} />
          </div>
        </div>
        <div className="flex items-center gap-3">
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
