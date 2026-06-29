# Find Nearby Hospitals Feature Plan

## Objective
Add a "Find Nearby Hospitals" emergency button to the bottom of the rescue page (`app/rescue/[token]/page.tsx`). The button must be a Server Component compatible link (`<a>` tag with target="_blank"), responsive & premium UI, styled as a prominent emergency action, using a lucide-react icon, without using client-side hooks, and verify everything passes build and tests, then push to GitHub.

## Steps
1. **Explore & Analyze**: Spawn 3 Explorer agents to look at `app/rescue/[token]/page.tsx` and identify exactly where to place the button and what premium/emergency style classes and Lucide icons are used.
2. **Decompose & Plan**: Write `PROJECT.md` specifying the interface/UI design changes.
3. **Execute**: Spawn 1 Worker to implement the changes and verify it builds.
4. **Verify**: Spawn 2 Reviewers, 2 Challengers, and 1 Forensic Auditor to verify functionality, SSR constraints, code styling, and ensure no integrity issues.
5. **Release**: Push to `origin main` using the specified commit message.
