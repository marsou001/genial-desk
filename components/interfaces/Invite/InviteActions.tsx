"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { respondToInvite } from "@/lib/api/invites";

export default function InviteActions({
  inviteToken,
}: {
  inviteToken: string;
}) {
  const [isResponding, setIsResponding] = useState(false);
  const [action, setAction] = useState<"accept" | "reject" | null>(null);
  const router = useRouter();

  const isAccepting = isResponding && action === "accept";
  const isRejecting = isResponding && action === "reject";

  async function handleRespondToInvite(shouldAccept: boolean) {
    setIsResponding(true);
    setAction(shouldAccept ? "accept" : "reject");

    try {
      const response = await respondToInvite(inviteToken, shouldAccept);
      const redirect = shouldAccept
        ? `/organizations/${response.organizationId}/dashboard`
        : "/organizations";
      router.push(redirect);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to respond to invite");
    } finally {
      setIsResponding(false);
      setAction(null);
    }
  }

  return (
    <div className="flex max-md:flex-col gap-6 pt-6">
      <button
        onClick={() => handleRespondToInvite(false)}
        disabled={isResponding}
        className="
          w-full h-12
          rounded-2xl
          text-base font-medium
          text-white
          bg-gradient-to-r from-red-500 to-pink-600
          shadow-lg shadow-red-500/20
          transition-all duration-200
          hover:shadow-xl hover:shadow-red-500/30
          hover:-translate-y-0.5
          active:translate-y-0 active:shadow-md
          cursor-pointer
          disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {isRejecting && (
          <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        )}
        {isRejecting ? "Rejecting..." : "Reject Invitation"}
      </button>

      <button
        onClick={() => handleRespondToInvite(true)}
        disabled={isResponding}
        className="
          w-full h-12
          rounded-2xl
          text-base font-medium
          text-white
          bg-gradient-to-r from-indigo-600 to-purple-600
          shadow-lg shadow-indigo-500/20
          transition-all duration-200
          hover:shadow-xl hover:shadow-indigo-500/30
          hover:-translate-y-0.5
          active:translate-y-0 active:shadow-md
          cursor-pointer
          disabled:opacity-60 disabled:cursor-not-allowed
          disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {isAccepting && (
          <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        )}
        {isAccepting ? "Accepting..." : "Accept Invitation"}
      </button>
    </div>
  );
}