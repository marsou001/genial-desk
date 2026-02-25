"use client";

import { useState, useRef, useEffect } from "react";
import { OrganizationView as Organization } from "@/types";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function OrganizationSwitcher({ organizations }: { organizations: Organization[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()
  const page = pathname.split("/")[3]
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { id: currentOrganizationId } = useParams()
  const currentOrganization = currentOrganizationId ?
    organizations.find((org) => org.id === currentOrganizationId) : null;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-2 rounded-lg cursor-pointer border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      >
        {currentOrganization ? currentOrganization.name : "All organizations"}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute min-w-40 mt-2 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 z-50">
          <ul className="text-sm">
            {/* All organizations option */}
            <li>
              <Link
                href="/organizations"
                className={`inline-block w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  !currentOrganizationId
                    ? "font-semibold"
                    : ""
                }`}
              >
                All organizations
              </Link>
            </li>

            <div className="border-t border-zinc-200 dark:border-zinc-700" />

            {/* Organization list */}
            {organizations.map((org) => (
              <li key={org.id} className="w-full">
                <Link
                  href={`/organizations/${org.id}/${page}`}
                  className={`inline-block w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    org.id === currentOrganizationId
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  {org.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
