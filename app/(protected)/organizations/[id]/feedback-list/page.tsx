import { redirect } from "next/navigation";
import { fetchFeedbacks } from "@/data/fetchFeedbacks";
import { PERIOD_VALUES } from "@/components/common/DropdownPeriodSelection";
import FeedbackList from "@/components/interfaces/organizations/FeedbackList/FeedbackList";

export default async function FeedbackListPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { id: organizationId } = await params;
  const { period } = await searchParams;

  const days = period ? Number(period) : 30;

  if (!period || !PERIOD_VALUES.includes(days)) {
    redirect(`/organizations/${organizationId}/feedback-list?period=30`);
  }

  const feedbacks = await fetchFeedbacks(organizationId, days);
  return <FeedbackList feedbacks={feedbacks} organizationId={organizationId} />;
}
