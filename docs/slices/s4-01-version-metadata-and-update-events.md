# S4-01 — Version metadata and update events

## Module
`sync`

## What to build
Add a clear source-version/update event model for derived-store synchronization.

## Acceptance criteria
- [ ] Product changes increment or otherwise advance a documented version.
- [ ] Update events can be retried without applying the same version twice incorrectly.
- [ ] A failed update is observable and can be retried.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not promise instantaneous cross-store consistency.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Shared; assign one driver before work begins.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
