"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { OrganizationMember } from "@/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useUserClient } from "@/hooks/useUserClient";
import { removeMember as apiRemoveMember } from "@/lib/api/organizations";

export default function RemoveMember({
  member,
  removeMember: removeMemberFn,
}: {
  member: OrganizationMember;
  removeMember: (id: string) => void;
}) {
  const [canRemoveMember, setCanRemoveMember] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id: organizationId } = useParams();
  const getUser = useUserClient();

  async function remove() {
    const isConfirmed = window.confirm(
      `Remove ${member.email} from this organization? This action cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsDeleting(true);

    try {
      await apiRemoveMember(String(organizationId), member.id);
      toast.info("Membership successfully removed");
      removeMemberFn(member.id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove member",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    async function canRemoveMember() {
      const user = await getUser();
      if (!user) return false;
      const isUser = member.userId === user.id;
      const isOwner = member.role === "owner";
      setCanRemoveMember(!isUser && !isOwner);
    }

    canRemoveMember();
  }, []);
  return (
    <>
      <button
        onClick={remove}
        disabled={isDeleting || !canRemoveMember}
        className="hidden md:inline-block text-sm px-4 py-2 bg-red-600 hover:bg-red-700 cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isDeleting ? "Deleting..." : "Remove"}
      </button>
      <button
        onClick={remove}
        disabled={isDeleting || !canRemoveMember}
        className="md:hidden text-red-600 hover:text-red-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
      >
        {isDeleting ? <LoadingSpinner /> : <Trash size={16} />}
      </button>
    </>
  );
}
