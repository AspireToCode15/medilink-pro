# Project: MediLink CEO-Level QA Audit

## Architecture
- **Frontend**: Next.js 14 App Router, React 18, Tailwind CSS.
- **Database/Auth**: Supabase.
- **Profile Flow**: Multi-step setup wizard (`app/(protected)/profile/page.tsx`) with strict client-side validation, progress indicators, and full-width navigation.
- **Rescue Flow**: Pure React Server Component (`app/rescue/[token]/page.tsx`) fetching data securely via Supabase service role client, with error fallback and standard triage alerts.
- **QR Generation**: Domain-aware QR URL construction supporting dynamic fallback environment variables.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Exploration & Analysis | Run Explorers to identify form components, Supabase client code, and polishing opportunities. | None | DONE |
| 2 | Profile Form Navigation (R1) | Ensure Next/Back button behavior, step indicator, validation, and full-width styling. | M1 | DONE |
| 3 | Rescue Page RSC Rewrite (R2) | Rewrite rescue page as pure RSC, dynamic fetching, dark background error try/catch. | M1 | DONE |
| 4 | QR URL Domain Fix (R3) | Standardize QR baseUrl across dashboard, settings, QRCodeDisplay, and qr-generator. | M1 | DONE |
| 5 | Global Code Polish (R4) | Error boundaries, optional chaining, try/catch on async, replace deprecated getSession. | M1 | DONE |
| 6 | Verification & QA (R5, R6) | Run Reviewers, Challengers, Forensic Auditor, build/tsc checks, and checklist verification. | M2, M3, M4, M5 | IN_PROGRESS |
| 7 | Deployment | Commit and push to origin main. | M6 | PLANNED |

## Interface Contracts
- **Profile Form**:
  - Visible, full-width red "Next →" button with `min-h-[48px]` at the bottom of every step.
  - Back button present on Steps 2 and 3.
  - Step indicator label like "Step X of 4" and dynamic progress bar.
  - Current step inputs are strictly validated before advancing (fullName min 2 chars, age positive integer 1-120, emergency contacts validated).
- **Rescue Page**:
  - Pure React Server Component with `force-dynamic` rendering.
  - Supabase service role admin client used securely on the server-side.
  - Encapsulated in try/catch block returning a dark background fallback UI with red error text ("Invalid or expired QR code") on failure.
  - Dynamic Google Maps hospital search button and WhatsApp share button using dynamic domain.
- **QR Code Domain**:
  - `const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'`
  - All generated QR URLs must target `https://medilink-hazel.vercel.app/rescue/...` by default.

## Code Layout
- `app/(protected)/profile/page.tsx` - Profile Setup Wizard Page
- `app/rescue/[token]/page.tsx` - Public Rescue Information Page
- `lib/qr-generator.ts` - Shared QR URL generation logic
- `components/shared/QRCodeDisplay.tsx` - Component to display QR Code link
- `app/(protected)/dashboard/page.tsx` - Protected Dashboard Page
- `app/(protected)/settings/page.tsx` - Protected Settings Page
