import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib';
import { fetchOrganizations } from '@/data/fetchOrganizations';
import OrganizationSwitcher from './OrganizationSwitcher';

export default async function AppHeader() {
  const supabase = await createClient();
  const user = await getUser();
  const organizations = await fetchOrganizations();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single();

  const avatarUrl = profile?.avatar_url ?? null;
  const avatarInitial = (profile?.full_name || profile?.email || '?').charAt(0).toUpperCase();

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
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="relative block w-9 h-9 rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 hover:ring-zinc-400 dark:hover:ring-zinc-500 transition-colors"
            aria-label="Go to profile"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="User avatar"
                fill
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 text-sm font-semibold">
                {avatarInitial}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
