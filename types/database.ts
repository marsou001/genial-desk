import { UserRole } from ".";

export interface Feedback {
  id: string;
  text: string;
  source: string;
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  keywords: string[];
  created_at: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  name: string;
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
