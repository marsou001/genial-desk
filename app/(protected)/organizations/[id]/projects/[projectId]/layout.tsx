import { redirect } from 'next/navigation';
import { getUser, verifyOrganizationAccess, verifyProjectInOrganization } from '@/lib';
import { fetchOrganization } from '@/data/fetchOrganization';
import { fetchProject } from '@/data/fetchProject';
import AppHeader from '@/components/Layout/AppHeader';
import AppSidebar from '@/components/Layout/AppSidebar';

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

  const [organization, project] = await Promise.all([
    fetchOrganization(organizationId),
    fetchProject(projectId),
  ]);

  if (!organization || !project) {
    redirect(`/organizations/${organizationId}/projects`);
  }

  const sidebarLinks = [
    {
      href: `/organizations/${organizationId}/projects/${projectId}/dashboard`,
      label: 'Dashboard',
      icon: '📊',
    },
    {
      href: `/organizations/${organizationId}/projects/${projectId}/feedback-list`,
      label: 'Feedback',
      icon: '💬',
    },
    {
      href: `/organizations/${organizationId}/projects/${projectId}/insights`,
      label: 'Insights',
      icon: '💡',
    },
    {
      href: `/organizations/${organizationId}/projects/${projectId}/upload`,
      label: 'Upload',
      icon: '📤',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex">
      <AppSidebar links={sidebarLinks} />
      <div className="flex-1 flex flex-col">
        <AppHeader
          breadcrumbs={[
            { label: 'Organizations', href: '/organizations' },
            { label: organization.name, href: `/organizations/${organizationId}/projects` },
            { label: project.name },
          ]}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
