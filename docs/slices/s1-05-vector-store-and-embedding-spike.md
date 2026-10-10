# S1-05 — Vector-store and embedding spike

## Module
`semantic-retrieval`

## What to build
Compare a small set of candidate vector stores and embedding options, then update ADR-003 with evidence.

## Acceptance criteria
- [ ] Candidates are tested against the same small fixture.
- [ ] Filtering, update/delete, local setup, and reproducibility are recorded.
- [ ] One backend and embedding approach are selected or a concrete blocker is documented.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not integrate multiple vector databases into v1.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member B primary; Member A reviews data authority, SQL integration, and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
