import { redirect } from 'next/navigation';
import { getUser, verifyOrganizationAccess } from '@/lib';
import { fetchOrganization } from '@/data/fetchOrganization';
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
  const hasAccess = await verifyOrganizationAccess(user.id, Number(organizationId));
  if (!hasAccess) {
    // TODO: toast error
    redirect('/organizations');
  }
  
  const organization = await fetchOrganization(organizationId);
  if (!organization) {
    // TODO: toast error
    redirect('/organizations');
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
