export interface Feedback {
  id: number;
  text: string;
  source: string;
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  keywords: string[];
  created_at: string;
  organization_id?: string;
  project_id?: string;
}

export interface Organization {
  id: number;
  name: string;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  organization_id: string;
  created_at: string;
}
