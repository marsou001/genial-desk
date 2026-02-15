# Multi-Tenancy Implementation Guide

This document outlines the multi-tenancy system with organizations, projects, roles, and permissions that has been implemented.

## Overview

The system implements:
- **Organizations**: Top-level containers for all data
- **Projects**: Sub-containers within organizations (optional)
- **Roles**: owner, admin, analyst, viewer
- **Permissions**: Granular permission system based on roles
- **Auth**: Supabase Auth integration with server and client-side helpers

## Database Schema Requirements

You mentioned you'll handle the database setup manually. Here's what needs to exist:

### Required Tables

1. **organizations**
   - `id` (UUID, primary key)
   - `name` (VARCHAR)
   - `created_at` (TIMESTAMP)

2. **projects**
   - `id` (UUID, primary key)
   - `name` (VARCHAR)
   - `organization_id` (UUID, foreign key to organizations)
   - `created_at` (TIMESTAMP)

3. **organization_members** (junction table)
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users)
   - `organization_id` (UUID, foreign key to organizations)
   - `project_id` (UUID, nullable, foreign key to projects)
   - `role` (VARCHAR: 'owner', 'admin', 'analyst', 'viewer')
   - `created_at` (TIMESTAMP)

4. **feedbacks** (update existing)
   - Must have `organization_id` (UUID, foreign key to organizations)
   - Must have `project_id` (UUID, nullable, foreign key to projects)

### RLS Policies

You'll need to set up RLS policies that:
- Ensure users can only access data from organizations they belong to
- Scope all queries by `organization_id`
- Respect role-based permissions

## API Routes

### Organizations
- `GET /api/organizations` - List user's organizations
- `POST /api/organizations` - Create organization (user becomes Owner)
- `GET /api/organizations/[id]` - Get organization details
- `PATCH /api/organizations/[id]` - Update organization (requires `org:update`)
- `DELETE /api/organizations/[id]` - Delete organization (requires Owner role)
- `GET /api/organizations/[id]/members` - List members (requires `org:members:read`)
- `POST /api/organizations/[id]/members` - Invite member (requires `org:members:invite`)

### Projects
- `GET /api/projects` - List projects in current organization
- `POST /api/projects` - Create project (requires `project:create`)
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project (requires `project:update`)
- `DELETE /api/projects/[id]` - Delete project (requires `project:delete`)

### Updated Routes
- `POST /api/upload` - Now requires auth and scopes by `organization_id`
- `POST /api/feedback` - Now requires auth and scopes by `organization_id`
- `GET /api/insights/weekly` - Now requires auth and scopes by `organization_id`

## Permission System

### Roles & Permissions

**Owner**
- Full access to everything
- Can manage billing & subscription
- Can manage all members & roles
- Can delete organization
- Full project and data access

**Admin**
- Can manage projects
- Can invite/manage members (except Owners)
- Full data access
- Cannot delete organization or manage billing

**Analyst**
- Full access to data, insights, dashboards, exports
- Can create and manage reports
- Cannot manage members, billing, or org settings

**Viewer**
- Read-only access to dashboards and insights
- No editing, exporting, or management permissions

### Permission Checks

- **Server-side**: Use `authGuard()` in API routes
- **Client-side**: Use `PermissionGate` component or `hasPermission()` helper

## Authentication Flow

### Client-Side
- Use `useAuth()` hook from `lib/auth-client.ts`
- Use `signIn()`, `signUp()`, `signOut()` functions

### Server-Side
- Use `getAuthUser()` from `lib/auth.ts` for server components
- Use `authGuard()` from `lib/auth-guard.ts` for API routes
- Organization context passed via `x-organization-id` header or `organization-id` cookie
- Project context passed via `x-project-id` header or `project-id` cookie

## UI Components

### Organization & Project Selectors
- `OrganizationSelector` - Dropdown to select current organization
- `ProjectSelector` - Dropdown to select current project (optional)
- Both store selection in cookies and refresh page to update server context

### Permission Gating
- `PermissionGate` component - Conditionally renders children based on role/permission
- Example:
```tsx
<PermissionGate role={userRole} permission="data:create">
  <UploadButton />
</PermissionGate>
```

## Data Fetching

All data fetching functions now require `organizationId`:
- `fetchFeedbacks(organizationId)`
- `fetchStats(organizationId)`
- `fetchInsights(days, organizationId)`

Server components use `getServerOrganizationContext()` to get the current org from cookies/headers.

## Important Notes

1. **Auth Token Handling**: The current implementation expects auth tokens to be passed via:
   - Authorization header (Bearer token) for API routes
   - Cookies for server components (you may need to adjust based on your Supabase Auth setup)

2. **User ID Extraction**: API routes need to extract the user ID from the auth token. The `authGuard` function handles this, but you may need to adjust based on your Supabase Auth configuration.

3. **Cookie-Based Context**: Organization and project selection is stored in cookies (`organization-id` and `project-id`). These are read by:
   - Client components (via `document.cookie`)
   - Server components (via `cookies()` from `next/headers`)
   - API routes (via headers or cookies)

4. **RLS Policies**: Ensure your RLS policies enforce:
   - Users can only query data where `organization_id` matches their membership
   - Role-based access control at the database level

## Next Steps

1. Set up the database tables and RLS policies as described above
2. Configure Supabase Auth (if not already done)
3. Test the organization creation flow
4. Verify permission checks work correctly
5. Adjust auth token extraction if needed based on your Supabase setup

## Example Usage

### Creating an Organization
```typescript
const response = await fetch('/api/organizations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'My Company' }),
});
// User automatically becomes Owner
```

### Checking Permissions
```typescript
import { hasPermission } from '@/lib/permissions';

if (hasPermission(userRole, 'data:create')) {
  // Allow upload
}
```

### Using Permission Gate
```tsx
<PermissionGate role={userRole} permission="project:create">
  <CreateProjectButton />
</PermissionGate>
```
