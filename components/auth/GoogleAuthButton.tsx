import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function GoogleAuthButton() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const params = useSearchParams();
  const redirectTo = params.get("redirect_to");

  async function authenticate() {
    setIsGoogleLoading(true);
    const supabase = createClient()
    const _redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google${redirectTo !== null ? "?redirect_to=" + redirectTo : ""}`;
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: _redirectTo },
      })
      if (error) toast.error(error.message);
    } catch {
      toast.error("Something went wrong while trying to authenticate with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const error = params.get("error");
    if (error !== null) {
      toast.error("Access denied");
    }
  }, []);

  return (
    <button
      type="button"
      disabled={isGoogleLoading}
      onClick={authenticate}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-500 dark:disabled:text-zinc-400 disabled:border-zinc-300 dark:disabled:border-zinc-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
      aria-label="Continue with Google"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.209 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.054 6.053 29.277 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.054 6.053 29.277 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.176 0 9.86-1.977 13.409-5.191l-6.19-5.238C29.144 35.091 26.671 36 24 36c-5.188 0-9.624-3.33-11.284-7.946l-6.521 5.025C9.504 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-.791 2.237-2.231 4.166-4.084 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      Continue with Google
    </button>
  );
}
