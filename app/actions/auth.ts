'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ErrorActionState, RequestPasswordResetActionState, ResetPasswordActionState } from '@/types';
import { isEmailValid } from '@/lib/utils';

export async function signInAction(_: ErrorActionState, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirect_to') as string | undefined;
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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirect_to') as string | undefined;
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

export async function signOutAction(_: ErrorActionState): Promise<ErrorActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("Error signing out user ==> ", error.message);
    return { error: "Error signing out" }
  }

  revalidatePath('/');
  redirect('/sign-in');
}

export async function requestPasswordResetAction(
  _: RequestPasswordResetActionState,
  formData: FormData,
) {
  const email = formData.get('email') as string;

  if (!email || !isEmailValid(email)) {
    return { isSuccess: false, error: "A valid email is required", email };
  }

  const supabase = await createClient();

  const redirectTo =
    process.env.NEXT_PUBLIC_APP_URL !== undefined
      ? `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
      : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { isSuccess: false, error: error.message, email };
  }

  return { isSuccess: true, error: null, email };
}

export async function resetPasswordAction(
  _: ResetPasswordActionState,
  formData: FormData,
) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (!password || !confirmPassword) {
    return { isSuccess: false, error: 'Password and confirmation are required.', password, confirmPassword };
  }

  if (password !== confirmPassword) {
    return { isSuccess: false, error: 'Passwords do not match.', password, confirmPassword };
  }

  const supabase = await createClient();
  const { error: resetPasswordError } = await supabase.auth.updateUser({
    password,
  });

  if (resetPasswordError) {
    return { isSuccess: false, error: resetPasswordError.message, password, confirmPassword };
  }

  // Ensure any existing session is cleared and send user to sign-in
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/sign-in');
}
