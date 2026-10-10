# S4-04 — Fixed-routing and adaptive planner baselines

## Module
`retrieval-planner`

## What to build
Implement a fixed multi-store baseline and a first adaptive policy using documented query classes, freshness requirements, and measured costs.

## Acceptance criteria
- [ ] Planner decisions are logged with non-sensitive reason codes.
- [ ] Fixed and adaptive modes can be run on the same workload.
- [ ] The adaptive policy is deterministic given the same configuration and observations.
- [ ] Decision logic and thresholds are documented before final evaluation.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not tune thresholds on the held-out evaluation workload.

## Human review required?
Yes — this slice changes data authority, freshness behavior, or benchmark claims; obtain teammate review before merge.

## Ownership
Shared; assign one driver before work begins.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
