# Handoff Report: Propose "Find Nearby Hospitals" Button Design and Placement

This report outlines the proposed placement, design, and implementation details for the "Find Nearby Hospitals" button on the rescue profile page.

---

## 1. Observation

Direct observations made in the codebase:

- **File Path**: `app/rescue/[token]/page.tsx`
- **File Characterization**:
  - The page is a Next.js Server Component:
    ```typescript
    // Line 13:
    export default async function RescuePage({
      params,
    }: {
      params: Promise<{ token: string }>
    }) {
    ```
  - It does **not** use client-side hooks like `useRouter`, `useState`, or `useEffect`.
  - The file styles components exclusively using **inline CSS styles**:
    ```typescript
    // Line 69:
    <div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', fontFamily: 'Inter, sans-serif' }}>
    ```
  - The WhatsApp Share button is defined at lines 181-194:
    ```typescript
    {/* WhatsApp Share */}
    <a
      href={`https://wa.me/?text=${encodeURIComponent(...)}}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block', background: '#25D366', color: '#fff',
        borderRadius: 12, padding: '14px', textAlign: 'center',
        fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
        marginBottom: 24,
        minHeight: '48px'
      }}
    >
      📲 Send Emergency Alert via WhatsApp
    </a>
    ```

- **Project Styling & Icons Configurations**:
  - `package.json` includes `lucide-react` under dependencies:
    ```json
    "lucide-react": "^1.21.0"
    ```
  - `tailwind.config.ts` extends standard color systems with variables:
    ```typescript
    colors: {
      primary: {
        DEFAULT: "var(--accent-red)",
        foreground: "var(--text-primary)",
      },
      ...
    }
    ```
  - `app/globals.css` defines a custom animation and utility class for emergency visual states:
    ```css
    @keyframes emergencyPulse {
      0%, 100% { box-shadow: 0 0 20px rgba(255,45,45,0.4); }
      50% { box-shadow: 0 0 40px rgba(255,45,45,0.8), 0 0 80px rgba(255,45,45,0.3); }
    }

    .emergency-pulse {
      animation: emergencyPulse 2s ease-in-out infinite;
    }
    ```
  - Lucide icons are imported in other files (such as `components/CallButton.tsx`) as:
    ```typescript
    import { Phone } from 'lucide-react'
    ...
    <Phone className="h-8 w-8" />
    ```

---

## 2. Logic Chain

1. **Button Placement**:
   - The rescue page is scanned by a first responder/rescuer.
   - Action priority:
     - **High urgency**: Contacting immediate family (direct calls) and locating local trauma care (finding nearby hospitals).
     - **Medium urgency**: Broad communication/updates (WhatsApp Share).
   - Therefore, placing the "Find Nearby Hospitals" button **above** the WhatsApp Share button is optimal. It places this active emergency action closer to the user's primary field of interaction.

2. **Server Component Requirement**:
   - The current file `app/rescue/[token]/page.tsx` is an async function (React Server Component) without client-side hooks.
   - By creating the button using a plain `<a>` tag with `href="https://www.google.com/maps/search/hospitals+near+me"`, `target="_blank"`, and `rel="noopener noreferrer"`, the page remains a pure Server Component.

3. **Icon Selection**:
   - The `MapPin` icon from `lucide-react` is selected to visually indicate map/location lookup.
   - Emojis are used elsewhere on this page (e.g. `📲`, `📞`), but the request explicitly asks to use a `lucide-react` icon. This is clean and matches other components like `CallButton.tsx`.

4. **Style Design**:
   - To align with the layout style of the page, the button should follow the layout's inline style pattern.
   - A bright red glowing emergency style is chosen to indicate immediate safety/rescue utility. It leverages the red accent theme of the application (`#FF2D2D` / `var(--accent-red)`).
   - The button size should respect `min-h-[48px]` to ensure it is highly touch-accessible in high-stress/mobile scenarios.

---

## 3. Caveats

- **No Local Location Tracking**: The proposed URL `https://www.google.com/maps/search/hospitals+near+me` relies on Google Maps' built-in capability to determine the device's location. This avoids requesting GPS permissions within the Next.js app directly, which would require client-side logic (e.g., `navigator.geolocation`) and transition the component into a client component.
- **Mix of Styles and Class Names**: Since the page uses inline styles, inserting a Lucide icon with Tailwind classes might look slightly inconsistent. We propose both an inline style implementation and a Tailwind CSS class implementation.

---

## 4. Conclusion

### Proposed Changes

#### A. Top Import Addition
At the top of `app/rescue/[token]/page.tsx` (e.g. after line 5):
```typescript
import { MapPin } from 'lucide-react'
```

#### B. Component Placement
Insert the button right **before** the WhatsApp Share button (above line 181).

#### C. Styling Implementation Options

##### Option 1: Inline Styles (Recommended for consistency with file conventions)
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
              background: 'linear-gradient(135deg, #FF2D2D 0%, #FF5E5E 100%)',
              color: '#fff',
              borderRadius: 12,
              padding: '14px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              marginBottom: 16,
              minHeight: '48px',
              boxShadow: '0 4px 20px rgba(255, 45, 45, 0.45)',
            }}
          >
            <MapPin size={20} />
            Find Nearby Hospitals
          </a>
```

##### Option 2: Tailwind CSS & Global CSS (Using the project's pulse animation)
We can mix className for the emergency pulsing glow effect from `globals.css`:
```tsx
          {/* Find Nearby Hospitals */}
          <a
            href="https://www.google.com/maps/search/hospitals+near+me"
            target="_blank"
            rel="noopener noreferrer"
            className="emergency-pulse flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF2D2D] to-[#FF5E5E] text-white rounded-xl p-[14px] text-center font-bold text-base no-underline mb-4 min-h-[48px] shadow-[0_4px_15px_rgba(255,45,45,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <MapPin className="h-5 w-5" />
            Find Nearby Hospitals
          </a>
```

---

## 5. Verification Method

To verify the changes (when implemented):
1. **RSC Validation**: Run `npm run build` or `npm run lint` to ensure no imports of hooks or client-side packages are violated.
2. **Visual Inspection**: Open the rescue path `http://localhost:3000/rescue/[token]` on a mobile simulator or viewport and check:
   - Placement is correctly above the WhatsApp button.
   - Button has at least 48px height.
   - Glow/pulsing effect works correctly.
   - MapPin icon is aligned inline with the text.
3. **URL Test**: Tap the button to verify it successfully spawns a new tab targeting `https://www.google.com/maps/search/hospitals+near+me`.
