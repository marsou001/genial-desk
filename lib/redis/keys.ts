export const REDIS_KEYS = {
  notifications(userId: string) {
    return `${userId}:notifications`
  },
  organizations(userId: string) {
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