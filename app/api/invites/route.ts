import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const inviteToken = body.invite_token;
  const hashedToken = crypto.createHash("sha256").update(inviteToken).digest("hex");

  const now = new Date()
  const acceptedAt = now.toISOString()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invites")
    .update({"accepted_at": acceptedAt})
    .eq("token_hash", hashedToken)
    .select()
    .single()

  if (error) {
    console.log("Error accepting invite", error.message)
    return NextResponse.json({ error: "Error accepting invite" }, { status: 500 })
  }

  revalidatePath("/organizations")
  return NextResponse.json({ organizationId: data.organization_id }, { status: 200 })
  redirect("/organizations/" + data.organization_id + "/dashboard")
}