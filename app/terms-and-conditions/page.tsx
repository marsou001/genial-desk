import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";

export const metadata: Metadata = {
  title: "Terms and Conditions - GenialDesk",
  description: "GenialDesk Terms and Conditions",
};

export default async function TermsPage() {
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
          Terms and Conditions
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-12">
          Last updated: June 7, 2026
        </p>

        <section className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Acceptance
            </h2>
            <p>
              By accessing or using GenialDesk (&quot;the Service&quot;), you agree to be
              bound by these Terms and Conditions. If you do not agree, you may
              not use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Account Registration
            </h2>
            <p className="mb-3">
              You must provide accurate and complete information when creating an
              account. Each account is intended for a single user. You are
              responsible for maintaining the confidentiality of your login
              credentials and for all activities that occur under your account.
            </p>
            <p>
              Organizations and teams may create multiple accounts under a shared
              organization, with members assigned specific roles (owner, admin,
              analyst, viewer). The organization owner is responsible for the
              actions of its members.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Acceptable Use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Upload feedback data that violates any applicable law or infringes third-party rights</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Use automated means (bots, scrapers) to access or extract data from the Service</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Subscription and Billing
            </h2>
            <p className="mb-3">
              GenialDesk offers three plans: Free ($0/month), Pro ($29/month),
              and Business ($79/month). All paid plans are billed monthly via
              Stripe and automatically renew unless cancelled.
            </p>
            <p className="mb-3">
              If you upgrade to a higher-tier plan, you are billed
              immediately for the prorated difference and the new plan limits
              take effect right away. If you downgrade, the new plan subscription
              take effect immediately but the price change and the new limits apply
              at the next billing cycle.
            </p>
            <p>
              You may cancel your subscription at any time. Upon cancellation,
              paid features remain active until the end of the current billing
              period. No refunds are provided for partial billing periods.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Free Plan
            </h2>
            <p>
              The Free Plan is offered at no cost with limited features and usage
              limits. We reserve the right to modify or discontinue the Free Plan
              at any time with reasonable notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              AI Analysis Service
            </h2>
            <p className="mb-3">
              GenialDesk uses artificial intelligence to analyze feedback data
              and generate insights and recommendations. This analysis is
              provided as an informational tool and is not guaranteed to be
              accurate, complete, or suitable for any particular purpose.
            </p>
            <p>
              You retain full ownership of the feedback data you upload.
              GenialDesK does not claim any intellectual property rights over
              your data. AI-generated insights and recommendations are provided
              as part of the Service and may be used to improve the platform in
              an aggregated, anonymized form.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Intellectual Property
            </h2>
            <p>
              The GenialDesk name, logo, and interface design are trademarks of
              GenialDesk. The Service, including its underlying technology,
              software, and documentation, is the proprietary property of
              GenialDesk. You may not copy, modify, distribute, sell, or reverse
              engineer any part of the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Limitation of Liability
            </h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind,
              either express or implied. GenialDesk shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising out of your use of the Service. Our total liability shall
              not exceed the amount you have paid us in the twelve months
              preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Termination
            </h2>
            <p>
              Either party may terminate this agreement at any time. If you
              violate these terms, we may suspend or terminate your access to
              the Service immediately without notice. Upon termination, your
              data will be permanently deleted within 30 days, unless we are
              legally required to retain it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Governing Law
            </h2>
            <p>
              These terms shall be governed by the laws of France, without
              regard to its conflict of law provisions. Any disputes arising
              from these terms shall be resolved in the courts of France.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Material
              changes will be communicated via email at least 30 days in
              advance. Continued use of the Service after changes take effect
              constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
              Contact
            </h2>
            <p>
              If you have any questions about these Terms and Conditions, please
              contact us at{" "}
              <a
                href="mailto:legal@genialdesk.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                legal@genialdesk.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
