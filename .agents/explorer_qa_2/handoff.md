# Handoff Report — Rescue Page Rewrite Analysis

## 1. Observation
The existing implementation of the rescue page is located at `app/rescue/[token]/page.tsx` (254 lines total). 

Key segments observed:
1. **Dynamic Config & Module Scope Supabase Admin Instance (Lines 1-12)**:
   ```typescript
   export const dynamic = 'force-dynamic'

   import { createClient } from '@supabase/supabase-js'
   import { decryptPhone } from '@/lib/contact-masker'
   import { runTriageEngine } from '@/lib/mediq-engine/triage-classifier'
   import { MapPin } from 'lucide-react'

   const supabaseAdmin = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!,
     { auth: { autoRefreshToken: false, persistSession: false } }
   )
   ```
2. **Current Token Validation & Fallback Handling (Lines 22-35, 231-253)**:
   ```typescript
   if (!token) {
     return <ErrorPage message="Invalid QR code" />
   }
   // ...
   if (profileError || !profile) {
     return <ErrorPage message="QR code is invalid or expired" />
   }
   // ...
   } catch (error: any) {
     return (
       <div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
         <div style={{ textAlign: 'center' }}>
           <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
           <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Something went wrong</div>
           <div style={{ color: '#8899BB', fontSize: '0.9rem' }}>{error?.message || 'Unknown error'}</div>
         </div>
       </div>
     )
   }
   ```
3. **Decryption and Triage Engine Invocation (Lines 44-66)**:
   ```typescript
   // Decrypt phone numbers server side
   const decryptedContacts = (contacts || []).map((c: any) => ({
     ...c,
     phone_real: (() => {
       try { return decryptPhone(c.phone_encrypted) }
       catch { return '' }
     })()
   }))
   // ...
   // Run MedIQ Engine
   const triage = runTriageEngine(
     profile.conditions || '',
     profile.allergies || '',
     profile.current_medications || '',
     profile.age,
     profile.blood_group
   )
   ```
4. **Responsive Layout Container (Lines 70-81)**:
   ```typescript
   return (
     <div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', fontFamily: 'Inter, sans-serif' }}>
       ...
       <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 16px' }}>
   ```

No external test framework or configuration exists in `package.json` (only Next.js scripts: `dev`, `build`, `start`, `lint`).

---

## 2. Logic Chain
1. **Pure React Server Component (RSC) with `force-dynamic`**:
   - *Observation*: The file does not declare `"use client"` or import any hooks (`useState`, `useEffect`). It uses standard HTML `<a>` tags with `tel:` and external links for WhatsApp and Google Maps.
   - *Reasoning*: The component is natively ready to run as an RSC. Retaining the `export const dynamic = 'force-dynamic'` declaration at the top will keep Next.js from statically rendering this route, forcing it to execute server-side on every request to fetch fresh patient data and decrypt numbers dynamically.
2. **Secure Supabase Service Role Usage**:
   - *Observation*: The Supabase admin client is initialized at the module level.
   - *Reasoning*: While safe from client-side exposure because it's a Server Component, initializing it inside the component function scope (`RescuePage`) ensures that the service role client is request-scoped, instantiated fresh per request, and properly garbage collected. It continues using `autoRefreshToken: false` and `persistSession: false` as requested.
3. **Consolidated Try/Catch & Fallback UI**:
   - *Observation*: The current implementation handles validation failures by returning `<ErrorPage>` immediately rather than throwing, and the `catch` block shows a generic error instead of the specific "Invalid or expired QR code" fallback.
   - *Reasoning*: If we refactor validation errors (missing token, query error, missing profile) to explicitly `throw new Error("Invalid or expired QR code")`, execution redirects immediately to the unified `catch` block. The `catch` block can then render the dark background `#080B14` and red text `#FF2D2D` fallback UI displaying the error message.
4. **Feature Maintenance**:
   - *Observation*: Features like phone decryption, masked number rendering, WhatsApp sharing, and hospital links are standard server-side operations and HTML anchors.
   - *Reasoning*: Keeping the decryption mapping (`decryptPhone`), `runTriageEngine` invocation, and the responsive inline CSS styles (`maxWidth: 520` container and clamp font sizes) ensures all features and responsiveness down to 320px are fully maintained.

---

## 3. Caveats
- **Environment Variables**: Assumes `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `ENCRYPTION_KEY` are correctly defined in the production environment.
- **Service Role Bypass**: The service role client bypasses RLS to query profiles. This is necessary because scanning a public QR code is an unauthenticated action, and security is maintained by treating the token as a secure UUID secret.

---

## 4. Conclusion
The rescue page can be successfully rewritten as a pure RSC by moving the Supabase client creation inside the component function scope, raising exceptions to handle invalid state inside the main try/catch block, and updating the catch block layout.

Proposed changes have been written to the following files in the working directory:
- `proposed_page.tsx`: Contains the full proposed source code for `app/rescue/[token]/page.tsx`.
- `proposed_page.patch`: Contains the unified diff patch to apply the modifications.

---

## 5. Verification Method
1. **Apply Changes**: Copy the contents of `proposed_page.tsx` into `app/rescue/[token]/page.tsx`, or apply the patch using `git apply proposed_page.patch`.
2. **Build and Lint Validation**: Run `npm run build` and `npm run lint` to ensure Next.js successfully compiles the route as an RSC with no typescript or build errors.
3. **Invalidation Conditions**:
   - If the code contains client-side React directives or hooks (like `usePathname`), the build will fail unless `"use client"` is declared.
   - If Supabase credentials or the encryption key is missing from `.env`, the page will immediately hit the `catch` block and render the fallback UI.
