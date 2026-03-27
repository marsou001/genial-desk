"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { signOutAction } from "@/app/actions/auth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function SignOutButton() {
  const [state, formAction, isPending] = useActionState(signOutAction, {
    error: null,
  });

  useEffect(() => {
    if (isPending) return;
    if (state.error !== null) toast.error(state.error);
  }, [isPending, state]);

  return (
    <form action={formAction} className="flex justify-end">
      <button
        type="submit"
        className="text-sm font-medium outline-primary"
        disabled={isPending}
      >
        {isPending ? <LoadingSpinner className="border-zinc-50" /> : "Sign Out"}
      </button>
    </form>
  );
}
