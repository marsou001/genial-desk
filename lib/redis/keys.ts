export const REDIS_KEYS = {
  profile(userId: string) {
    return `${userId}:profile`
  },
  notifications(userId: string) {
    return `${userId}:notifications`
  },
  userMemberships(userId: string) {
    return `${userId}:memberships`
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
  plans() {
    return "plans"
  },
  plan(priceId: string | null) {
    return `plan_${priceId}`
  }
}