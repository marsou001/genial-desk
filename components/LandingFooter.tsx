import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-zinc-900 dark:text-white font-semibold text-xl mb-4 block">
              GenialDesk
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Turn customer feedback into prioritized actions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/#features" className="hover:text-zinc-900 dark:hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-zinc-900 dark:hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-zinc-900 dark:hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-zinc-900 dark:hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-8 pt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          &copy; 2026 GenialDesk. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
