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
Use the prerequisite/interface contract below and review `docs/ARCHITECTURE.md` plus the relevant sprint plan. Do not wait for unrelated upstream implementation when fixtures or mocks are sufficient.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not claim optimal indexing without measurements.

## Human review required?
Yes — this slice changes data authority, freshness behavior, or benchmark claims; obtain teammate review before merge.

## Ownership
The directly responsible owner listed below is accountable for implementation, tests, acceptance evidence, and the slice PR. The other member may review without becoming a co-owner.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues

## Single-owner assignment and parallel execution

- **Directly responsible owner:** Member A.
- **Deliverable:** Constraint/index decisions and transaction/integrity tests.
- **Prerequisite/interface contract:** Schema draft and transactional invariants; tests can precede full integration.
- **Parallel-work rule:** Start with agreed contracts, fixtures, mocks, or stub adapters. Do not wait for another implementation if the interface can be agreed and tested independently.
- **Completion evidence:** Meet the original acceptance criteria, add/update tests, record commands and results, and note limitations in the PR.
- **Ownership rule:** This slice has one owner only. The other member may review but is not a co-owner. Preserve the existing slice ID.
