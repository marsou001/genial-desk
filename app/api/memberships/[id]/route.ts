import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { invalidateCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { revalidatePath } from "next/cache";

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
  const { error, data } = await supabase
    .from("organization_members")
    .delete()
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.log("Failed to remove member", error.message);
    return NextResponse.json(
      { error: "Failed to remove your membership" },
      { status: 500 },
    );
  }

  await invalidateCache(REDIS_KEYS.members(data.organization_id));
  revalidatePath(`/profile`);
  return NextResponse.json({ message: "Done" }, { status: 200 });
}
