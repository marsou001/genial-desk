"use client"

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Trash } from "lucide-react"
import { useParams } from "next/navigation";
import { useState } from "react"

export default function RemoveMember({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { id: organizationId } = useParams()

  async function remove() {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/organizations/${organizationId}/members`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        const errorBody = await response.json()
        // TODO: toast
        alert(errorBody.error)
        console.log(errorBody.error)
      }
    } catch {
      // TODO: toast
      alert("Failed to invite member")
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <>
      <button
        onClick={remove}
        disabled={isDeleting}
        className="hidden md:inline-block text-sm px-4 py-2 bg-red-600 hover:bg-red-700 cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isDeleting ? "Deleting..." : "Remove"}
      </button>
      <button
        onClick={remove}
        disabled={isDeleting}
        className="md:hidden text-red-600 hover:text-red-700 disabled:bg-zinc-400 disabled:cursor-not-allowed"
      >
        {isDeleting ? <LoadingSpinner /> : <Trash size={16} />}
      </button>
    </>
  )
}