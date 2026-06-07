"use client";

import Link from "next/link";
import { UserMemberShipView } from "@/types";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useIsClickedOutside } from "@/hooks/useIsClickedOutside";

export default function OrganizationSwitcher({
  userMemberships,
}: {
  userMemberships: UserMemberShipView[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryParams =
    searchParams.size > 0 ? "?" + searchParams.toString() : "";
  const page = (pathname + queryParams).split("/")[3] ?? "dashboard";

  const { containerRef, open, setOpen } = useIsClickedOutside();

  const { id: currentOrganizationId } = useParams();
  const currentMembership = currentOrganizationId
    ? userMemberships.find((m) => m.organizationId === currentOrganizationId)
    : null;

  return userMemberships.length === 0 ? (
    <Link
      href="/organizations"
      className="px-3 py-2 sm:px-4 rounded-lg cursor-pointer border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-xs md:text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
    >
      All organizations
    </Link>
  ) : (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-2 sm:px-4 rounded-lg cursor-pointer border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-xs md:text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      >
        {currentMembership ? currentMembership.organizationName : "All organizations"}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute min-w-40 mt-2 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 z-50">
          <ul className="text-xs md:text-sm">
            {/* All organizations option */}
            <li>
              <Link
                href="/organizations"
                className={`inline-block w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:bg-zinc-100 dark:focus:bg-zinc-800 ${
                  !currentOrganizationId ? "font-semibold" : ""
                }`}
              >
                All organizations
              </Link>
            </li>

            <div className="border-t border-zinc-200 dark:border-zinc-700" />

            {/* Organization list */}
            {userMemberships.map((membership) => (
              <li key={membership.organizationId} className="w-full">
                <Link
                  href={`/organizations/${membership.organizationId}/${page}`}
                  className={`inline-block w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:bg-zinc-100 dark:focus:bg-zinc-800 ${
                    membership.organizationId === currentOrganizationId ? "font-semibold" : ""
                  }`}
                >
                  {membership.organizationName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
