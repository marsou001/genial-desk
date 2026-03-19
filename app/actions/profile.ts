'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib';
import { EditAvatarActionState } from '@/types';
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

