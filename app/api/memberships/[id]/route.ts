import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const reqHeaders = await headers();
  const role = reqHeaders.get("x-membership-role");

  if (role === "owner") {
    return NextResponse.json(
      { error: "Can't leave an organization you're the owner of" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("Failed to remove member", error.message);
    return NextResponse.json(
      { error: "Failed to remove your membership" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Done" }, { status: 200 });
}
