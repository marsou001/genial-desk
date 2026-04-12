import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { hashToken } from "@/lib/utils";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { invite_token: inviteToken, should_accept: shouldAccept } = body;
  const hashedToken = await hashToken(inviteToken);
  const supabase = await createClient();

  if (!shouldAccept) {
    const { error } = await supabase
      .from("invites")
      .update({ status: "rejected" })
      .eq("token_hash", hashedToken)

    if (error) {
      console.log("Error rejecting invite", error.message);
      return NextResponse.json(
        { error: "Error rejecting invite" },
        { status: 500 },
      );
    } 
    
    return NextResponse.json(
      { message: "Invite rejected" },
      { status: 200 },
    );
  }
  
  const now = new Date();
  const acceptedAt = now.toISOString();

  const { data, error } = await supabase
    .from("invites")
    .update({ accepted_at: acceptedAt, status: "accepted" })
    .eq("token_hash", hashedToken)
    .select()
    .single();

  if (error) {
    console.log("Error accepting invite", error.message);
    return NextResponse.json(
      { error: "Error accepting invite" },
      { status: 500 },
    );
  }

  revalidatePath("/organizations");
  return NextResponse.json(
    { organizationId: data.organization_id },
    { status: 200 },
  );
}
