import AppHeader from '@/components/Layout/AppHeader';

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <AppHeader breadcrumbs={[{ label: 'Organizations', href: '/organizations' }]} />
      <main>{children}</main>
    </div>
  );
}
