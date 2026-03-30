import Link from "next/link";
import SetPasswordForm from "@/components/auth/SetPasswordForm";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ invite_token?: string }>;
}) {
  const { invite_token } = await searchParams;
  const inviteToken = invite_token?.trim() ?? "";

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 border border-zinc-200 dark:border-zinc-700">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Set your password
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Choose a password for your GenialDesk account, then you&apos;ll
          continue to your invitation.
        </p>
      </div>

      {inviteToken.length === 0 ? (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
        >
          This page is missing a valid invitation link. Open the link from your
          invite email, or ask your organization admin to send a new invite.
        </div>
      ) : (
        <SetPasswordForm inviteTokenFromUrl={inviteToken} />
      )}

      <div className="mt-6 text-center text-sm">
        <Link
          href="/sign-in"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
