export type Stats = {
  total: number;
  bySentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  byTopic: Record<string, number>;
  volumeOverTime: Array<{ date: string; count: number }>;
}

export type Insights = {
  data: string;
  count: number;
  period: string;
}

export interface UserMembership {
  id: string;
  organization_id: string;
  role: UserRole;
  organization_name: string;
}

export type OrganizationView = {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export type OrganizationMember = {
  id: string;
  role: UserRole;
  fullName: string | null;
  email: string;
  avatarUrl?: string | null;
  memberSince: string;
}

export type InviteResult = 
  | { status: "ok"; invite: InviteView }
  | { status: "not_found" }
  | { status: "expired" }
  | { status: "accepted" }

export type InviteView = {
  id: string;
  organization: string;
  role: UserRole;
  expiresAt: string;
}

export type ProfileData = {
  id: string;
  avatarUrl: string | null;
  fullName: string | null;
  email: string;
};

export type ErrorActionState = {
  error: string | null;
}

export type RequestPasswordResetActionState = {
  isSuccess: boolean;
  error: string | null;
  email: string;
}

export type ResetPasswordActionState = {
  isSuccess: boolean;
  error: string | null;
  password: string;
  confirmPassword: string;
}

export type CreateOrganizationrActionState = {
  error: string | null;
  name: string;
}

export type InviteMemberActionState = {
  isSuccess: boolean;
  error: string | null;
  email: string;
  role: Exclude<UserRole, "owner">;
}

export type EditAvatarActionState = {
  isSuccess: boolean;
  error: string | null;
  avatarUrl: string | null;
}

export type UserRole = 'owner' | 'admin' | 'analyst' | 'viewer';

// TODO: check if used
export type SearchParams = {
  [key: string]: string
}