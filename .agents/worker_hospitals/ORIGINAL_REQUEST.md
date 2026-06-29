## 2026-06-29T12:46:11Z
Implement the "Find Nearby Hospitals" button in `app/rescue/[token]/page.tsx` as proposed by the Explorers.
Instructions:
1. View the file `app/rescue/[token]/page.tsx` to locate the exact position before `{/* WhatsApp Share */}` (line 181).
2. Add the following import at the top of `app/rescue/[token]/page.tsx` (around line 6):
```typescript
import { MapPin } from 'lucide-react'
```
3. Add the "Find Nearby Hospitals" link button exactly before the `{/* WhatsApp Share */}` block:
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
              background: 'linear-gradient(135deg, #FF2D2D 0%, #B30000 100%)',
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
              transition: 'all 0.2s ease',
            }}
          >
            <MapPin size={20} style={{ flexShrink: 0 }} />
            Find Nearby Hospitals
          </a>
```
4. Verify the implementation does not introduce any client-side hooks (`useRouter`, `useState`, `useEffect`), keeping it a pure Server Component.
5. Compile and test: Run `npm run build` to verify the project builds successfully with no errors or warnings.
6. Write your changes and validation results to your handoff report at `c:\Users\i_m_s\Downloads\medilink_pro\.agents\worker_hospitals\handoff.md`.

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. A Forensic Auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.
