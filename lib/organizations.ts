import { createClient } from "./supabase/server";

/**
 * Verify user has access to an organization
 */
export async function verifyOrganizationAccess(
  userId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organization_members')
      .select('id')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}