import { redirect } from "next/navigation";
import { getUser, getUserRole, verifyOrganizationAccess } from "@/lib";
import { fetchOrganization } from "@/data/fetchOrganization";
import AppSidebar from "@/components/Layout/AppSidebar";
import { PermissionsProvider } from "@/context/permissions-context";
import { TOAST_FLASH_KEYS } from "@/lib/toast-flash-keys";

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
    redirect("/organizations?toast=" + TOAST_FLASH_KEYS.ORG_NO_ACCESS);
  }
  
  const organization = await fetchOrganization(organizationId);
  if (organization === null) {
    redirect("/organizations?toast=" + TOAST_FLASH_KEYS.ORG_NOT_FOUND);
  }

  const role = (await getUserRole(user.id, organizationId)) ?? "viewer";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex relative">
      <PermissionsProvider value={{ role }}>
        <AppSidebar />
        <div className="flex-1 flex flex-col pt-4 pr-4 pl-16 sm:pt-8 sm:pr-8 sm:pl-24">
          <main className="flex-1">{children}</main>
        </div>
      </PermissionsProvider>
    </div>
  );
}
