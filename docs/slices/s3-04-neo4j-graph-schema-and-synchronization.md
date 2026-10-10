# S3-04 — Neo4j graph schema and synchronization

## Module
`graph-retrieval`

## What to build
Define graph nodes/relationships and propagate catalogue changes using stable IDs and version-aware update logic.

## Acceptance criteria
- [ ] Graph constraints/indexes are documented where applicable.
- [ ] Repeated sync is idempotent for the same source version.
- [ ] Sync lag and failures can be observed in logs/metrics without secrets.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not treat graph properties as authoritative price/stock.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member B primary; Member A reviews data authority, SQL integration, and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
