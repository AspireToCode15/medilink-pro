# Original Request: Routing & Vercel Compatibility

Audit the codebase to check:
1. Routing files for missing `export const dynamic = 'force-dynamic'` if cookies(), headers(), or Supabase server clients are used. Target files:
   - `app/rescue/[token]/page.tsx`
   - `app/(protected)/dashboard/page.tsx`
   - `app/(protected)/profile/page.tsx`
   - `app/(protected)/analytics/page.tsx`
   - `app/(protected)/family/page.tsx`
   - `app/(protected)/settings/page.tsx`
   - All `app/api/**/route.ts` files
2. `middleware.ts` Edge-compatibility (use Web Crypto API instead of Node.js crypto/fs).
3. `images: { unoptimized: true }` in `next.config.ts`.
4. Load Google Fonts (`Space_Grotesk`, `Inter`, `JetBrains_Mono`) via `next/font/google` in `app/layout.tsx` instead of CSS `@import`.
5. Ensure `NEXT_PUBLIC_*` environment variables checks happen inside functions/handlers, not at module level.
6. Configure `next-pwa` in `next.config.ts` to disable during development.
7. Ensure `vercel.json` is configured with `bom1` region and caching headers for `/rescue/(.*)`.
8. Construct the rescue QR URL using `process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-pro.vercel.app'`. Never hardcode `localhost` or use `window.location.origin` in Server Components.

## 2026-06-28T11:47:00Z
Perform the Vercel and routing compatibility audit under c:\Users\i_m_s\Downloads\medilink_pro. Your working directory is c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_audit_2_gen5\.
Please read c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_audit_2_gen5\ORIGINAL_REQUEST.md, c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_audit_2_gen5\progress.md, and c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_audit_2_gen5\progress.md.
Perform the audit, scan for the issues in ORIGINAL_REQUEST.md, and write your findings to handoff.md in your working directory.
Report back when done.
