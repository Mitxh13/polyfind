# S2-01 — Relational schema and migrations

## Module
`catalog`

## What to build
Create MySQL schema and repeatable migrations for products, categories, and version metadata.

## Acceptance criteria
- [ ] Schema can be created from an empty local database using documented steps.
- [ ] Primary keys, foreign keys, nullability, and domain constraints are explicit.
- [ ] Migration behavior is tested on a clean database.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not add payment/order tables unless the approved PRD changes.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member A primary; Member B reviews integration and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
