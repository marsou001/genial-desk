"use client";

import { useState, SubmitEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import { ProfileData } from "@/types";
import { useIsDirty } from "@/hooks/useIsDirty";
import { updateProfile } from "@/lib/api/profiles";

export default function EditNameForm({ profile }: { profile: ProfileData }) {
  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isDirty, setInitialValue } = useIsDirty(
    profile.fullName ?? "",
    fullName,
  );

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setFullName(e.target.value);
  }

  function validate() {
    setError(null);
    let error: string | null = null;
    const trimmedFullName = fullName.trim();

    if (trimmedFullName.length < 3) {
      error = "Name needs to be at least 3 characters long";
    }

    return error;
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const error = validate();
    if (error !== null) {
      setError(error);
      return;
    }

    setIsEditing(true);

    try {
      await updateProfile(profile.id, fullName);
      setInitialValue(fullName);
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while editing your name",
      );
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
          >
            Name
          </label>
          <input
            id="full_name"
            type="text"
            name="full_name"
            value={fullName}
            onChange={handleNameChange}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 mb-2 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
          {error !== null && (
            <span className="text-red-600 text-sm">{error}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isEditing}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
