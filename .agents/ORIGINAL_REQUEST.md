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

## 2026-07-01T10:55:29Z

Execute a FINAL CEO-LEVEL QA AUDIT of the MediLink application. Fix all critical bugs, UI/UX issues, and anti-patterns to ensure zero-bug tolerance before a demonstration.

Working directory: c:\Users\i_m_s\Downloads\medilink_pro
Integrity mode: development

## Requirements

### R1. Profile Form Navigation (Critical Bug 1)
- In `app/(protected)/profile/page.tsx`, ensure a visible, full-width, red "Next →" button (min-height 48px) exists at the bottom of every step.
- Validate current step fields before allowing progression.
- Display a step indicator (e.g., "Step 1 of 4") and update the progress bar correctly.
- Include a "Back" button on all steps except Step 1.

### R2. Rescue Page Rewrite (Critical Bug 2)
- Completely rewrite `app/rescue/[token]/page.tsx` as a pure React Server Component (`force-dynamic`).
- Use the Supabase service role admin client (with `autoRefreshToken: false`, `persistSession: false`) to fetch the profile and emergency contacts securely.
- Wrap the entire page in a try/catch block. Never show a blank white screen; show a dark background (`#080B14`) and a fallback UI on error ("Invalid or expired QR code" in red).
- Maintain existing features: decrypt phones server-side, masked numbers, WhatsApp share, first-aid hints, and responsive design down to 320px.

### R3. QR URL Domain Fix (Critical Bug 3)
- Ensure QR codes point to the correct production domain, replacing hardcoded `medilink.vercel.app` or `localhost`.
- Implement pattern: `const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'`.
- Target files: `lib/qr-generator.ts`, `app/(protected)/dashboard/page.tsx`, `app/(protected)/settings/page.tsx`, `components/shared/QRCodeDisplay.tsx`.

### R4. Global Code Pattern Polish
- Safely access arrays (`array?.[0]`) and Supabase properties (add `?.`).
- Add missing `try/catch` blocks on async functions.
- Replace any deprecated `getSession()` calls with `getUser()`.
- Add `'use client'` to components using React hooks (`useState`, `useEffect`).
- Add `error.tsx` boundaries with fallback UI for any page that could crash.

### R5. Rigorous Testing & Deployment
- Validate TypeScript without emitting: `npx tsc --noEmit` must return 0 errors.
- Build the app: `npm run build` must succeed with 0 errors and 0 warnings.
- Commit and push changes to `origin main` with message "Final QA fixes - CEO demo ready".

### R6. CEO Demo Checklist Test (Before Pushing)
Manually verify these 5 things work end to end before pushing (do not push if broken):
1. Register new account → profile setup all 4 steps → dashboard QR visible.
2. Scan QR on mobile → rescue page loads with dark background, patient data, call buttons.
3. Call button tapped → phone dialer opens.
4. Family → Add Member → form saves → member appears in list.
5. Settings → Regenerate QR → new QR on dashboard.

## Acceptance Criteria

### Verification
- [ ] Profile setup: Steps 1-4 can be navigated forwards and backwards with proper validation and UI updates.
- [ ] Rescue Page: Loads perfectly on mobile without login, displays full emergency info securely, handles missing profiles without crashing, and has a dark background.
- [ ] QR Codes: Scanning or clicking the QR link directs to `https://medilink-hazel.vercel.app/rescue/...`.
- [ ] Dashboard & Settings: All cards render without crashing, statistics are accurate, and QR regeneration works.
- [ ] Codebase Quality: Zero TypeScript errors on `npx tsc --noEmit`.
- [ ] Build Quality: Zero errors/warnings on `npm run build`.
- [ ] Manual Verification: R6 checklist is fully verified and functional.
- [ ] Deployment: Code is successfully pushed to `origin main`.
