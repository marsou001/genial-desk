"use client";

import { resetPasswordAction } from "@/app/actions/auth";
import type { ResetPasswordActionState } from "@/types/action-states";
import { useActionWithToast } from "@/hooks/useActionWithToast";

export default function ResetPasswordForm() {
  const { state, formAction, isPending } =
    useActionWithToast<ResetPasswordActionState>(
      resetPasswordAction,
      {
        isSuccess: false,
        error: null,
        password: "",
        confirmPassword: "",
      },
      "Your password has been successfully changed",
    );

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
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 cursor-pointer disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isPending ? "Updating password..." : "Update password"}
      </button>
    </form>
  );
}
