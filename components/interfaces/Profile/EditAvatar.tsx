"use client";

import Image from "next/image";
import { useActionState, useState, ChangeEvent, useEffect } from "react";
import { EditAvatarActionState } from "@/types";
import { updateAvatarAction } from "@/app/actions/profile";
import { toast } from "sonner";

export default function EditAvatar({
  avatarUrl,
  fullName,
  email,
}: {
  avatarUrl: string | null;
  fullName: string | null;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState<
    EditAvatarActionState,
    FormData
  >(updateAvatarAction, {
    isSuccess: false,
    error: null,
    avatarUrl,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const initial = (fullName || email || "?").charAt(0).toUpperCase();

  const displayAvatar = state.avatarUrl ?? avatarUrl;

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      const previewUrl = URL.createObjectURL(image);
      setPreviewUrl(previewUrl);
    }
  }

  useEffect(() => {
    if (isPending) return;
    setPreviewUrl(null);

    if (state.error !== null) {
      toast.error(state.error);
    } else if (state.isSuccess) {
      toast.success("Profile avatar changed successfully");
    }
  }, [isPending, state]);

  return (
    <form
      action={formAction}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-row items-center justify-between gap-4 rounded-lg p-6"
    >
      <label className="relative block w-20 h-20 rounded-full overflow-hidden group cursor-pointer">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview avatar"
            className="block w-full h-full"
          />
        ) : displayAvatar ? (
          <Image
            src={displayAvatar}
            alt="User avatar"
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="rounded-full absolute inset-0 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
            {initial}
          </div>
        )}
        <div className="absolute inset-0 z-20 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-medium text-white">Change</span>
        </div>
        <input
          type="file"
          name="avatar"
          accept=".png,.jpg,.jpeg,.webp"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </label>
      <div>
        <button
          type="submit"
          disabled={previewUrl === null || isPending}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
