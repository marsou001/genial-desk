import { createClient } from '@/lib/supabase/server';
import { OrganizationMember } from '@/types';

export async function fetchMembers(organizationId: string): Promise<OrganizationMember[]> {
  const supabase = await createClient()
  try {
    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select(`
        id,
        created_at,
        role (
          name
        ),
        profiles (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('organization_id', organizationId);

    if (error) {
      throw new Error(error.message)
    }

    const members = (memberships || []).map((m: any) => ({
      id: m.id,
      fullName: m.profiles.full_name,
      email: m.profiles.email,
      avatarUrl: m.profiles?.avatar_url ?? null,
      role: m.role.name.toLowerCase(),
      memberSince: m.created_at,
    }));

    return members;
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    throw new Error("Failed to fetch organizations")
  }
}
