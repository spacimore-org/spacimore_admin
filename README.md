# Spacemore Admin

A separate Next.js admin app using the same Supabase project and authentication as Spacemore.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the same Supabase project URL and publishable key used by the Spacemore storefront.
3. Add `http://localhost:3001/auth/callback` to the Supabase project's allowed authentication redirect URLs. Set `NEXT_PUBLIC_SITE_URL` to the admin app origin in `.env.local` when it differs from `http://localhost:3001`.
4. Start the dashboard with `npm run dev`.

Admin access is restricted to authenticated users whose server-managed Supabase `app_metadata.role` is `admin`. Do not grant this role through user-editable metadata. The app uses the publishable key and the signed-in user's session; it does not expose a service-role key.

Admins can request a password reset from `/forgot-password`. The recovery email returns to `/auth/callback`, where the session is established before the admin chooses a new password.

The Users screen reads from a protected `admin_user_directory` table. Apply the SQL migration in `supabase/migrations` to the shared Supabase project (for example, in the Supabase SQL Editor) to create the table, enable admin-only reads, sync new Auth accounts, and backfill existing accounts. The admin app uses the signed-in session and publishable key; no service-role key is needed.

The dashboard's Total users metric also reads this directory. The other overview metrics and Products and Orders screens still show setup states until their corresponding marketplace tables are connected.
