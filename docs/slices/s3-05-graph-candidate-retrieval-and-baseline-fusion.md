# S3-05 — Graph candidate retrieval and baseline fusion

## Module
`fusion`

## What to build
Implement one graph query and a documented simple fusion baseline for candidates from SQL, vector, and graph retrieval.

## Acceptance criteria
- [ ] Graph retrieval returns stable IDs and source metadata.
- [ ] Fusion deduplicates candidates deterministically.
- [ ] A fixture verifies ranking tie-break behavior.
- [ ] Baseline strategy is documented for later fair comparison.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not implement the adaptive planner in this slice.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member B primary; Member A reviews data authority, SQL integration, and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
