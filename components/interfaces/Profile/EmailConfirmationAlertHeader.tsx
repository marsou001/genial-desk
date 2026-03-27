export default function EmailConfirmationAlertHeader() {
  return (
    <header
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      aria-labelledby="email-confirmation-alert-title"
      aria-describedby="email-confirmation-alert-description"
      className="rounded-lg border border-red-300 dark:border-red-800 bg-red-100 dark:bg-red-950/50 px-4 py-3 text-red-900 dark:text-red-100"
    >
      <p id="email-confirmation-alert-title" className="text-sm font-semibold">
        Email confirmation required
      </p>
      <p id="email-confirmation-alert-description" className="mt-1 text-sm">
        Your email is not confirmed yet. Certain actions are disabled until you confirm your email.
      </p>
    </header>
  )
}