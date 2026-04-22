import { redirect } from "next/navigation";
import { getUser, getUserRole, verifyOrganizationAccess } from "@/lib";
import { fetchOrganization } from "@/data/fetchOrganization";
import AppSidebar from "@/components/Layout/AppSidebar";
import { PermissionsProvider } from "@/context/permissions-context";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: organizationId } = await params;
  const user = await getUser();
  const hasAccess = await verifyOrganizationAccess(user.id, organizationId);
  if (!hasAccess) {
    // TODO: toast error
    redirect("/organizations");
  }

  const organization = await fetchOrganization(organizationId);
  if (!organization) {
    // TODO: toast error
    redirect("/organizations");
  }

  const role = (await getUserRole(user.id, organizationId)) ?? "viewer";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex relative">
      <AppSidebar />
      <div className="flex-1 flex flex-col pt-8 pr-8 pl-24">
        <PermissionsProvider value={{ role }}>
          <main className="flex-1">{children}</main>
        </PermissionsProvider>
      </div>
    </div>
  );
}
