import { InviteStatus, UserRole } from ".";

export interface Feedback {
  id: string;
  text: string;
  source: string;
  topic: string;
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  keywords: string[];
  created_at: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  name: string;
  stripe_customer_id: string | null;
  remaining_ai_runs: number;
  remaining_uploads: number;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  price_id: string;
  max_ai_runs: number;
  max_uploads: number;
  max_members: number;
}

export interface Subscription {
  id: string;
  subscription_id: string;
  organization_id: string;
  price_id: string;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: 1 | 2 | 3 | 4;
  created_at: string;
}

export interface Invite {
  id: string;
  organization_id: string;
  email: string;
  role: number;
  status: InviteStatus;
  invited_by: string;
  token_hash: string;
  created_at: string;
  expires_at: string;
  accepted_at: string;
}

export interface Role {
  id: number;
  name: UserRole;
}
