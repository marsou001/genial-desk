// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { sendInviteEmail } from './sendInviteEmail.ts';
import { generateToken, hashToken } from './utils.ts';

const APP_URL = Deno.env.get("APP_URL");
const PROJECT_URL = Deno.env.get('PROJECT_URL');
const SECRET_KEY = Deno.env.get('SECRET_KEY');

Deno.serve(async ()=>{
  try {
    if (!APP_URL) {
      throw new Error("APP_URL Key missing");
    }
    if (!PROJECT_URL) {
      throw new Error("PROJECT_URL Key missing");
    }
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY Key missing");
    }
    const supabase = createClient(PROJECT_URL, SECRET_KEY);
    const { data: invitesData, error: invitesError } = await supabase.from('invites').select('id, email, organizations (name), roles (name)').eq('status', 'pending').limit(10);
    if (invitesError) throw invitesError;
    if (invitesData.length === 0) {
      return new Response(JSON.stringify({
        message: "All invites are processed"
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 200
      });
    }
    for (const invite of invitesData){
      try {
        const { data: profileData, error: profileError } = await supabase.from("profiles").select("id").eq("email", invite.email).limit(1).maybeSingle();
        if (profileError) throw profileError;
        const inviteToken = generateToken();
        const tokenHash = await hashToken(inviteToken);
        let inviteLink;
        if (profileData !== null) {
          console.log(11111);
          inviteLink = `${APP_URL}/invite?invite_token=${inviteToken}`;
        } else {
          console.log(22222);
          const { data, error } = await supabase.auth.admin.generateLink({
            type: "invite",
            email: invite.email,
            options: {
              redirectTo: `${APP_URL}/set-password?invite_token=${inviteToken}`
            }
          });
          if (error) throw error;
          inviteLink = data.properties.action_link;
        }
        console.log("inviteLink", inviteLink);
        const { error: sendEmailError } = await sendInviteEmail(invite.email, invite.organizations.name, invite.roles.name, inviteLink);
        if (sendEmailError) throw sendEmailError;
        const { error: updateInviteError } = await supabase.from("invites").update({
          token_hash: tokenHash,
          status: "sent"
        }).eq("id", invite.id);
        if (updateInviteError) throw updateInviteError;
      } catch (error) {
        console.error(`error processing invite ${invite.id} for user with email ${invite.email}:`, error);
        await supabase.from("invites").update({
          status: "failed"
        }).eq("id", invite.id);
      }
    }
    return new Response(JSON.stringify({
      success: true
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error("Fatal error:", error);
    return new Response(JSON.stringify({
      message: error?.message ?? error
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
