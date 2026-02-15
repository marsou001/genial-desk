
export type UserRole = 'owner' | 'admin' | 'analyst' | 'viewer';

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
  project_id: number | null;
  role: UserRole;
  organization_name: string;
  project_name: string | null;
}

export type OrganizationView = {
  id: number;
  name: string;
  role: string;
  created_at: string;
}

export type AuthActionState = {
  error: string | null;
}

export type OrganizationActionState = {
  isError: false
  error: null
  organizationId: null
} | {
  isError: true
  error: string
} | {
  isError: false
  organizationId: number
}