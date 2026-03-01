'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib';
import { EditAvatarActionState, EditProfileActionState } from '@/types';
import { getRandomPrefix, prepareFileName } from '@/lib/utils';

export async function updateAvatarAction(
  _: EditAvatarActionState, formData: FormData
): Promise<EditAvatarActionState> {
  const avatarFile = formData.get("avatar") as File;
  const supabase = await createClient();
  
  const { id } = await getUser()
  const prefix = getRandomPrefix()
  const fileName = prepareFileName(avatarFile.name)
  const path = id + "/" + prefix + "-" + fileName

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, avatarFile)

  if (error) {
    console.log("Upload failed", error.message)
    return { isSuccess: false, error: "Upload failed", avatarUrl: null }
  }

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(path)

  return { isSuccess: true, error: null, avatarUrl: publicUrl }
}

export async function updateProfileAction(
  _: EditProfileActionState, formData: FormData
): Promise<EditProfileActionState> {
  const supabase = await createClient();
  const user = await getUser();

  const fullName = (formData.get('name') as string | null)?.trim() ?? null;
  const email = (formData.get('email') as string | null)?.trim() ?? null;
  const password = (formData.get('password') as string | null)?.trim() ?? null;

  // Update profile row
  const { error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
    })
    .eq('id', user.id);

  if (updateProfileError) {
    console.log(updateProfileError.message)
    return { error: "Failed to update profile", fullName, email, password }
  }

  // Update auth user for email/password if provided
  if (email || password) {
    const { error: updateUserError } = await supabase.auth.updateUser({
      email: email || undefined,
      password: password || undefined,
    });

    if (updateUserError) {
      console.log(updateUserError.message)
      return { error: "Failed to update user", fullName, email, password }
    }
  }

  revalidatePath('/profile');
  return { error: null, fullName, email, password }
}

export async function leaveOrganizationAction(formData: FormData) {
  const supabase = await createClient();
  const user = await getUser();
  const organizationId = formData.get('organization_id') as string;

  if (!organizationId) return;

  await supabase
    .from('organization_members')
    .delete()
    .eq('user_id', user.id)
    .eq('organization_id', organizationId);

  revalidatePath('/profile');
}

