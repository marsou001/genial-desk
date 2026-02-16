'use server';

import { getUser } from '@/lib';
import { createClient } from '@/lib/supabase/server';
import { ErrorActionState } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createOrganization(_: ErrorActionState, formData: FormData): Promise<ErrorActionState> {
  const name = formData.get("name") as string
  const user = await getUser();
  
  if (!user) {
    return { error: 'Unauthorized' };
  }

  if (!name || name.trim().length < 2) {
    return { error: 'Organization name must be at least 3 characters' };
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
      return { error: orgError.message };
    }

    // Add creator as Owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        user_id: user.id,
        organization_id: organization.id,
        role: 1,
      });

    if (memberError) {
      // Rollback organization creation
      await supabase.from('organizations').delete().eq('id', organization.id);
      return { error: memberError.message };
    }

    revalidatePath('/organizations');
    redirect(`/organizations/${organization.id}/dashboard`)
  } catch (error) {
    console.error('Error creating organization:', error);
    return { error: 'Failed to create organization' };
  }
}

export async function updateOrganization(_: ErrorActionState, formData: FormData): Promise<ErrorActionState> {
  const name = (formData.get('name') as string)?.trim();
  const organizationId = formData.get('organization_id') as string;

  if (!name || name.length < 3) {
    return { error: 'Organization name must be at least 3 characters' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('organizations')
      .update({ name })
      .eq('id', organizationId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath(`/organizations/${organizationId}/settings`);
    revalidatePath(`/organizations/${organizationId}`);
    return { error: null };
  } catch (error) {
    console.error('Error updating organization:', error);
    return { error: 'Failed to update organization' };
  }
}
