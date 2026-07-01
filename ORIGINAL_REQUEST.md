# Original User Request

## Initial Request — 2026-06-29T18:12:13+05:30

Add a "Find Nearby Hospitals" feature to the MediLink Rescue Page. It should include a highly visible, accessible button at the bottom of the profile that safely opens the rescuer's native Google Maps app to show nearby hospitals, without breaking existing SSR constraints.

Working directory: c:\Users\i_m_s\Downloads\medilink_pro
Integrity mode: development

## Requirements

### R1. Find Nearby Hospitals Button
- Add a prominent button at the bottom of the Rescue Page (`app/rescue/[token]/page.tsx`).
- The button should be a simple, safe external link wrapped in an `<a>` tag with `href="https://www.google.com/maps/search/hospitals+near+me"`, opening in a new tab (`target="_blank"`).
- It must not use client-side hooks (`useRouter`, `useEffect`) to ensure the page remains a pure, safe Server Component.

### R2. Responsive & Premium UI
- The button should match the existing premium UI design (e.g., proper touch targets `min-h-[48px]`).
- Use a relevant `lucide-react` icon (like `MapPin` or `Ambulance`).
- It should visually stand out as an emergency action (e.g., glowing or distinct color).

### R3. Deployment
- Rigorously test the application with `npm run build` after modifications.
- If all checks pass, commit and push to `origin main` using message "feat: Add Nearby Hospitals emergency button".

## Acceptance Criteria

### Verification
- [ ] Code contains an `<a>` tag linking to `https://www.google.com/maps/search/hospitals+near+me` on the rescue page.
- [ ] Running `npm run build` succeeds with 0 errors and 0 warnings.
- [ ] The Rescue Page remains a Server Component and safely renders without any runtime crash.
- [ ] Changes are successfully pushed to GitHub.

## Follow-up — 2026-07-01T10:55:29Z

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
