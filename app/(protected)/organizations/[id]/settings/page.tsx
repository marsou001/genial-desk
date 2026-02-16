import { fetchOrganization } from '@/data/fetchOrganization';
import OrganizationSettings from '@/components/interfaces/organizations/OrganizationSettings';

export default async function OrganizationSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: organizationId } = await params;
  const organization = await fetchOrganization(organizationId);

  if (!organization) {
    return (
      <div className="p-8">
        <p className="text-zinc-600 dark:text-zinc-400">Organization not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          Organization Settings
        </h1>
        <OrganizationSettings organization={organization} />
      </div>
    </div>
  );
}
