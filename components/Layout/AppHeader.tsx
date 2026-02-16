import Link from 'next/link';
import { signOutAction } from '@/app/actions/auth';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function AppHeader({ breadcrumbs }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/organizations" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            GenialDesk
          </Link>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-zinc-900 dark:text-zinc-50 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
