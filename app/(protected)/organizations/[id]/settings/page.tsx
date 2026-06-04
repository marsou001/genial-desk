import { fetchOrganization } from "@/data/organizations";
import { fetchSubscriptionByOrganizationId } from "@/data/subscriptions";
import { fetchPlans } from "@/data/plans";
import OrganizationNameForm from "@/components/interfaces/organizations/settings/OrganizationNameForm";
import OrganizationBilling from "@/components/interfaces/organizations/settings/OrganizationBilling";
import OrganizationDangerZone from "@/components/interfaces/organizations/settings/OrganizationDangerZone";

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
        <p className="text-zinc-600 dark:text-zinc-400">
          Organization not found.
        </p>
      </div>
    );
  }

  const [subscription, plans] = await Promise.all([
    fetchSubscriptionByOrganizationId(organizationId),
    fetchPlans(),
  ]);

  const currentPlan = subscription
    ? (plans.find((p) => p.priceId === subscription.priceId) ?? null)
    : null;

  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          Organization Settings
        </h1>
        <OrganizationNameForm
          organization={{ id: organizationId, name: organization.name }}
        />
        <OrganizationBilling
          organization={organization}
          subscription={subscription}
          plans={plans}
          currentPlan={currentPlan}
        />
        <OrganizationDangerZone
          organization={{ id: organizationId, name: organization.name }}
        />
      </div>
    </div>
  );
}
