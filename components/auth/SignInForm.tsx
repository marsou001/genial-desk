"use client";

import Link from "next/link";
import { signInAction } from "@/app/actions/auth";
import { AuthActionState } from "@/types/action-states";
import { useActionWithToast } from "@/hooks/useActionWithToast";

export default function SignInForm({ redirectTo }: { redirectTo?: string }) {
  const { state, formAction, isPending } = useActionWithToast<AuthActionState>(
    signInAction,
    { isSuccess: false, error: null, email: "", password: "" },
    "Signed in successfully",
  );

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
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-xs text-blue-400">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isPending || state.isSuccess}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 cursor-pointer disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
