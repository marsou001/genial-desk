import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';

export default async function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 border border-zinc-200 dark:border-zinc-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              GenialDesk
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Create your account
            </p>
          </div>
          
          <SignUpForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-zinc-600 dark:text-zinc-400">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
