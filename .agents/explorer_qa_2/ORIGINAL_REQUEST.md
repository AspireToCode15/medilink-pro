## 2026-07-01T11:02:11Z
You are teamwork_preview_explorer. Your working directory is c:\Users\i_m_s\Downloads\medilink_pro\.agents\explorer_qa_2.
Your task is to analyze the rescue page implementation in `app/rescue/[token]/page.tsx` and detail how to completely rewrite it:
1. Make it a pure React Server Component (RSC) with `force-dynamic`.
2. Securely use Supabase service role client (with autoRefreshToken: false, persistSession: false) to fetch profiles and emergency contacts.
3. Wrap the entire page in a try/catch block with dark background (#080B14) fallback UI and red text ("Invalid or expired QR code").
4. Maintain all existing features: decrypt phone numbers server-side, masked numbers, WhatsApp share, first-aid hints, and responsive design down to 320px.
Identify the code modifications needed. Write your findings and proposed changes to `handoff.md` in your working directory. Ensure you run no build/test/code changes yourself.
