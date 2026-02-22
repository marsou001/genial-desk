import { UserRole } from "@/types";
import { resend } from "./resend";

export async function sendInviteMemberEmail(email: string, organization: string, role: UserRole, inviteToken: string) {
  const response = await resend.emails.send({
    from: process.env.RESEND_DOMAIN || 'onboarding@resend.dev',
    to: email,
    subject: `You've been invited to join ${organization}`,
    html: `
      <p>Hello,</p>

      <p>You've been invited to join the organization <strong>${organization}</strong> as an ${role}</p>

      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite?invite_token=${inviteToken}"
          style="background:#000;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;">
          Accept Invitation
        </a>
      </p>

      <p>If you weren't expecting this, you can ignore this email.</p>
    `
  })

  return response
}