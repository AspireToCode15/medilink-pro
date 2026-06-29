## 2026-06-29T12:48:47Z
Review the changes in `app/rescue/[token]/page.tsx` for correctness, completeness, robustness, SSR constraints, and interface conformance.
Instructions:
1. Examine `app/rescue/[token]/page.tsx` to verify the "Find Nearby Hospitals" button:
   - Check that it uses a simple, safe `<a>` tag with href="https://www.google.com/maps/search/hospitals+near+me" and target="_blank".
   - Check that it is placed correctly at the bottom of the profile (before WhatsApp share).
   - Check that it uses `MapPin` from `lucide-react`.
   - Check that it matches the premium UI design with proper touch target size (min-h-[48px]) and stands out as an emergency action.
   - Check that it does NOT use any client-side hooks (`useRouter`, `useState`, `useEffect`), maintaining the file as a Server Component.
2. Verify that there are no type issues or lint errors in the file.
3. Run `npm run build` or `npm run lint` if needed to verify build correctness.
4. Report your final verdict (Approved / Vetoed with reasons) and write your review report to `c:\Users\i_m_s\Downloads\medilink_pro\.agents\reviewer_hospitals_1\handoff.md`.
