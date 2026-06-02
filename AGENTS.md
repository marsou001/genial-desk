# GenialDesk

## Commands

- `npm run dev` — Next.js 16 App Router dev server
- `npm run build` — production build
- `npm run lint` — ESLint (Next core-web-vitals + TypeScript + Prettier conflict rules)
- `npm run format` — Prettier (double quotes, semicolons) across all files
- `npm run format:check` — Prettier check only

No test framework. No CI.

## Env

`.env.local` (gitignored). `.env.example` is source of truth for required vars.

Key quirks:
- `NEXT_PUBLIC_APP_HOSTNAME` used in `next.config.ts` image remote patterns
- Stripe edge function (`supabase/functions/webhook_stripe/`) uses `Deno.env`

## Architecture

**Multi-tenancy**: Organizations → Members (owner/admin/analyst/viewer). `lib/permissions.ts` has the full role-permission matrix.

**Path alias**: `@/*` → root.

**Middleware** (`proxy.ts`): runs `updateSession` from `@supabase/ssr` on all routes except static files.

**Supabase clients**:
- `lib/supabase/server.ts` — per-request (Fluid compute: never cache in a global). Creates `createServerClient`.
- `lib/supabase/client.ts` — browser `createBrowserClient`.
- API routes: use `authGuard(orgId, { requirePermission })` from `lib/auth-guard.ts` for org-scoped auth + permission check.
- Edge functions (webhook): use `supabase/functions/webhook_stripe/supabase.ts` with Supabase secret key.

**Data layer** (`data/` directory): server-side functions that create a Supabase client and query directly. `data/plans.ts` has `fetchPlanByPriceId()` — also used in API routes. Some functions also use Redis cache (`lib/redis/`).

**Client-side API** (`lib/api/`): thin fetch wrapper (`client.ts`: `get`/`post`/`patch`/`del`/`postFormData`, auto-retries 5xx and network errors). Resource modules export React hooks (e.g. `useFetchPlans`, `useUpdateSubscriptionMutation`) that call the wrapper and manage `loading`/`error`/`data` state.

**Billing / Stripe**:
- `app/api/checkout-session/route.ts` — create Stripe Checkout Session (new subscriptions)
- `app/api/subscriptions/[id]/route.ts` — PATCH (change plan) or DELETE (set `cancel_at_period_end`)
  - PATCH detects upgrade vs downgrade by comparing plan prices via `fetchPlanByPriceId`
  - Upgrades: `proration_behavior: "always_invoice"` (immediate)
  - Downgrades: `proration_behavior: "none"` (plan changes immediately in app, billed at next cycle)
- `supabase/functions/webhook_stripe/index.ts` — Deno edge function handling Stripe webhook events
  - `customer.subscription.created/updated/deleted` — syncs `subscriptions` table
  - `invoice.paid` — resets org's `remainingAIRuns`/`remainingUploads` to new plan's limits

## Conventions

- API routes: `authGuard()` for auth + permission, return `NextResponse.json`
- Server Supabase client: create per-request (`lib/supabase/server.ts` has the Fluid compute comment)
- Org context passed via cookies (`organization-id`) or headers (`x-organization-id`)
- Stripe edge function (`supabase/functions/webhook_stripe/`): Deno runtime (not Next.js), has its own `deno.json` with import map, `verify_jwt = false` in `config.toml`
