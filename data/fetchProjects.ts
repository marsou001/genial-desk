import { createClient } from '@/lib/supabase/server';
import { Project } from '@/types/database';

export async function fetchProjects(organizationId: string): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data || []) as Project[];
}
