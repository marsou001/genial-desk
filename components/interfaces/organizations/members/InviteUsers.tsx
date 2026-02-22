"use client"

import { useState } from "react";
import InviteMemberDialog from "./InviteMemberDialog";

export default function InviteUsers() {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowInviteDialog(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Invite Users
      </button>

      {showInviteDialog && <InviteMemberDialog handleClose={() => setShowInviteDialog(false)} />}
    </>
  )
}