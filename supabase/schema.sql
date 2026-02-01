-- GenialDesk Database Schema
-- Run this in your Supabase SQL Editor

-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  source VARCHAR(255) NOT NULL DEFAULT 'CSV Upload',
  topic VARCHAR(100) NOT NULL,
  sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  summary TEXT,
  keywords TEXT[] DEFAULT '{}',
  organization_id UUID,
  workspace_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_topic ON feedbacks(topic);
CREATE INDEX IF NOT EXISTS idx_feedbacks_sentiment ON feedbacks(sentiment);
CREATE INDEX IF NOT EXISTS idx_feedbacks_organization ON feedbacks(organization_id);

-- Enable Row Level Security (RLS)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (for MVP)
-- In production, you'd want to restrict based on organization_id
CREATE POLICY "Allow all operations for MVP" ON feedbacks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create organizations table (for future multi-tenancy)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
