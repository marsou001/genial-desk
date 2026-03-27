"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { signUpAction } from "@/app/actions/auth";
import { ErrorActionState } from "@/types";

export default function SignUpForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState<
    ErrorActionState,
    FormData
  >(signUpAction, { error: null });

  useEffect(() => {
    if (isPending) return;
    if (state.error !== null) {
      toast.error(state.error);
    } else {
      toast.success(
        "The confirmation email has been resent. Check your inbox!",
      );
    }
  }, [isPending, state]);

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo !== undefined && (
        <input type="hidden" name="redirect_to" value={redirectTo} />
      )}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          minLength={6}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isPending ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
