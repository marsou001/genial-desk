'use server';

import { getUser } from '@/lib';
import { createClient } from '@/lib/supabase/server';
import { OrganizationActionState } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createOrganization(_: OrganizationActionState, formData: FormData): Promise<OrganizationActionState> {
  const name = formData.get("name") as string
  const user = await getUser();
  
  if (!user) {
    return { isError: true, error: 'Unauthorized' };
  }

  if (!name || name.trim().length < 2) {
    return { isError: true, error: 'Organization name must be at least 3 characters' };
  }

  try {
    const supabase = await createClient();

    // Create organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: name.trim() })
      .select("id")
      .single();

    if (orgError) {
      return { isError: true, error: orgError.message };
    }

    // Add creator as Owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        user_id: user.id,
        organization_id: organization.id,
        role: 1,
        project_id: null,
      });

    if (memberError) {
      // Rollback organization creation
      await supabase.from('organizations').delete().eq('id', organization.id);
      return { isError: true, error: memberError.message };
    }

    revalidatePath('/organizations');
    return { isError: false, organizationId: organization.id };
  } catch (error) {
    console.error('Error creating organization:', error);
    return { isError: true, error: 'Failed to create organization' };
  }
}
