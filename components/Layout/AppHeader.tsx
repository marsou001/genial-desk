import Link from 'next/link';
import { signOutAction } from '@/app/actions/auth';
import { fetchOrganizations } from '@/data/fetchOrganizations';
import OrganizationSwitcher from './OrganizationSwitcher';

export default async function AppHeader() {
  const organizations = await fetchOrganizations();
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/organizations" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            GenialDesk
          </Link>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <OrganizationSwitcher organizations={organizations} />
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
