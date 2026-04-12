import { createClient } from "@/lib/supabase/server";
import { InviteResult } from "@/types";
import { hashToken } from "@/lib/utils";

export async function fetchInvitation(
  inviteToken: string,
): Promise<InviteResult> {
  const tokenHash = await hashToken(inviteToken);

  try {
    const supabase = await createClient();
    const { error, data } = await supabase
      .from("invites")
      .select(
        `
        id,
        expires_at,
        accepted_at,
        status,
        organizations (
          name
        ),
        roles (
          name
        )
      `,
      )
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return { status: "not_found" };
    }

    if (new Date() > new Date(data.expires_at)) {
      return { status: "expired" };
    }

    if (data.status === "rejected") {
      return { status: "rejected" };
    }

    if (data.status === "accepted" && data.accepted_at !== null) {
      return { status: "accepted" };
    }

    return {
      status: "ok",
      invite: {
        id: data.id,
        organization: data.organizations.name,
        role: data.roles.name,
        expiresAt: data.expires_at,
      },
    };
  } catch (error) {
    console.error("Invites error:", error);
    throw new Error("Failed to fetch invite");
  }
}
