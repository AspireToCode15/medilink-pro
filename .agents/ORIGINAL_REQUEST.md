# Original User Request

## 2026-06-28T10:06:30Z

Perform a full codebase audit and fix all issues before Vercel deployment for the Medilink Next.js 14 application.

Working directory: c:\Users\i_m_s\Downloads\medilink_pro
Integrity mode: development

## Requirements

### R1. Build Breaking Fixes
- Fix all `npm run build` errors.
- Ensure `use client` on all components using React hooks (`useRouter`, `useState`, etc.).
- Fix any Server Component importing a Client Component without `dynamic()`.
- Await params in Next.js 14 App Router (e.g., `const { token } = await params`).
- Add unique `key` props in `.map()`.
- Replace `any` types causing strict mode errors with proper types or `unknown`.
- Add `!` assertions to environment variables used on the server if missing.
- Ensure all page files have `export default`.
- Break any circular imports.

### R2. Vercel-Specific Fixes
- Add `export const dynamic = 'force-dynamic'` to pages using `cookies()`, `headers()`, or Supabase server client, specifically:
  - `app/rescue/[token]/page.tsx`
  - `app/(protected)/dashboard/page.tsx`
  - `app/(protected)/profile/page.tsx`
  - `app/(protected)/analytics/page.tsx`
  - `app/(protected)/family/page.tsx`
  - `app/(protected)/settings/page.tsx`
  - All `app/api/**/route.ts` files
- Ensure `middleware.ts` is Edge-compatible (use Web Crypto API instead of Node.js crypto/fs).
- Configure `images: { unoptimized: true }` in `next.config.ts`.
- Load Google Fonts (`Space_Grotesk`, `Inter`, `JetBrains_Mono`) via `next/font/google` in `app/layout.tsx` instead of CSS `@import`. Apply variables to root `<html>` tag.
- Ensure `NEXT_PUBLIC_*` environment variable checks happen inside functions/handlers, not at module level.
- Configure `next-pwa` in `next.config.ts` to disable during development.
- Ensure `vercel.json` is configured with `bom1` region and caching headers for `/rescue/(.*)`.

### R3. Runtime Crash Prevention
- Use optional chaining for arrays (`array?.[0]`) and data properties (`data?.property`).
- Wrap `JSON.parse()` in `try/catch`.
- Replace `supabase.auth.getSession()` with `supabase.auth.getUser()`.
- Provide empty state UI for pages that fetch data (never crash on empty data).
- Ensure pages still render after `console.error` logs.

### R4. QR Code URL
- Construct the rescue QR URL using `process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-pro.vercel.app'`. Never hardcode `localhost` or use `window.location.origin` in Server Components.

### R5. Document Upload
- Change document upload error message to: "Upload failed. This may work after deployment. Please try again after deploying to Vercel."
- Add upload timeout handling.
- Ensure "Skip for now" always works even if upload fails.

## Acceptance Criteria

### Final Build & Verification
- [ ] Run `npx tsc --noEmit` and achieve 0 errors.
- [ ] Run `npm run build` and achieve 0 errors and 0 warnings.
- [ ] Provide a list of every file changed.
- [ ] Confirm Audits 1-5 are complete.
