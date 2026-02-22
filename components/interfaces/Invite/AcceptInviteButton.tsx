"use client"

import { useRouter } from "next/navigation";
import { useState } from "react"

export default function AcceptInviteButton({ inviteToken }: { inviteToken: string }) {
  const [isAccepting, setIsAccepting] = useState(false);
  const router = useRouter()

  async function acceptInvite() {
    setIsAccepting(true)
    const response = await fetch(`/api/invites`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invite_token: inviteToken
      })
    })

    const responseObject = await response.json()
    if (!response.ok) {
      // TODO: toast
      alert(responseObject.error)
      console.log(responseObject)
    } else {
      router.push("/organizations/" + responseObject.organizationId + "/dashboard")
    }
    setIsAccepting(false)
  }

  return (
    <div className="pt-6">
      <button
        onClick={acceptInvite}
        disabled={isAccepting}
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
          disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {isAccepting && (
          <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        )}
        {isAccepting ? "Accepting..." : "Accept Invitation"}
      </button>
    </div>
  )
}