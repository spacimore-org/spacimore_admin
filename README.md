# Spacemore Admin

A separate Next.js admin app using the same Supabase project and authentication as Spacemore.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the same Supabase project URL and publishable key used by the Spacemore storefront.
3. Add `http://localhost:3001` to the Supabase project's allowed authentication redirect URLs if needed.
4. Start the dashboard with `npm run dev`.

Admin access is restricted to authenticated users whose server-managed Supabase `app_metadata.role` is `admin`. Do not grant this role through user-editable metadata. The app uses the publishable key and the signed-in user's session; it does not expose a service-role key.

The overview and Users, Products, and Orders screens are ready for the marketplace schema. They intentionally show setup states instead of fabricated metrics or records until the corresponding Supabase tables and columns are connected.
