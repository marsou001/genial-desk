import { createClient } from '@/lib/supabase/server';
import { OrganizationMember } from '@/types';

export async function fetchMembers(organizationId: string): Promise<OrganizationMember[]> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc("get_organization_members", {
      org_id: organizationId
    })
    
    if (error !== null) {
      throw new Error(error.message)
    }

    const members = data.map((m: any) => ({
      ...m,
      fullName: m.full_name,
      avatarUrl: m.avatar_url,
      memberSince: m.created_at,
    }))
    
    return members;
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    throw new Error("Failed to fetch organizations")
  }
}
