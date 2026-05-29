import Mailgun from "npm:mailgun.js";
import FormData from "npm:form-data";
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const mailgun = new Mailgun(FormData);
export const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY
});
