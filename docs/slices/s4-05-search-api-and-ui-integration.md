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
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not expose secrets, internal topology, or unrestricted benchmark execution.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Shared; assign one driver before work begins.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
