import { createClient } from '@/lib/supabase/server';

export async function fetchProject(projectId: string): Promise<{ id: number; name: string } | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', projectId)
      .single();
  
    if (error) {
      throw new Error(error.message);
    }
    return data as { id: number; name: string };
  } catch (error) {
    console.log("Error fetching project with id", error)
    throw new Error("Error fetching project with id") 
  }
}
