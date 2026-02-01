export interface Feedback {
  id: string;
  text: string;
  source: string;
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  keywords: string[];
  created_at: string;
  organization_id?: string;
  workspace_id?: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  organization_id: string;
  created_at: string;
}
