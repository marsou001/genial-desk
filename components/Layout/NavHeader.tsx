import Link from "next/link";

const tabs = [
  { href: 'dashboard', label: 'Dashboard' },
  { href: 'upload', label: 'Upload' },
  { href: 'feedback', label: 'Feedback' },
  { href: 'insights', label: 'Weekly Insights' },
];

export default function NavHeader() {
  return (

    <header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              GenialDesk
            </h1>
          </div>
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  false
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}