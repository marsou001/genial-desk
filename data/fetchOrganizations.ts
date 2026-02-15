import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib';
import { OrganizationView } from '@/types';

export async function fetchOrganizations(): Promise<OrganizationView[]> {
  const supabase = await createClient()
  const user = await getUser()

  try {
    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select(`
        organization_id,
        role,
        organizations!inner (
          id,
          name,
          created_at
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message)
    }

    const organizations = (memberships || []).map((m: any) => ({
      id: m.organization_id,
      name: m.organizations.name,
      role: m.role,
      created_at: m.organizations.created_at,
    }));

    return organizations;
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    throw new Error("Failed to fetch organizations")
  }
}
