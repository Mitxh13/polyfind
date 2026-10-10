# S1-04 — Architecture contracts and module skeleton

## Module
`foundation`

## What to build
Create module boundaries and typed interfaces for catalog, search, retrieval adapters, freshness, and benchmark configuration.

## Acceptance criteria
- [ ] Module ownership matches `docs/ARCHITECTURE.md`.
- [ ] Search request and response contracts have typed definitions.
- [ ] A basic health endpoint or equivalent local smoke check is available.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not implement full retrieval logic in this slice.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Shared; assign one driver before work begins.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
