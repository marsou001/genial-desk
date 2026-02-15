'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getUser, verifyOrganizationAccess } from '@/lib';
import { ErrorActionState } from '@/types';

export async function createProject(
  _: ErrorActionState,
  formData: FormData
): Promise<ErrorActionState> {
  const name = (formData.get('name') as string)?.trim();
  const organizationId = formData.get('organization_id') as string;

  const user = await getUser();

  const hasAccess = await verifyOrganizationAccess(user.id, organizationId);
  if (!hasAccess) {
    return { error: 'You do not have access to this organization' };
  }

  if (!name || name.length < 3) {
    return { error: 'Project name must be at least 3 characters' };
  }

  try {
    const supabase = await createClient();
    const { data: project, error } = await supabase
      .from('projects')
      .insert({ name, organization_id: organizationId })
      .select('id')
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath(`/organizations/${organizationId}/projects`);
    redirect(`/organizations/${organizationId}/projects/${project.id}/dashboard`);
  } catch (err) {
    if (err && typeof (err as any).message === 'string' && (err as any).message.includes('NEXT_REDIRECT')) {
      throw err;
    }
    console.error('Error creating project:', err);
    return { error: 'Failed to create project' };
  }
}
