"use client";

import { requestPasswordResetAction } from "@/app/actions/auth";
import type { RequestPasswordResetActionState } from "@/types/action-states";
import { useActionWithToast } from "@/hooks/useActionWithToast";

export default function ForgotPasswordForm() {
  const { state, formAction, isPending } =
    useActionWithToast<RequestPasswordResetActionState>(
      requestPasswordResetAction,
      { isSuccess: false, email: "", error: null },
      "An email with the password reset link has been sent. Check your inbox!",
    );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          defaultValue={state.email}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="you@example.com"
        />
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          We'll send you a secure link to reset your password.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isPending ? "Sending link..." : "Send reset link"}
      </button>
    </form>
  );
}
