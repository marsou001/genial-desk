import { createClient } from '@/lib/supabase/server';

export async function fetchOrganization(organizationId: string): Promise<{ id: number; name: string } | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', organizationId)
      .single();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data as { id: number; name: string };
  } catch (error) {
    console.log("Error fetching organization with id", error)
    throw new Error("Error fetching organization with id")    
  }
}
