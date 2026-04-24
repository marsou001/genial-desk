import { createClient } from "@/lib/supabase/server";

export async function checkOrganizationExists(
  organizationId: string,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return data !== null;
  } catch (error) {
    console.log(
      `Error checking that organization with id ${organizationId} exists`,
      error,
    );
    return false;
  }
}
