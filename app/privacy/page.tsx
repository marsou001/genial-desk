import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";

export const metadata: Metadata = {
  title: "Privacy Policy - GenialDesk",
  description: "GenialDesk Privacy Policy",
};

export default async function PrivacyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <main className="max-w-[800px] mx-auto px-8 py-24">
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-12">
          Last updated: June 7, 2026
        </p>

        <section className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Information We Collect
            </h2>
            <p className="mb-3">
              We collect information you provide directly when creating an
              account, including your name, email address, and avatar image.
              When you subscribe to a paid plan, billing information is collected
              and processed by Stripe — we do not store payment card details on
              our servers.
            </p>
            <p className="mb-3">
              We collect the feedback data you upload, including surveys,
              reviews, support tickets, and customer comments, as well as the
              AI-generated analysis and recommendations produced from that data.
            </p>
            <p>
              We automatically collect certain usage data, such as page views,
              feature interactions, and error reports, to improve the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              How We Use Your Information
            </h2>
            <p className="mb-3">We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, maintain, and improve the GenialDesk service</li>
              <li>Process AI analysis of your uploaded feedback data</li>
              <li>Communicate with you about your account, billing, and service updates</li>
              <li>Process subscription payments via Stripe</li>
              <li>Detect and prevent abuse or unauthorized use of the service</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Data Sharing
            </h2>
            <p className="mb-3">
              We do not sell your personal information or feedback data. We
              share data only with trusted third-party service providers who
              help us operate the platform:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Supabase</strong> — database, authentication, and file
                storage
              </li>
              <li>
                <strong>Stripe</strong> — payment processing (no card details
                stored by us)
              </li>
              <li>
                <strong>Upstash (Redis)</strong> — caching to improve
                performance
              </li>
              <li>
                <strong>Vercel</strong> — hosting and edge functions
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Data Security
            </h2>
            <p>
              All data transmitted between your browser and our servers is
              encrypted using TLS. Data at rest is encrypted using industry-standard
              encryption methods. We implement access controls and regularly review
              our security practices. We are committed to maintaining SOC 2
              compliant practices.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Data Retention
            </h2>
            <p>
              We retain your account information and feedback data for as long as
              your account remains active. If you delete your account, your data
              is permanently removed within 30 days, subject to legal or
              regulatory retention requirements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Your Rights
            </h2>
            <p className="mb-3">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at the email address below.
              We will respond within 30 days.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Cookies
            </h2>
            <p>
              We use essential cookies required for authentication and session
              management via Supabase. These cookies are necessary for the
              service to function. We do not use tracking cookies or third-party
              analytics cookies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Contact
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise
              your data rights, please contact us at{" "}
              <a
                href="mailto:privacy@genialdesk.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                privacy@genialdesk.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Material changes will
              be communicated via email or through the platform. Continued use
              of the service after changes constitutes acceptance of the updated
              policy.
            </p>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
