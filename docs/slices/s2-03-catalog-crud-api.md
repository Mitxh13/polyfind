# S2-03 — Catalog CRUD API

## Module
`catalog`

## What to build
Implement validated create/read/update/list operations using parameterized SQL.

## Acceptance criteria
- [ ] List supports agreed filters and pagination.
- [ ] Invalid input receives safe 4xx responses.
- [ ] Database errors do not expose credentials or raw stack traces.
- [ ] Integration tests cover CRUD behavior.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not implement public admin access or authentication unless approved.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member A primary; Member B reviews integration and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
