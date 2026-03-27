import AppHeader from "@/components/Layout/AppHeader";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
