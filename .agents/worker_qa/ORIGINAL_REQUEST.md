## 2026-07-01T11:08:44Z
You are teamwork_preview_worker. Your working directory is c:\Users\i_m_s\Downloads\medilink_pro\.agents\worker_qa.
Your task is to implement the following changes in the codebase:
1. Profile Setup wizard changes (as detailed in c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_qa_1\handoff.md).
2. Rescue page rewrite (as detailed in c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_qa_2\handoff.md; you can directly copy the code from c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_qa_2\proposed_page.tsx into app/rescue/[token]/page.tsx).
3. QR URL domain fixes and global polish (as detailed in c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_qa_3\handoff.md; this includes updating qr-generator, dashboard page, settings page, QRCodeDisplay, and adding the error boundary files app/error.tsx and app/(protected)/error.tsx, optional chaining, and useEffect async try/catch wraps).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

After applying these changes:
1. Run `npx tsc --noEmit` to verify type safety.
2. Run `npm run build` to verify the build succeeds with 0 errors and 0 warnings.
3. Write your handoff report to handoff.md in your working directory, detailing the changes made, the exact terminal output from the build and tsc checks, and how you verified your changes.
