'use client';

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import OrganizationSelector from "./OrganizationSelector";
import ProjectSelector from "./ProjectSelector";
import { signOutAction } from "@/app/actions/auth";

const getTabs = (organizationId: string, projectId: string) => [
  { href: `/organizations/${organizationId}/projects/${projectId}/dashboard`, label: 'Dashboard' },
  { href: `/organizations/${organizationId}/projects/${projectId}/upload`, label: 'Upload' },
  { href: `/organizations/${organizationId}/projects/${projectId}/feedback-list`, label: 'Feedback' },
  { href: `/organizations/${organizationId}/projects/${projectId}/insights`, label: 'Weekly Insights' },
];

export default function NavHeader() {
  const pathname = usePathname();
  const params = useParams();
  const organizationId = params?.id as string | undefined;
  const projectId = params?.projectId as string | undefined;

  const isOrgRoute = pathname?.startsWith('/organizations/') && organizationId;
  const isProjectRoute = isOrgRoute && !!projectId;
  const tabs = isProjectRoute ? getTabs(organizationId!, projectId!) : [];

  const handleSignOut = async () => {
    await signOutAction();
  };

  if (!isOrgRoute) {
    return null;
  }

  // Projects list page: minimal header (no tabs, no project selector)
  if (!projectId) {
    return (
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/organizations" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                GenialDesk
              </Link>
              <OrganizationSelector />
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href={`/organizations/${organizationId}/projects/${projectId}/dashboard`}>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                GenialDesk
              </h1>
            </Link>
            <div className="flex items-center gap-3">
              <OrganizationSelector />
              <ProjectSelector />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex space-x-1">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50'
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
