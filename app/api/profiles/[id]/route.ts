import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { full_name } = await request.json()

  if (!full_name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  const trimmedFullName = full_name.trim()

  if (trimmedFullName.length < 3) {
    return NextResponse.json({ error: "Name has to be at least 3 characters long" }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: trimmedFullName })
    .eq("id", id)

  if (error) {
    console.log("Error updating profile name with id" + id + error.message)
    return NextResponse.json({ error: "Failed to update profile name" }, { status: 500 })
  }

  revalidatePath("/profile/" + id)
  return NextResponse.json({ message: "Name updated successfully" }, { status: 200 })
}