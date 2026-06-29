## 2026-06-29T12:44:33Z
Analyze the file `app/rescue/[token]/page.tsx` and the project styling configurations. Propose a design and exact placement for the new "Find Nearby Hospitals" button.
Instructions:
1. Examine the contents of `app/rescue/[token]/page.tsx` to understand the existing UI layout and style conventions.
2. Determine where at the bottom of the profile the new button should go (e.g., above or below the WhatsApp share button).
3. Design a responsive, premium external link button wrapped in an `<a>` tag with target="_blank" and href="https://www.google.com/maps/search/hospitals+near+me".
4. Choose a relevant icon from `lucide-react` (like `MapPin` or `Ambulance`). Check how icons are imported and used in other components in the codebase.
5. Provide a styling proposal using Tailwind classes or inline styles (as used in `app/rescue/[token]/page.tsx`) to make it visually stand out as an emergency action (e.g., glowing or distinct color, min-h-[48px]).
6. Verify that no client-side hooks (like useRouter or useEffect) are used, keeping it a pure Server Component.
7. Write your findings to your working directory: `c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_hospitals_3\handoff.md`.
