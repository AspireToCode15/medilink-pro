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
