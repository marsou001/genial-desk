import Stripe from "stripe";

export type Stats = {
  total: number;
  bySentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  byTopic: Record<string, number>;
  volumeOverTime: Array<{ date: string; count: number }>;
};

export type Insights = {
  data: null
} | {
  data: string;
  lastGenerated: string;
  period: string;
};

export type Organization = {
  id: string;
  name: string;
  stripeCustomerId: string | null;
  remainingAIRuns: number;
  remainingUploads: number;
  lastResetAt: string | null;
  createdAt: string;
}

export type UserMembership = {
  id: string;
  organization_id: string;
  role: UserRole;
  organization_name: string;
}

export type UserMemberShipView = {
  id: string;
  organizationId: string;
  organizationName: string;
  role: UserRole;
  remainingAIRuns: number;
  remainingUploads: number;
  createdAt: string;
};

export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  fullName: string | null;
  email: string;
  avatarUrl?: string | null;
  memberSince: string;
};

export type InviteResult =
  | { status: "ok"; invite: InviteView }
  | { status: "not_found" }
  | { status: "expired" }
  | { status: "rejected" }
  | { status: "accepted" };

export type InviteView = {
  id: string;
  organization: string;
  role: UserRole;
  expiresAt: string;
};

export type ProfileData = {
  id: string;
  avatarUrl: string | null;
  fullName: string | null;
  email: string;
};

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string | null;
  maxAIRuns: number;
  maxUploads: number;
}

export interface Subscription {
  id: string;
  stripeSubscriptionId: string;
  organizationId: string;
  priceId: string;
  status: Stripe.Subscription.Status;
  createdAt: string;
}

export type UserRole = "owner" | "admin" | "analyst" | "viewer";

export type InviteStatus = "pending" | "sent" | "failed" | "accepted" | "rejected";

// TODO: check if used
export type SearchParams = {
  [key: string]: string;
};
