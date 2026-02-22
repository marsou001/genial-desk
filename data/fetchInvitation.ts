import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { InviteResult } from "@/types";

export async function fetchInvitation(
  inviteToken: string,
): Promise<InviteResult> {
  const tokenHash = crypto.createHash("sha256").update(inviteToken).digest("hex");

  try {
    const supabase = await createClient();
    const { error, data } = await supabase
      .from('invites')
      .select(`
        id,
        expires_at,
        accepted_at,
        organizations (
          name
        ),
        roles (
          name
        )
      `)
      .eq('token_hash', tokenHash)
      .maybeSingle()
  
    if (error) {
      throw new Error(error.message);
    }
  
    if (!data) {
      return { status: "not_found" }
    }
  
    if (new Date() > new Date(data.expires_at)) {
      return { status: "expired" }
    }
    
    if (data.accepted_at !== null) {
      return { status: "accepted" }
    }

    return {
      status: "ok",
      invite: {
        id: data.id,
        organization: data.organizations.name,
        role: data.roles.name,
        expiresAt: data.expires_at,
      }
    };
  } catch (error) {
    console.error('Invites error:', error);
    throw new Error('Failed to fetch invite')
  }
}