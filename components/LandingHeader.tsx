import Link from "next/link";
import UserAvatar from "./common/UserAvatar";
import AppLogo from "./common/AppLogo";

export default function LandingHeader({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <AppLogo />
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              href="/organizations"
              className="px-4 py-2 text-zinc-900 dark:text-white text-sm font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Organizations
            </Link>
            <Link
              href="/profile"
              className="relative block w-9 h-9 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700 hover:ring-blue-600 transition-all"
            >
              <UserAvatar />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
