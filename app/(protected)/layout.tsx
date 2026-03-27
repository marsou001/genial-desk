import { EmailConfirmationProvider } from "@/context/email-confirmation-context";
import { getUser } from "@/lib";

export default async function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const isEmailConfirmed = user.email_confirmed_at !== null;

  return (
    <EmailConfirmationProvider value={isEmailConfirmed}>
      {children}
    </EmailConfirmationProvider>
  );
}
