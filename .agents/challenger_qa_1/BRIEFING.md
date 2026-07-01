# BRIEFING — 2026-07-01T16:47:07+05:30

## Mission
Empirically challenge and verify step inputs, rescue page (Server Component), and QR domain fallbacks.

## 🔒 My Identity
- Archetype: challenger
- Roles: critic, specialist
- Working directory: c:\Users\i_m_s\Downloads\medilink_pro\.agents\challenger_qa_1
- Original parent: 0c19bcc9-8b56-4e0b-8678-4109ff169d00
- Milestone: QA Challenger
- Instance: 1 of 1

## 🔒 Key Constraints
- Review-only — do NOT modify implementation code.
- Validate step input requirements (e.g. invalid age, empty name on step 1; invalid emergency contacts on step 3) to ensure progression is strictly blocked.
- Ensure rescue page runs as a Server Component and handles errors/missing profiles by returning a dark background fallback page.
- Confirm QR domain fallbacks work correctly.
- Verify type safety with `npx tsc --noEmit` and build with `npm run build`.

## Current Parent
- Conversation ID: 0c19bcc9-8b56-4e0b-8678-4109ff169d00
- Updated: not yet

## Review Scope
- **Files to review**: app/rescue/[profileId]/page.tsx, components/form-wizard (or similar multi-step forms), and QR code generation / domain configuration files.
- **Interface contracts**: PROJECT.md
- **Review criteria**: correctness, type safety, robustness under bad input, fallback behavior.

## Key Decisions Made
- Initiated setup of the challenger role files.

## Artifact Index
- handoff.md — Verification and review results
- progress.md — Liveness heartbeat and step progress

## Attack Surface
- **Hypotheses tested**: [TBD]
- **Vulnerabilities found**: [TBD]
- **Untested angles**: [TBD]

## Loaded Skills
No skills loaded.
