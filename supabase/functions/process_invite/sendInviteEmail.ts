import { mg } from "./mailgun.ts";
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");
export async function sendInviteEmail(email, organization, role, inviteLink) {
  try {
    await mg.messages.create(MAILGUN_DOMAIN, {
      from: `Excited User <mailgun@${MAILGUN_DOMAIN}>`,
      to: email,
      subject: `You've been invited to join ${organization}`,
      html: `
        <p>Hello,</p>

        <p>You've been invited to join the organization <strong>${organization}</strong> as an ${role}</p>

        <p>
          <a href="${inviteLink}"
            style="background:#000;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;">
            Accept Invitation
          </a>
        </p>

        <p>If you weren't expecting this, you can ignore this email.</p>
      `
    });
    return {
      error: null
    };
  } catch (error) {
    return {
      error
    };
  }
// const response = await resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: email,
//   subject: `You've been invited to join ${organization}`,
//   html: `
//     <p>Hello,</p>
//     <p>You've been invited to join the organization <strong>${organization}</strong> as an ${role}</p>
//     <p>
//       <a href="${inviteLink}"
//         style="background:#000;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;">
//         Accept Invitation
//       </a>
//     </p>
//     <p>If you weren't expecting this, you can ignore this email.</p>
//   `,
// });
// return response;
}
