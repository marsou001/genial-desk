'use server';

import crypto from "crypto";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib';
import { authGuard } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { isEmailValid } from '@/lib/utils';
import { ErrorActionState, InviteMemberActionState, UserRole } from '@/types';
import { assertIsError } from '@/types/typeguards';
import { sendInviteMemberEmail } from "@/lib/emails";

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

export async function inviteMember(_: InviteMemberActionState, formData: FormData): Promise<InviteMemberActionState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const organizationId = formData.get('organization_id') as string;
  const role = (formData.get('role') as UserRole) || 'viewer';

  if (!email || !isEmailValid(email)) {
    return { error: 'Valid email is required', email, role };
  }

  if (!organizationId) {
    return { error: 'Organization ID is required', email, role };
  }

  const validRoles = ['owner', 'admin', 'analyst', 'viewer'];
  if (!validRoles.includes(role)) {
    return { error: 'Invalid role', email, role };
  }

  const guard = await authGuard(Number(organizationId), {
    requirePermission: 'org:members:invite',
  })

  if (!guard.success) {
    return { error: (await guard.response.json()).error, email, role }
  }

  try {
    const supabase = await createClient();

    // Find user by email - try through organization_members join first
    // This works if the user is already a member of any organization
    const { data: existingMember, error: memberError } = await supabase
      .from('organization_members')
      .select(`
        user_id,
        profiles!inner (
          email
        )
      `)
      .eq('profiles.email', email)
      .eq('organization_id', organizationId)
      .limit(1)
      .maybeSingle();

    if (!memberError && existingMember) {
      return ({ 
        error: `User with email ${existingMember.profiles.email} is already a member of your organization`,
        email,
        role,
      })
    }

    // Get role ID from role name
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role)
      .single();

    if (roleError || !roleData) {
      return { error: 'Invalid role', email, role };
    }
    
    const user = await getUser();
    const userId = user.id;
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(inviteToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    
    const { error: inviteError } = await supabase
      .from('invites')
      .insert({
        // organizationId,
        organization_id: organizationId,
        email,
        role: roleData.id,
        invited_by: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      })

    if (inviteError) {
      console.log(inviteError.message)
      return { error: 'Failed to create invite', email, role };
    }
     
    // Get organization's name
    const { data: organizationData, error: organizationError } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single()

    if (organizationError) {
      console.log(organizationError.message)
      return { error: 'Failed to fetch organization', email, role };
    }

    const { error: sendEmailError } = await sendInviteMemberEmail(email, organizationData.name, role, inviteToken);
    
    if (sendEmailError) {
      console.log("Failed to send invite", sendEmailError.message)
      return { error: "Failed to send invite", email, role }
    }

    return { error: null, email: "", role }
  } catch (error) {
    assertIsError(error);
    console.error('Error inviting member:', error);
    return { error: 'Failed to invite member', email, role };
  }
}
