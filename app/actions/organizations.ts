'use server';

import { getUser } from '@/lib';
import { createClient } from '@/lib/supabase/server';
import { ErrorActionState } from '@/types';
import { assertIsError } from '@/types/typeguards';
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
    assertIsError(error)
    if (error.message === "NEXT_REDIRECT") throw error
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

export async function inviteMember(_: ErrorActionState, formData: FormData): Promise<ErrorActionState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const organizationId = formData.get('organization_id') as string;
  const role = (formData.get('role') as string) || 'viewer';

  if (!email || !email.includes('@')) {
    return { error: 'Valid email is required' };
  }

  if (!organizationId) {
    return { error: 'Organization ID is required' };
  }

  const validRoles = ['owner', 'admin', 'analyst', 'viewer'];
  if (!validRoles.includes(role)) {
    return { error: 'Invalid role' };
  }

  try {
    const user = await getUser();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Verify user has access to this organization
    const { data: userMembership, error: membershipError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .single();

    if (membershipError || !userMembership) {
      return { error: 'Organization not found or access denied' };
    }

    // Find user by email - try through organization_members join first
    // This works if the user is already a member of any organization
    const { data: existingMember, error: memberError } = await supabase
      .from('organization_members')
      .select(`
        user_id,
        user:"auth.users"!inner (
          id,
          email
        )
      `)
      .eq('user.email', email)
      .limit(1)
      .maybeSingle();

    let targetUserId: string | null = null;

    if (!memberError && existingMember) {
      targetUserId = existingMember.user_id;
    } else {
      // Try RPC function if it exists (may not be available)
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_user_by_email', { user_email: email })
          .maybeSingle();

        if (!rpcError && rpcData) {
          const userData = rpcData as any;
          if (userData?.id) {
            targetUserId = userData.id;
          }
        }
      } catch {
        // RPC function may not exist, ignore
      }
    }

    if (!targetUserId) {
      return { error: 'User with this email not found. Please ensure the user has signed up first.' };
    }

    // Check if user is already a member of this organization
    const { data: existing } = await supabase
      .from('organization_members')
      .select('id')
      .eq('user_id', targetUserId)
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (existing) {
      return { error: 'User is already a member of this organization' };
    }

    // Get role ID from role name
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role)
      .single();

    if (roleError || !roleData) {
      return { error: 'Invalid role' };
    }

    // Add member
    const { error: insertError } = await supabase
      .from('organization_members')
      .insert({
        user_id: targetUserId,
        organization_id: parseInt(organizationId),
        role: roleData.id,
      });

    if (insertError) {
      return { error: insertError.message };
    }

    revalidatePath(`/organizations/${organizationId}/members`);
    return { error: null };
  } catch (error) {
    assertIsError(error);
    console.error('Error inviting member:', error);
    return { error: 'Failed to invite member' };
  }
}
