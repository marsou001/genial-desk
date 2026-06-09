import { fetchOrganization, updateOrganization } from "@/data/organizations";

type UsageCheckResult =
  | { allowed: true }
  | { allowed: false; status: number; error: string };

export async function checkUploadLimits(
  organizationId: string,
): Promise<UsageCheckResult> {
  const organization = await fetchOrganization(organizationId);

  if (organization.remainingUploads < 1 && organization.remainingAIRuns < 1) {
    return {
      allowed: false,
      status: 403,
      error: "You need at least 1 upload and 1 AI run remaining to continue.",
    };
  }

  if (organization.remainingUploads < 1) {
    return {
      allowed: false,
      status: 403,
      error: "You need at least 1 upload remaining to continue.",
    };
  }

  if (organization.remainingAIRuns < 1) {
    return {
      allowed: false,
      status: 403,
      error: "You need at least 1 AI run remaining to continue.",
    };
  }

  return { allowed: true };
}

export async function consumeUploadLimits(organizationId: string) {
  const organization = await fetchOrganization(organizationId);

  await updateOrganization(organizationId, {
    remainingUploads: Math.max(0, organization.remainingUploads - 1),
    remainingAIRuns: Math.max(0, organization.remainingAIRuns - 1),
  });
}

export async function checkInsightsLimits(
  organizationId: string,
): Promise<UsageCheckResult> {
  const organization = await fetchOrganization(organizationId);

  if (organization.remainingAIRuns < 2) {
    return {
      allowed: false,
      status: 403,
      error:
        "Generating insights requires 2 AI runs. You do not have enough remaining.",
    };
  }

  return { allowed: true };
}

export async function consumeInsightsLimits(organizationId: string) {
  const organization = await fetchOrganization(organizationId);

  await updateOrganization(organizationId, {
    remainingAIRuns: Math.max(0, organization.remainingAIRuns - 2),
  });
}
