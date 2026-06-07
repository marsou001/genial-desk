import Link from 'next/link';
import { DashboardMockup } from '@/components/DashboardMockup';
import { createClient } from '@/lib/supabase/server';
import UserAvatar from '@/components/common/UserAvatar';
import { fetchPlans } from '@/data/plans';
import type { Plan } from '@/types';
import {
  Upload,
  TrendingUp,
  Sparkles,
  FileText,
  Target,
  BarChart3,
  MessageSquare,
  Search,
  AlertTriangle,
  Clock,
  ChevronDown,
  Check,
  ArrowRight,
} from 'lucide-react';

export default async function App() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  let plans: Plan[] = [];
  try {
    plans = await fetchPlans();
  } catch (e) {
    console.error('Failed to fetch plans', e);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-zinc-900 dark:text-white font-semibold text-xl">GenialDesk</div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">
                FAQ
              </a>
            </div>
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/organizations"
                className="px-4 py-2 text-zinc-900 dark:text-white text-sm font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Organizations
              </Link>
              <Link
                href="/profile"
                className="relative block w-9 h-9 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700 hover:ring-blue-600 transition-all"
              >
                <UserAvatar />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-zinc-900 dark:text-white text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                Sign In
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-[72px] leading-[1.1] font-semibold text-zinc-900 dark:text-white tracking-tight mb-6">
              Turn customer feedback into prioritized actions.
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-[540px]">
              Upload surveys, reviews, support tickets, and customer comments. Instantly uncover trends, understand
              sentiment, and receive AI-generated recommendations on what to improve next.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/organizations"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm inline-block"
              >
                {isAuthenticated ? "Start Uploading Feedback" : "Start Free Trial"}
              </Link>
              
              <Link href="https://calendly.com/genial-desk/demo" className="px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                View Demo
              </Link>
            </div>
          </div>
          <div>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-[1280px] mx-auto px-8 py-16 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-8 uppercase tracking-wide">Trusted by leading companies</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-40">
          {['TechCorp', 'DataFlow', 'CloudScale', 'BuildX', 'AnalyticsPro', 'SecureNet'].map((company) => (
            <div key={company} className="text-zinc-900 dark:text-white font-semibold text-lg">
              {company}
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-[1280px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-zinc-900 dark:text-white mb-4 tracking-tight">The feedback challenge</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-[600px] mx-auto">
            Product teams struggle to make sense of customer feedback at scale
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: MessageSquare,
              title: 'Overwhelming Volume',
              description: 'Thousands of comments buried across surveys, tickets, and reviews',
            },
            {
              icon: Search,
              title: 'Hidden Patterns',
              description: 'Important trends and recurring issues are hard to spot manually',
            },
            {
              icon: Clock,
              title: 'Slow Analysis',
              description: 'Teams waste hours reading and categorizing feedback in spreadsheets',
            },
            {
              icon: AlertTriangle,
              title: 'Delayed Action',
              description: "Critical problems go unnoticed until it's too late",
            },
          ].map((problem) => (
            <div key={problem.title} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{problem.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-[1280px] mx-auto px-8 py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 my-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-zinc-900 dark:text-white mb-4 tracking-tight">Everything you need</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-[600px] mx-auto">
            Powerful features to transform feedback into actionable insights
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Upload,
              title: 'Upload Anywhere',
              description: 'Import CSV files, surveys, reviews, and support conversations in seconds',
            },
            {
              icon: TrendingUp,
              title: 'Sentiment Analysis',
              description: 'Automatically classify feedback as positive, neutral, or negative with AI',
            },
            {
              icon: BarChart3,
              title: 'Trend Detection',
              description: 'Track customer sentiment over time and spot changes before they escalate',
            },
            {
              icon: Target,
              title: 'Theme Discovery',
              description: 'Identify recurring complaints, feature requests, and praise automatically',
            },
            {
              icon: Sparkles,
              title: 'AI Recommendations',
              description: 'Receive prioritized actions backed by customer evidence and impact analysis',
            },
            {
              icon: FileText,
              title: 'Executive Reporting',
              description: 'Generate summaries and insights for stakeholders in one click',
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 hover:border-blue-600 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="max-w-[1120px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-zinc-900 dark:text-white mb-4 tracking-tight">See it in action</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-[600px] mx-auto">
            Real-time analysis and recommendations at your fingertips
          </p>
        </div>
        <DashboardMockup />
      </section>

      {/* Insight Card Section */}
      <section className="max-w-[800px] mx-auto px-8 py-24">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">AI-Generated Insight</div>
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
                Negative sentiment increased 18% this month
              </h3>
            </div>
          </div>
          <div className="space-y-4 pl-14">
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Root Cause</div>
              <p className="text-zinc-800 dark:text-zinc-300">
                41% of negative comments mention onboarding complexity. Users report confusion during initial setup and
                difficulty finding key features.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Recommendation</div>
              <p className="text-zinc-800 dark:text-zinc-300">
                Create a guided onboarding checklist with interactive tooltips. Prioritize this work as high impact.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Expected Impact</div>
              <p className="text-zinc-800 dark:text-zinc-300">
                Improve activation rates by 15-20% and reduce onboarding-related support tickets by 30%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-[1280px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-zinc-900 dark:text-white mb-4 tracking-tight">Simple, transparent pricing</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-[600px] mx-auto">
            Choose the plan that fits your team size and feedback volume
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
          {plans.map((plan) => {
            const highlighted = plan.name === 'pro';
            const displayName = plan.name.charAt(0).toUpperCase() + plan.name.slice(1);
            const features = [
              `Up to ${plan.maxUploads} feedback uploads/month`,
              `Up to ${plan.maxAIRuns} AI analysis runs/month`,
              `Up to ${plan.maxMembers} team member${plan.maxMembers > 1 ? 's' : ''}`,
            ];

            return (
              <div
                key={plan.id}
                className={`rounded-xl border p-8 ${
                  highlighted
                    ? 'bg-blue-600 border-blue-700 shadow-xl scale-105'
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <div className="mb-6">
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      highlighted ? 'text-white' : 'text-zinc-900 dark:text-white'
                    }`}
                  >
                    {displayName}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-semibold ${
                        highlighted ? 'text-white' : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      ${plan.price}
                    </span>
                    <span
                      className={`text-lg ${highlighted ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400'}`}
                    >
                      /month
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          highlighted ? 'text-white' : 'text-green-500'
                        }`}
                      />
                      <span
                        className={`text-sm ${highlighted ? 'text-white' : 'text-zinc-800 dark:text-zinc-300'}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/organizations"
                  className={`block w-full py-3 rounded-lg font-medium transition-colors text-center ${
                    highlighted
                      ? 'bg-white text-blue-600 dark:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Choose Plan
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-[800px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-zinc-900 dark:text-white mb-4 tracking-tight">Frequently asked questions</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              question: 'How does GenialDesk classify sentiment?',
              answer:
                'We use advanced natural language processing models to analyze the tone, context, and intent of customer feedback. Each comment is classified as positive, neutral, or negative with high accuracy.',
            },
            {
              question: 'What file formats can I upload?',
              answer:
                'GenialDesk supports CSV, Excel (XLSX), and plain text files. You can also paste feedback directly into the platform.',
            },
            {
              question: 'How are AI recommendations generated?',
              answer:
                'Our AI analyzes patterns across all your feedback to identify the most impactful issues. Recommendations are prioritized based on frequency, sentiment impact, and potential business value.',
            },
            {
              question: 'Is my data secure?',
              answer:
                'Yes. All data is encrypted in transit and at rest. We are SOC 2 Type II certified and GDPR compliant. Enterprise customers receive additional security features and custom data retention policies.',
            },
            {
              question: 'Can I export reports?',
              answer:
                'Absolutely. Export insights, charts, and raw data as PDF or CSV files. Pro and Enterprise plans include customizable executive report templates.',
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden group"
            >
              <summary className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                <span className="font-semibold text-zinc-900 dark:text-white">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-[1280px] mx-auto px-8 py-24 mb-24">
        <div className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-3xl p-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-semibold text-white mb-4 tracking-tight">
            Ready to understand your customers?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-[600px] mx-auto">
            Start turning feedback into action today. No credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/organizations"
              className="px-8 py-4 bg-white text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-lg flex items-center gap-2"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="https://calendly.com/genial-desk/demo" className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 transition-colors">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-[1280px] mx-auto px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-zinc-900 dark:text-white font-semibold text-xl mb-4">GenialDesk</div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Turn customer feedback into prioritized actions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="/#features" className="hover:text-zinc-900 dark:hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/#pricing" className="hover:text-zinc-900 dark:hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/#faq" className="hover:text-zinc-900 dark:hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 mt-8 pt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            © 2026 GenialDesk. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}