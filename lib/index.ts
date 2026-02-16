import { redirect } from "next/navigation"
import { createClient } from "./supabase/server"
import { NextRequest } from "next/server"
import { UserRole } from "@/types"

export async function getUser() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.log("error getting user: ", userError.message)
    redirect("/sign-in")
  }

  const { user } = userData
  return user
}

// export async function getUserMemberships() {
//   const supabase = await createClient()
//   const user = await getUser()

//   const { data: memberships, error: membershipError } = await supabase
//     .from('organization_members')
//     .select(`
//       organization_id,
//       role,
//       project_id,
//       organizations!inner(name),
//       projects(name)
//     `)
//     .eq('user_id', user.id);
  
//   if (membershipError) {
//     console.error('Error fetching memberships:', membershipError);
//     return null;
//   }
  
//   // Transform memberships
//   const transformedMemberships: UserMembership[] = (memberships || []).map((m: any) => ({
//     organization_id: m.organization_id,
//     project_id: m.project_id,
//     role: m.role as UserRole,
//     organization_name: m.organizations?.name || '',
//     project_name: m.projects?.name || null,
//   }));
  
//   if (transformedMemberships.length === 0) {
//     return null; // User must belong to at least one organization
//   }
  
//   return {
//     id: user.id,
//     email: user.email,
//     memberships: transformedMemberships,
//   };
// }

/**
 * Verify user has access to an organization
 */
export async function verifyOrganizationAccess(
  userId: string,
  organizationId: number
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organization_members')
      .select('id')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .single();
    
    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Get user's role in an organization
 */
export async function getUserRole(
  userId: string,
  organizationId: number
): Promise<UserRole | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organization_members')
      .select('role (name)')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .single();
    console.log("data", data)
    if (error || !data) return null;
    return data.role.name as UserRole;
  } catch {
    return null;
  }
}

/**
 * Get the current organization context from headers
 */
export async function getOrganizationContext(request: NextRequest): Promise<string | null> {
  const orgId = request.headers.get('x-organization-id');
  return orgId;
}
