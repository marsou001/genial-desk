export const REDIS_KEYS = {
  notifications(userId: string) {
    return `${userId}:notifications`
  },
  organizations(userId: string) {
    return `${userId}:organizations`
  },
  organization(orgId: string) {
    return `organization_${orgId}`
  },
  members(orgId: string) {
    return `organization_${orgId}_members`
  },
  stats(orgId: string) {
    return `organization_${orgId}_stats`
  },
  feedbacks(orgId: string) {
    return `organization_${orgId}_feedbacks`
  },
}