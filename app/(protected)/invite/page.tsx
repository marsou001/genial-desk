import AcceptInviteButton from "@/components/interfaces/Invite/AcceptInviteButton";
import { fetchInvitation } from "@/data/fetchInvitation";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ invite_token: string }>;
}) {
  const { invite_token } = await searchParams;
  const invitationResult = await fetchInvitation(invite_token);

  if (invitationResult.status === "not_found") return <div>Invitation not found</div>
  if (invitationResult.status === "expired") return <div>Invitation expired</div>
  if (invitationResult.status === "accepted") return <div>Invitation already accepted</div>

  const invite = invitationResult.invite
  const expiresAt = (new Date(invite.expiresAt)).toISOString()
  const expirationDate = expiresAt.split("T")[0]
  const expirationTime = expiresAt.split("T")[1].split(".")[0]

  return (
    <div className="mt-18 flex items-center justify-center px-6">
      <div className="w-full max-w-md relative">

        {/* Glow background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-60 dark:opacity-40" />

        {/* Card */}
        <div className="relative rounded-3xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-2xl">

          <div className="p-10 text-center space-y-8">

            {/* Icon */}
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl shadow-lg">
              🎉
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                You've been invited
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Join{" "}
                <span className="font-semibold text-foreground">
                  {invite.organization}
                </span>{" "}
                as an{" "}
                <span className="font-semibold text-foreground">
                  {invite.role}
                </span>{" "}
                and start collaborating with your team.
              </p>
            </div>

            {/* Button */}
            <AcceptInviteButton inviteToken={invite_token} />

            {/* Expiry */}
            <p className="text-xs text-muted-foreground/80 pt-4 border-t border-border/40">
              This invitation expires on{" "}
              <span className="font-medium text-foreground">
                {expirationDate} at exactly {expirationTime}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}