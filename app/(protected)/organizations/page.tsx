import { fetchOrganizations } from '@/data/fetchOrganizations';
import OrganizationsList from '@/components/interfaces/organizations/OrganizationsList';

export default async function OrganizationsPage() {
  const organizations = await fetchOrganizations();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Your organizations
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Select an organization to get started, or create a new one.
        </p>
      </div>
      <OrganizationsList organizations={organizations} />
    </div>
  );
}
