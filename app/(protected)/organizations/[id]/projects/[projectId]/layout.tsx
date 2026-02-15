import { redirect } from 'next/navigation';
import { getUser, verifyOrganizationAccess } from '@/lib';
import { verifyProjectInOrganization } from '@/lib/organizations';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id: organizationId, projectId } = await params;
  const user = await getUser();
  const hasOrgAccess = await verifyOrganizationAccess(user.id, organizationId);
  if (!hasOrgAccess) {
    redirect('/organizations');
  }
  const projectInOrg = await verifyProjectInOrganization(organizationId, projectId);
  if (!projectInOrg) {
    redirect(`/organizations/${organizationId}/projects`);
  }
  return <>{children}</>;
}
