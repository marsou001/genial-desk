import { createClient } from '@/lib/supabase/server';
import { OrganizationMember } from '@/types';

export async function fetchMembers(organizationId: number): Promise<OrganizationMember[]> {
  const supabase = await createClient()
  try {
    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select(`
        user_id,
        role (
          name
        ),
        profiles (
          full_name,
          email,
          avatar_url,
          created_at
        )
      `)
      .eq('organization_id', organizationId);

    if (error) {
      throw new Error(error.message)
    }

    const members = (memberships || []).map((m: any) => ({
      id: m.user_id,
      fullName: m.profiles.full_name,
      email: m.profiles.email,
      avatarUrl: m.profiles?.avatar_url ?? null,
      role: m.role.name.toLowerCase(),
      createdAt: m.profiles.created_at,
    }));

    return members;
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    throw new Error("Failed to fetch organizations")
  }
}
