import { getUser } from "..";

const { id: userId } = await getUser();

export const REDIS_KEYS = {
  notifications() {
    return `${userId}:notifications`
  },
  organizations() {
    return `${userId}:organizations`
  },
  organization(orgId: string) {
    return `organization-${orgId}`
  },
  members(orgId: string) {
    return `organization-${orgId}-members`
  },
  stats(orgId: string) {
    return `organization-${orgId}-stats`
  },
  feedbacks(orgId: string) {
    return `organization-${orgId}-feedbacks`
  },
}