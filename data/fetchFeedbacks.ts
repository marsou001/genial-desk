import { createClient } from "@/lib/supabase/server";
import { Feedback } from "@/types/database";

export async function fetchFeedbacks(
  organizationId: string | null,
  projectId?: string | null
): Promise<Feedback[]> {
  try {
    if (!organizationId) {
      return [];
    }

    const supabase = await createClient();
    let query = supabase
      .from('feedbacks')
      .select('*')
      .eq('organization_id', organizationId);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { error, data } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message);
    }

    return data || []
  } catch (error) {
    console.log('Failed to fetch feedbacks: ', error)
    throw new Error('Failed to fetch feedbacks');
  }
}