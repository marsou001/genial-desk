import { DashboardMockup } from '@/components/DashboardMockup';
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

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <nav className="bg-white border-b border-[#E5E5E5] sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-[#0F0F0F] font-semibold text-xl">GenialDesk</div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-[#6B6B6B] hover:text-[#0F0F0F] text-sm transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-[#6B6B6B] hover:text-[#0F0F0F] text-sm transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-[#6B6B6B] hover:text-[#0F0F0F] text-sm transition-colors">
                FAQ
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-[#0F0F0F] text-sm font-medium hover:bg-[#F5F5F5] rounded-lg transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-[#0052CC] transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-[72px] leading-[1.1] font-semibold text-[#0F0F0F] tracking-tight mb-6">
              Turn customer feedback into prioritized actions.
            </h1>
            <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8 max-w-[540px]">
              Upload surveys, reviews, support tickets, and customer comments. Instantly uncover trends, understand
              sentiment, and receive AI-generated recommendations on what to improve next.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0052CC] transition-colors shadow-sm">
                Start Free Trial
              </button>
              <button className="px-6 py-3 bg-white text-[#0F0F0F] font-medium rounded-lg border border-[#E5E5E5] hover:bg-[#F5F5F5] transition-colors">
                View Demo
              </button>
            </div>
          </div>
          <div>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-[1280px] mx-auto px-8 py-16 border-t border-[#E5E5E5]">
        <p className="text-center text-sm text-[#6B6B6B] mb-8 uppercase tracking-wide">Trusted by leading companies</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-40">
          {['TechCorp', 'DataFlow', 'CloudScale', 'BuildX', 'AnalyticsPro', 'SecureNet'].map((company) => (
            <div key={company} className="text-[#0F0F0F] font-semibold text-lg">
              {company}
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-[1280px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-[#0F0F0F] mb-4 tracking-tight">The feedback challenge</h2>
          <p className="text-lg text-[#6B6B6B] max-w-[600px] mx-auto">
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
            <div key={problem.title} className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-[#6B6B6B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F0F0F] mb-2">{problem.title}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-[1280px] mx-auto px-8 py-24 bg-white rounded-3xl border border-[#E5E5E5] my-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-[#0F0F0F] mb-4 tracking-tight">Everything you need</h2>
          <p className="text-lg text-[#6B6B6B] max-w-[600px] mx-auto">
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
            <div key={feature.title} className="bg-[#FAFAFA] rounded-xl border border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#E6F0FF] flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#0066FF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F0F0F] mb-3">{feature.title}</h3>
              <p className="text-[#6B6B6B] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="max-w-[1120px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-[#0F0F0F] mb-4 tracking-tight">See it in action</h2>
          <p className="text-lg text-[#6B6B6B] max-w-[600px] mx-auto">
            Real-time analysis and recommendations at your fingertips
          </p>
        </div>
        <DashboardMockup />
      </section>

      {/* Insight Card Section */}
      <section className="max-w-[800px] mx-auto px-8 py-24">
        <div className="bg-[#E6F0FF] border border-[#B3D7FF] rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#0066FF] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0066FF] mb-2 uppercase tracking-wide">AI-Generated Insight</div>
              <h3 className="text-2xl font-semibold text-[#0F0F0F] mb-4">
                Negative sentiment increased 18% this month
              </h3>
            </div>
          </div>
          <div className="space-y-4 pl-14">
            <div>
              <div className="text-sm font-semibold text-[#0F0F0F] mb-1">Root Cause</div>
              <p className="text-[#2E2E2E]">
                41% of negative comments mention onboarding complexity. Users report confusion during initial setup and
                difficulty finding key features.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0F0F0F] mb-1">Recommendation</div>
              <p className="text-[#2E2E2E]">
                Create a guided onboarding checklist with interactive tooltips. Prioritize this work as high impact.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0F0F0F] mb-1">Expected Impact</div>
              <p className="text-[#2E2E2E]">
                Improve activation rates by 15-20% and reduce onboarding-related support tickets by 30%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-[1280px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-[#0F0F0F] mb-4 tracking-tight">Simple, transparent pricing</h2>
          <p className="text-lg text-[#6B6B6B] max-w-[600px] mx-auto">
            Choose the plan that fits your team size and feedback volume
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
          {[
            {
              name: 'Starter',
              price: '$49',
              period: '/month',
              features: ['Up to 1,000 feedback items/month', 'Sentiment analysis', 'Basic trend detection', 'Email support'],
              cta: 'Start Free Trial',
              highlighted: false,
            },
            {
              name: 'Pro',
              price: '$149',
              period: '/month',
              features: [
                'Up to 10,000 feedback items/month',
                'Advanced AI recommendations',
                'Custom themes & categories',
                'Priority support',
                'Executive reports',
              ],
              cta: 'Start Free Trial',
              highlighted: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '',
              features: [
                'Unlimited feedback items',
                'Dedicated account manager',
                'Custom integrations',
                'SLA & security review',
                'Training & onboarding',
              ],
              cta: 'Contact Sales',
              highlighted: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 ${
                plan.highlighted
                  ? 'bg-[#0066FF] border-[#0052CC] shadow-xl scale-105'
                  : 'bg-white border-[#E5E5E5]'
              }`}
            >
              <div className="mb-6">
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-[#0F0F0F]'
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-5xl font-semibold ${
                      plan.highlighted ? 'text-white' : 'text-[#0F0F0F]'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-lg ${plan.highlighted ? 'text-white/80' : 'text-[#6B6B6B]'}`}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-white' : 'text-[#00B341]'
                      }`}
                    />
                    <span
                      className={`text-sm ${plan.highlighted ? 'text-white' : 'text-[#2E2E2E]'}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-[#0066FF] hover:bg-[#F5F5F5]'
                    : 'bg-[#0066FF] text-white hover:bg-[#0052CC]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-[800px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold text-[#0F0F0F] mb-4 tracking-tight">Frequently asked questions</h2>
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
              className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden group"
            >
              <summary className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                <span className="font-semibold text-[#0F0F0F]">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-[#6B6B6B] group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-[#6B6B6B] leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-[1280px] mx-auto px-8 py-24 mb-24">
        <div className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-3xl p-16 text-center">
          <h2 className="text-5xl font-semibold text-white mb-4 tracking-tight">
            Ready to understand your customers?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-[600px] mx-auto">
            Start turning feedback into action today. No credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-[#0066FF] font-semibold rounded-lg hover:bg-[#F5F5F5] transition-colors shadow-lg flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white">
        <div className="max-w-[1280px] mx-auto px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-[#0F0F0F] font-semibold text-xl mb-4">GenialDesk</div>
              <p className="text-sm text-[#6B6B6B]">Turn customer feedback into prioritized actions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#0F0F0F] mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li>
                  <a href="#" className="hover:text-[#0F0F0F]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0F0F0F]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0F0F0F]">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#0F0F0F] mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li>
                  <a href="#" className="hover:text-[#0F0F0F]">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0F0F0F]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0F0F0F]">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#0F0F0F] mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li>
                  <a href="#" className="hover:text-[#0F0F0F]">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0F0F0F]">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E5E5E5] mt-8 pt-8 text-center text-sm text-[#6B6B6B]">
            © 2026 GenialDesk. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}