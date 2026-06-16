import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set",
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function deleteOrganization(orgId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("organizations").delete().eq("id", orgId);
  if (error) {
    console.warn(`Failed to delete organization ${orgId}:`, error.message);
  }
}

export async function deleteTestUser(email: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: users, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.warn("Failed to list users for cleanup:", listError.message);
    return;
  }

  const user = users.users.find((u) => u.email === email);

  if (!user) return;

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.warn(`Failed to delete user ${email}:`, deleteError.message);
  }
}

export function getSetupEmail(): string | null {
  try {
    const data = readFileSync("playwright/.auth/setup-email.json", "utf-8");
    return JSON.parse(data).email;
  } catch {
    return null;
  }
}
