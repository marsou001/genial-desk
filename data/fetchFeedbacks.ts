import { createServerClient } from "@/lib/supabase";
import { Feedback } from "@/types/database";

export async function fetchFeedbacks(): Promise<Feedback[]> {
  try {
    const supabase = createServerClient();
    const { error, data } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message);
    }

    return data
  } catch (error) {
    console.log('Failed to fetch feedbacks: ', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch feedbacks');
  }
}