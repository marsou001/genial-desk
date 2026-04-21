import Link from "next/link";

export default function InviteExpired() {
  return (
    <div className="mt-18 flex items-center justify-center px-6">
      <div className="w-full max-w-md relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-500/20 via-slate-500/20 to-zinc-500/20 rounded-3xl blur-xl opacity-60 dark:opacity-40" />

        <div className="relative rounded-3xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-2xl">
          <div className="p-10 text-center space-y-8">
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-500 to-slate-600 text-white text-2xl shadow-lg">
              ⏰
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Invitation Expired
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed">
                This invitation has expired. Please request a new invitation from
                your organization admin.
              </p>
            </div>

            <Link
              href="/organizations"
              className="inline-flex items-center justify-center w-full h-12 rounded-2xl text-base font-medium text-white bg-gradient-to-r from-zinc-600 to-slate-600 shadow-lg shadow-zinc-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-zinc-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
            >
              Go to Organizations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
