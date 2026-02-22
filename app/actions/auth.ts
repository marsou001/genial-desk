'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ErrorActionState } from '@/types';

export async function signInAction(_: ErrorActionState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect_to") as string | undefined
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/');
  redirect(redirectTo ?? '/organizations');
}

export async function signUpAction(_: ErrorActionState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect_to") as string | undefined
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined, // No email verification for now
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/');
  redirect(redirectTo ?? '/organizations');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  revalidatePath('/');
  redirect('/sign-in');
}
