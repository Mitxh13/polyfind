# S3-03 — Vector semantic search adapter

## Module
`semantic-retrieval`

## What to build
Implement semantic candidate retrieval through the selected vector-store adapter.

## Acceptance criteria
- [ ] A fixed query fixture returns expected candidate IDs within documented tolerances.
- [ ] Structured metadata filters work where supported or are applied safely after retrieval.
- [ ] Latency and result count are exposed for benchmark instrumentation.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not add a second vector backend.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member B primary; Member A reviews data authority, SQL integration, and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
