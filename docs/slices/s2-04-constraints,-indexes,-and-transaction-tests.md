# S2-04 — Constraints, indexes, and transaction tests

## Module
`catalog`

## What to build
Add relevant indexes and tests for transactional updates and concurrent version changes.

## Acceptance criteria
- [ ] Price/stock updates are atomic and versioned.
- [ ] Foreign-key and validation failures are tested.
- [ ] EXPLAIN plans for selected queries are recorded as a baseline.
- [ ] No stale derived store is treated as authoritative.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not claim optimal indexing without measurements.

## Human review required?
Yes — this slice changes data authority, freshness behavior, or benchmark claims; obtain teammate review before merge.

## Ownership
Member A primary; Member B reviews integration and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
