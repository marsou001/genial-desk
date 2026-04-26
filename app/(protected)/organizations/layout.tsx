import { NuqsAdapter } from "nuqs/adapters/next/app";
import AppHeader from "@/components/Layout/AppHeader";

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <AppHeader />
      <main>
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
    </div>
  );
}
