# S2-02 — Seed dataset and data validation

## Module
`catalog`

## What to build
Create a reproducible seed dataset with stable IDs, field distributions, and documented source/license.

## Acceptance criteria
- [ ] Seed generation is deterministic for a recorded seed.
- [ ] Invalid rows and duplicate identifiers are detected.
- [ ] Dataset source and license/provenance are documented.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not use personal or restricted data.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member A primary; Member B reviews integration and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
