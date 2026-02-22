import { UserRole } from ".";

export interface Feedback {
  id: number;
  text: string;
  source: string;
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  keywords: string[];
  created_at: string;
  organization_id: number;
}

export interface Organization {
  id: number;
  name: string;
  created_at: string;
}

export interface OrganizationMember {
  id: number;
  user_id: string;
  organization_id: number;
  role: 1 | 2 | 3 | 4;
  created_at: string;
}

export interface Invite {
  id: number;
  organization_id: number;
  email: string;
  role: Role["name"];
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
