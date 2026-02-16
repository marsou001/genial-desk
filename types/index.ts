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
  organization_id: number;
  role: UserRole;
  organization_name: string;
}

export type OrganizationView = {
  id: number;
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
  createdAt: string;
}

export type ErrorActionState = {
  error: string | null;
}

export type UserRole = 'owner' | 'admin' | 'analyst' | 'viewer';