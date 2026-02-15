import { redirect } from 'next/navigation';
import { getUser, verifyOrganizationAccess } from '@/lib';

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
  return <>{children}</>;
}
