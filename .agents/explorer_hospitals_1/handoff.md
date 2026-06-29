# Handoff Report: "Find Nearby Hospitals" Button Placement & Styling Proposal

## 1. Observation

In `app/rescue/[token]/page.tsx`, we directly observed:
- The page is a Next.js Server Component (it is async, imports `@supabase/supabase-js`, and has no `"use client"` directive).
- It fetches medical profile data on the server side using the admin client:
  ```typescript
  7: const supabaseAdmin = createClient(
  8:   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  9:   process.env.SUPABASE_SERVICE_ROLE_KEY!,
  10:   { auth: { autoRefreshToken: false, persistSession: false } }
  11: )
  ```
- The page styling is written strictly in **inline styles** (using style objects in React), e.g.:
  ```tsx
  69:       <div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', fontFamily: 'Inter, sans-serif' }}>
  ```
- The existing bottom of the profile contains a WhatsApp Share button (lines 181-194):
  ```tsx
  181:           <a
  182:             href={`https://wa.me/?text=${encodeURIComponent(`🚨 EMERGENCY ALERT 🚨\n\nI have found ${profile.member_name} who needs emergency help.\nPlease call immediately.\n\nSent via MediLink Emergency ID\nhttps://medilink-hazel.vercel.app`)}`}
  183:             target="_blank"
  184:             rel="noopener noreferrer"
  185:             style={{
  186:               display: 'block', background: '#25D366', color: '#fff',
  187:               borderRadius: 12, padding: '14px', textAlign: 'center',
  188:               fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
  189:               marginBottom: 24,
  190:               minHeight: '48px'
  191:             }}
  192:           >
  193:             📲 Send Emergency Alert via WhatsApp
  194:           </a>
  ```
- The page currently uses emojis for inline headers and text prefixes (e.g. `⚕️`, `⚠️`, `💊`, `📞`, `🩺`, `📲`) and has no imports from `lucide-react`.
- Tailwind configuration (`tailwind.config.ts`) is present, defining theme colors (such as `primary: "var(--accent-red)"` and `accent: "var(--accent-red-glow)"`).
- Lucide React library is installed and imported in other parts of the project, e.g. `components/CallButton.tsx` (line 3):
  ```typescript
  import { Phone } from 'lucide-react'
  ```

---

## 2. Logic Chain

- **Server-Side Safety**: Since the page utilizes the `supabaseAdmin` client with the `SUPABASE_SERVICE_ROLE_KEY` to retrieve private profiles and log scans, it **must** remain a pure Server Component. Introducing client-side hooks like `useRouter`, `useState`, or `useEffect` would require marking the component with `"use client"`, which would leak credentials or cause hydration/runtime errors. Therefore, the new button must be a pure HTML link (`<a>` tag) with static inputs.
- **Placement**:
  - The "Find Nearby Hospitals" button is an emergency rescue action (helps locate nearest medical facilities).
  - The WhatsApp Share button is an alert action (communicates with family/contacts).
  - Grouping the new button directly **above** the WhatsApp button ensures the rescuer sees the primary rescue actions (finding aid and hospitals) before broadcasting details to contacts. 
  - To implement this, the new button is placed right before the WhatsApp share button (before line 181). Setting the new button's bottom margin to `12px` keeps the layout clean.
- **Icon Selection**:
  - `MapPin` from `lucide-react` is highly relevant as the button routes to Google Maps.
  - Alternatively, `Ambulance` could be used.
- **Styling Strategy**:
  - *Inline Styles*: Matches the existing page pattern. The button is styled as a premium emergency action using a red gradient, an accent border, a glowing shadow, and a flex layout to align the icon.
  - *Tailwind Alternative*: Provided for consistency in case the team decides to refactor or use utility classes.

---

## 3. Caveats

- **No caveats.** The target page and dependencies were fully examined, and the proposed changes fit seamlessly with the current structure.

---

## 4. Conclusion

### Proposed Changes

#### 1. Import Statement
Add the Lucide import at the top of `app/rescue/[token]/page.tsx` (around line 6):
```typescript
import { MapPin } from 'lucide-react'
```

#### 2. Option A: Inline Styles (Recommended for current codebase)
Place this block directly above the WhatsApp Share link (above line 181):
```tsx
          {/* Find Nearby Hospitals */}
          <a
            href="https://www.google.com/maps/search/hospitals+near+me"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #FF2D2D 0%, #D80000 100%)',
              color: '#fff',
              borderRadius: 12,
              padding: '14px 20px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              marginBottom: 12,
              minHeight: '48px',
              boxShadow: '0 0 20px rgba(255, 45, 45, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '1px solid #FF5C5C',
            }}
          >
            <MapPin style={{ width: 20, height: 20 }} />
            Find Nearby Hospitals
          </a>
```

#### 3. Option B: Tailwind CSS Classes (Alternative)
If Tailwind classes are preferred for the project:
```tsx
          {/* Find Nearby Hospitals */}
          <a
            href="https://www.google.com/maps/search/hospitals+near+me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl px-5 py-3.5 text-center font-bold text-base no-underline mb-3 min-h-[48px] shadow-[0_0_20px_rgba(255,45,45,0.4)] border border-red-500 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <MapPin className="w-5 h-5" />
            Find Nearby Hospitals
          </a>
```

---

## 5. Verification Method

To verify these changes:
1. Verify the project builds correctly by running `npm run build` or `npx next build`.
2. Verify linting issues do not exist by running `npm run lint` or `npx next lint`.
3. Check the page structure to ensure that adding `MapPin` does not violate Next.js Server Component rules (Lucide icons render correctly on Next.js RSCs).
