"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { setInvitePasswordAction } from "@/app/actions/auth";
import type { ResetPasswordActionState } from "@/types/action-states";
import { createClient } from "@/lib/supabase/client";
import { useActionWithToast } from "@/hooks/useActionWithToast";
import { useRouter } from "next/navigation";

export default function SetPasswordForm({
  inviteTokenFromUrl,
}: {
  inviteTokenFromUrl: string;
}) {
  const { state, formAction, isPending } =
    useActionWithToast<ResetPasswordActionState>(
      setInvitePasswordAction,
      {
        isSuccess: false,
        error: null,
        password: "",
        confirmPassword: "",
      },
      "Password successfully set",
    );
  const router = useRouter();

  useEffect(() => {
    async function establishSession() {
      const supabase = createClient();
      const { data: _sessionData, error: _sessionError } = await supabase.auth.getSession();
      const isAlreadyAuthenticated = !_sessionError && !!_sessionData;
      
      const hash = window.location.hash.slice(1);
      if (isAlreadyAuthenticated || hash.length === 0) {
        return router.push("/organizations");
      }

      const params = new URLSearchParams(hash);
      const error = params.get("error");

      if (error !== null) {
        toast.error("Email link is invalid or has expired.");
        return;
      }

      const accessToken = params.get("access_token")!;
      const refreshToken = params.get("refresh_token")!;

      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      if (sessionError || !sessionData) {
        toast.error("No active session. Open the link from your invite email.");
      } else {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search,
        );
      }
    }

    establishSession();
  }, []);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="invite_token" value={inviteTokenFromUrl} />

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
          minLength={8}
          defaultValue={state.password}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label
          htmlFor="confirm_password"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Confirm password
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
          autoComplete="new-password"
        />
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        This page only works from the invitation link we emailed you. After you
        set a password, you will continue to accept your organization invite.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 cursor-pointer disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isPending ? "Saving password..." : "Continue"}
      </button>
    </form>
  );
}
