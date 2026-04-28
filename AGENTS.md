# GenialDesk - Agent Instructions

## Commands

- `npm run dev` - Start dev server (Next.js 16, App Router)
- `npm run build` - Production build
- `npm run lint` - ESLint (Next.js core-web-vitals + TypeScript config)
- `npm run format` - Prettier write (double quotes, semicolons)
- `npm run format:check` - Prettier check

No test framework configured. No CI workflows.

## Environment

Env vars in `.env.local` (gitignored). Reference `.env.example` for required vars:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY` as older docs suggest)
- `NEXT_PUBLIC_SUPABASE_URL`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`, `RESEND_DOMAIN` (email)
- `NEXT_PUBLIC_APP_HOSTNAME` (for image remote patterns in `next.config.ts`)

`SUPABASE_SERVICE_ROLE_KEY` is NOT in `.env.example` but may be needed for server operations.

## Architecture

**Multi-tenancy**: Organizations → Members with roles (owner/admin/analyst/viewer).

**Key directories**:

- `app/(protected)/` - Authenticated routes with org context
- `app/(auth)/` - Sign in/up flows
- `app/api/` - API routes (organizations, memberships, profiles, invites)
- `lib/supabase/` - Server/client auth helpers
- `lib/auth-guard.ts` - Server-side permission checks for API routes
- `lib/permissions.ts` - Role-based access control

**Path alias**: `@/*` maps to project root.

**Middleware**: `proxy.ts` runs `updateSession` on all routes except static files.

## Conventions

- Server Supabase client must be created per-request (see `lib/supabase/server.ts` comment about Fluid compute)
- API routes use `authGuard()` for organization-scoped auth + permission checks
- Org context passed via cookies (`organization-id`) or headers
- Sonner toasts configured in root layout with custom styling
