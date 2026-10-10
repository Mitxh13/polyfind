# S3-01 — Retrieval interfaces and candidate schema

## Module
`retrieval-planner`

## What to build
Define a shared candidate format and adapter interface for relational, graph, and vector retrieval.

## Acceptance criteria
- [ ] Every candidate has a stable product/entity ID and source identifier.
- [ ] Adapter errors and timing can be recorded consistently.
- [ ] A unit test verifies deduplication of the same entity from multiple sources.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not encode backend-specific fields into the public API response.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Shared; assign one driver before work begins.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
