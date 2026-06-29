# Project: MediLink Nearby Hospitals Feature

## Architecture
- **Target Page**: `app/rescue/[token]/page.tsx`
- **Render Mode**: Pure React Server Component (no client-side hooks like `useRouter` or `useEffect`).
- **Component Stack**: Styled with inline styling (similar to the rest of the file) and standard tailwind/lucide classes if necessary.
- **Link Target**: External link to `https://www.google.com/maps/search/hospitals+near+me` opening in a new tab (`target="_blank"`).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Analysis | Run Explorers to identify exact position, styles, and markup. (IDs: d9535270, 4ac9d6b4, 2f694dfd) | None | DONE |
| 2 | Implementation | Worker adds the button, icon, and emergency styles. | M1 | DONE |
| 3 | Verification | Reviewer & Challenger verify UI, responsive styling, and build success. | M2 | IN_PROGRESS |
| 4 | Audit | Forensic audit to ensure clean implementation & zero cheating. | M3 | PLANNED |
| 5 | Deployment | Git commit and push changes. | M4 | PLANNED |

## Interface Contracts
### app/rescue/[token]/page.tsx ↔ User Interface
- Standard `<a>` anchor tag.
- Styling: prominent emergency action (red/glowing/distinct, touch target >=48px).
- Icon: Lucide `MapPin` or `Ambulance` icon.
