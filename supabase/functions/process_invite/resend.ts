import { Resend } from "npm:resend";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
export const resend = new Resend(RESEND_API_KEY);
