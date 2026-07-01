# Plan: MediLink CEO-Level QA Audit

## Objective
Execute a final CEO-level QA audit of the MediLink application, resolving critical profile navigation, rescue page, and QR domain issues, global polishing, rigorous verification (tsc, build, manual checklists, forensic auditing), and deployment.

## Milestones
1. **Decompose & Plan**: Establish the live PROJECT.md detailing the architecture and contract changes for Profile Form, Rescue Page, QR domain and Global Polishing.
2. **Codebase Exploration**: Run Explorers to identify file structures, component hook usage, Supabase client setups, and scan for any global polishing opportunities.
3. **Execution & Implementation**: Use Workers to implement form navigation with validation, rewrite the Rescue Page as a dynamic RSC with try/catch fallback, update QR code domain references dynamically, and polish the codebase.
4. **Verification**: Deploy Reviewers, Challengers, and Forensic Auditors to verify code correctness, SSR safety, type safety, build outputs, and integrity.
5. **CEO Demo Checklist Verification**: Perform empirical manual checks.
6. **Deployment**: Commit and push changes to origin main with message "Final QA fixes - CEO demo ready".

## Steps
1. Update `PROJECT.md` with the new design details.
2. Update `progress.md`.
3. Spawn Explorer agents to inspect implementation paths and suggest exact fixes.
4. Spawn Worker to implement fixes.
5. Spawn Reviewers, Challengers, and Auditor to verify.
6. Run build verification.
7. Push to git.
