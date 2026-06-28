# Original Request: Runtime & Component Audit

Audit the codebase to check:
1. `use client` is present on all components using React hooks (`useRouter`, `useState`, etc.).
2. Any Server Component importing a Client Component directly without `dynamic()` (if causing build/runtime issues).
3. Await params in Next.js 14 App Router (e.g., `const { token } = await params`).
4. Unique `key` props in `.map()`.
5. Replace `any` types causing strict mode errors with proper types or `unknown`.
6. Add `!` assertions to environment variables used on the server if missing.
7. Ensure all page files have `export default`.
8. Break any circular imports.
9. Runtime Crash Prevention:
   - Use optional chaining for arrays (`array?.[0]`) and data properties (`data?.property`).
   - Wrap `JSON.parse()` in `try/catch`.
   - Replace `supabase.auth.getSession()` with `supabase.auth.getUser()`.
   - Provide empty state UI for pages that fetch data (never crash on empty data).
   - Ensure pages still render after `console.error` logs.
10. Document Upload:
    - Change document upload error message to: "Upload failed. This may work after deployment. Please try again after deploying to Vercel."
    - Add upload timeout handling.
    - Ensure "Skip for now" always works even if upload fails.

## 2026-06-28T11:46:56Z
Perform the runtime and component audit under c:\Users\i_m_s\Downloads\medilink_pro. Your working directory is c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_audit_3_gen5\.
Please read c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_audit_3_gen5\ORIGINAL_REQUEST.md, c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_audit_3_gen5\BRIEFING.md, and c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_audit_3_gen5\progress.md.
Perform the audit, scan for the issues in ORIGINAL_REQUEST.md, and write your findings to handoff.md in your working directory.
Report back when done.
