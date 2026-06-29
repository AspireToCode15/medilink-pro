# Handoff Report: Propose Design and Placement for "Find Nearby Hospitals" Button

## 1. Observation
- **Target File**: `app/rescue/[token]/page.tsx`
  - Located at: `c:\Users\i_m_s\Downloads\medilink_pro\app\rescue\[token]\page.tsx`
  - Style Paradigm: The UI is styled entirely using inline React `style={{ ... }}` objects. No `className` or Tailwind classes are currently used directly in this file. For example:
    - Line 69: `div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', fontFamily: 'Inter, sans-serif' }}`
    - Line 151: `a href={\`tel:\${contact.phone_real}\`} style={{ display: 'block', background: '#00CC66', color: '#fff', ... }}`
    - Line 181-191: WhatsApp button is styled with:
      ```tsx
      style={{
        display: 'block', background: '#25D366', color: '#fff',
        borderRadius: 12, padding: '14px', textAlign: 'center',
        fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
        marginBottom: 24,
        minHeight: '48px'
      }}
      ```
  - Server Component Nature:
    - Lines 1-5 show the following imports:
      ```tsx
      export const dynamic = 'force-dynamic'

      import { createClient } from '@supabase/supabase-js'
      import { decryptPhone } from '@/lib/contact-masker'
      import { runTriageEngine } from '@/lib/mediq-engine/triage-classifier'
      ```
    - There are no client-side hook imports (like `useRouter`, `useState`, `useEffect`, `usePathname`), keeping it a pure React Server Component (RSC).
- **Styling Configurations**:
  - `tailwind.config.ts`: Extends colors like `primary` as `var(--accent-red)` (`#FF2D2D` in `globals.css`) and custom glow/shadow properties.
  - `app/globals.css`: Defines CSS variables for custom colors (`--accent-red`, `--bg-primary`, etc.) and classes like `.glow-red` (line 96) and `.glass-card-red` (line 88) which utilize a glowing red theme:
    - `--accent-red: #FF2D2D`
    - `--accent-red-glow: rgba(255, 45, 45, 0.25)`
    - `box-shadow: 0 0 20px var(--accent-red-glow)`
- **Icon Usage**:
  - Other components (such as `components/CallButton.tsx` and `components/landing/HowItWorks.tsx`) import icons from `lucide-react` (e.g., `import { Phone } from 'lucide-react'`). They are rendered as standard React components `<Phone className="..." />` or `<Phone size={...} style={...} />`.

## 2. Logic Chain
- **Placement Decision**:
  - The WhatsApp share button (lines 180-194) is intended for digital communication (alerting family members).
  - Finding nearby hospitals is an immediate physical emergency action for a rescuer who is on-site.
  - Placing the "Find Nearby Hospitals" button **above the WhatsApp share button** ensures that physical action resources (calling emergency contacts, viewing first aid guidance, and navigating to nearby hospitals) are grouped together first. Digital notification is placed secondary.
  - In terms of code, this means injecting the button right before the `{/* WhatsApp Share */}` block (line 180).
- **Design Decisions**:
  - Since the file strictly uses inline styles, the primary proposal should use inline React styles to ensure consistency and prevent styling mismatches.
  - However, because the project uses Tailwind CSS, a Tailwind-based alternative is also provided.
  - To denote an **emergency action**, the button is styled using the project's signature red theme (`#FF2D2D` / `rgba(255, 45, 45, 0.45)` glow box-shadow), making it stand out as a high-priority action compared to the green WhatsApp and Call buttons.
  - An `<a>` tag with `target="_blank"`, `rel="noopener noreferrer"`, and `href="https://www.google.com/maps/search/hospitals+near+me"` satisfies the requirement for a premium external link.
  - The `MapPin` icon from `lucide-react` is selected as the primary visual indicator of navigation/location.
- **Server Component Compliance**:
  - Since the button uses a static `<a>` link and standard `lucide-react` SVG components without any client-side handlers or hooks, it remains fully compatible with a pure React Server Component structure.

## 3. Caveats
- No caveats. We verified all file paths, dependencies (`lucide-react`), style definitions, and component scopes.

## 4. Conclusion
We propose placing the "Find Nearby Hospitals" button **above** the WhatsApp share button (line 180) in `app/rescue/[token]/page.tsx`. The button will use `MapPin` from `lucide-react` and feature a glowing red emergency background.

### Proposed Code Changes (Inline Styles Option - Recommended)
1. **Import the Icon** (around line 5):
   ```tsx
   import { runTriageEngine } from '@/lib/mediq-engine/triage-classifier'
   import { MapPin } from 'lucide-react' // <-- Add this import
   ```

2. **Add the Button Component** (before line 180):
   ```tsx
   {/* Find Nearby Hospitals Button */}
   <a
     href="https://www.google.com/maps/search/hospitals+near+me"
     target="_blank"
     rel="noopener noreferrer"
     style={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       gap: '10px',
       background: 'linear-gradient(135deg, #FF2D2D 0%, #B30000 100%)',
       color: '#fff',
       borderRadius: 12,
       padding: '14px',
       fontWeight: 700,
       fontSize: '1rem',
       textDecoration: 'none',
       marginBottom: 16,
       minHeight: '48px',
       boxShadow: '0 4px 20px rgba(255, 45, 45, 0.45)',
       transition: 'all 0.2s ease',
     }}
   >
     <MapPin size={20} style={{ flexShrink: 0 }} />
     Find Nearby Hospitals
   </a>
   ```

### Proposed Code Changes (Tailwind CSS Option - Alternative)
1. **Import the Icon** (around line 5):
   ```tsx
   import { runTriageEngine } from '@/lib/mediq-engine/triage-classifier'
   import { MapPin } from 'lucide-react' // <-- Add this import
   ```

2. **Add the Button Component** (before line 180):
   ```tsx
   {/* Find Nearby Hospitals Button */}
   <a
     href="https://www.google.com/maps/search/hospitals+near+me"
     target="_blank"
     rel="noopener noreferrer"
     className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl p-3.5 font-bold text-base no-underline mb-4 min-h-[48px] shadow-[0_4px_20px_rgba(255,45,45,0.45)] hover:shadow-[0_4px_25px_rgba(255,45,45,0.6)] transition-all duration-200 active:scale-[0.98]"
   >
     <MapPin className="w-5 h-5 flex-shrink-0" />
     <span>Find Nearby Hospitals</span>
   </a>
   ```

## 5. Verification Method
1. **Visual inspection of placement**: Check that the new button is placed exactly after `{triage.firstAidHints.length > 0 && (...)}` and before `{/* WhatsApp Share */}`.
2. **Build and Lint verification**: Run Next.js build and lint commands to ensure there are no syntax errors or Server Component import violations:
   - Command: `npm run build`
   - Command: `npm run lint`
3. **Behavioral check**: Ensure that clicking the button opens Google Maps in a new tab with `hospitals+near+me` prefilled.
