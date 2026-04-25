import { redirect } from "next/navigation";
import UploadTabs from "@/components/interfaces/organizations/upload/UploadTabs";
import { getUser, getUserRole } from "@/lib";
import { TOAST_FLASH_KEYS } from "@/lib/toast-flash-keys";

export default async function UploadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: organizationId } = await params;
  const user = await getUser();
  const role = await getUserRole(user.id, organizationId);

  if (role === null || role === "viewer") {
    redirect(`/organizations/${organizationId}/dashboard`);
  }

  return (
    <section className="w-full max-w-3xl mx-auto py-8">
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Bring customer feedback into GenialDesk
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 tracking-wide leading-6 max-w-2xl mx-auto">
          Upload feedback in bulk from CSV exports or capture individual
          customer quotes manually. Every entry is enriched with AI-powered
          topics, sentiment, and summaries.
        </p>
      </div>

      <div className="mb-4 mx-auto text-xs text-zinc-500 dark:text-zinc-400">
        <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-500">
          Need a sample file?{" "}
          <a
            href="/sample-feedback.csv"
            download
            className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Download CSV template
          </a>
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <UploadTabs />
      </div>
    </section>
  );
}
