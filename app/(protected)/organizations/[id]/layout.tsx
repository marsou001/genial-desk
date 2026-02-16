import { redirect } from 'next/navigation';
import { getUser, verifyOrganizationAccess } from '@/lib';
import { fetchOrganization } from '@/data/fetchOrganization';
import AppHeader from '@/components/Layout/AppHeader';
import AppSidebar from '@/components/Layout/AppSidebar';

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: organizationId } = await params;
  const user = await getUser();
  const hasAccess = await verifyOrganizationAccess(user.id, organizationId);
  if (!hasAccess) {
    redirect('/organizations');
  }

  const organization = await fetchOrganization(organizationId);
  if (!organization) {
    redirect('/organizations');
  }

  const sidebarLinks = [
    {
      href: `/organizations/${organizationId}/dashboard`,
      label: 'Dashboard',
      icon: '📊',
    },
    {
      href: `/organizations/${organizationId}/upload`,
      label: 'Upload',
      icon: '📊',
    },
    {
      href: `/organizations/${organizationId}/feedback-list`,
      label: 'Feedbacks',
      icon: '📊',
    },
    {
      href: `/organizations/${organizationId}/insights`,
      label: 'Insights',
      icon: '📊',
    },
    {
      href: `/organizations/${organizationId}/settings`,
      label: 'Settings',
      icon: '⚙️',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex">
      <AppSidebar links={sidebarLinks} />
      <div className="flex-1 flex flex-col">
        <AppHeader
          breadcrumbs={[
            { label: 'Organizations', href: '/organizations' },
            { label: organization.name },
          ]}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
