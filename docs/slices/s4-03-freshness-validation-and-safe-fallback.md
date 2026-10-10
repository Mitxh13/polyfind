# S4-03 — Freshness validation and safe fallback

## Module
`retrieval-planner`

## What to build
Implement freshness checks for derived candidates and authoritative validation for sensitive fields.

## Acceptance criteria
- [ ] A stale derived version is detected in deterministic tests.
- [ ] Price/stock shown to users are validated against MySQL or a documented trustworthy mechanism.
- [ ] If validation cannot be completed, the behavior is explicit and tested.
- [ ] Freshness violations are counted in benchmark output.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not silently present stale data as current.

## Human review required?
Yes — this slice changes data authority, freshness behavior, or benchmark claims; obtain teammate review before merge.

## Ownership
Shared; assign one driver before work begins.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
