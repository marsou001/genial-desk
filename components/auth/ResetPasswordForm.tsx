"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { resetPasswordAction } from "@/app/actions/auth";
import type { ResetPasswordActionState } from "@/types";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ResetPasswordActionState,
    FormData
  >(resetPasswordAction, {
    isSuccess: false,
    error: null,
    password: "",
    confirmPassword: "",
  });
  const params = useSearchParams();

  const supabase = createClient();

  useEffect(() => {
    const code = params.get("code");
    if (code === null) {
      toast.error("No verification code is available");
      return;
    }

    async function startAuthSession(code: string) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.log(error.message);
      }
    }

    startAuthSession(code);
  }, [params]);

  useEffect(() => {
    if (isPending) return;
    if (state.error !== null) {
      toast.error(state.error);
    } else if (state.isSuccess) {
      toast.info("Your password has been successfully changed");
    }
  }, [isPending, state]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          New password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          minLength={8}
          defaultValue={state.password}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label
          htmlFor="confirm_password"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Confirm new password
        </label>
        <input
          id="confirm_password"
          type="password"
          name="confirm_password"
          required
          minLength={8}
          defaultValue={state.confirmPassword}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        This page only works from the password reset link we emailed you. If the
        link has expired, request a new one from the sign-in page.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isPending ? "Updating password..." : "Update password"}
      </button>
    </form>
  );
}
