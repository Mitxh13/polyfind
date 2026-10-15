# S4-05 — Search API and UI integration

## Module
`search-api`

## What to build
Connect search UI to the orchestrator and show results plus development diagnostics.

## Acceptance criteria
- [ ] Search supports text query and structured filters.
- [ ] Response includes result IDs/ranks and freshness/strategy metadata suitable for testing.
- [ ] UI has loading, empty, and error states.
- [ ] Internal diagnostics are disabled or protected outside local development.

## Dependencies
Use the prerequisite/interface contract below and review `docs/ARCHITECTURE.md` plus the relevant sprint plan. Do not wait for unrelated upstream implementation when fixtures or mocks are sufficient.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not expose secrets, internal topology, or unrestricted benchmark execution.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
The directly responsible owner listed below is accountable for implementation, tests, acceptance evidence, and the slice PR. The other member may review without becoming a co-owner.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues

## Single-owner assignment and parallel execution

- **Directly responsible owner:** Member B.
- **Deliverable:** Search UI wired to the search API with loading/error/empty states.
- **Prerequisite/interface contract:** API/UI contracts; build against mocks before connecting real endpoints.
- **Parallel-work rule:** Start with agreed contracts, fixtures, mocks, or stub adapters. Do not wait for another implementation if the interface can be agreed and tested independently.
- **Completion evidence:** Meet the original acceptance criteria, add/update tests, record commands and results, and note limitations in the PR.
- **Ownership rule:** This slice has one owner only. The other member may review but is not a co-owner. Preserve the existing slice ID.
