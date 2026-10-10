# S5-04 — Ablation and delayed-update experiments

## Module
`benchmark`

## What to build
Evaluate component contribution and sensitivity to freshness delays/update rates.

## Acceptance criteria
- [ ] Experiments disable one decision signal/mechanism at a time.
- [ ] Freshness violation rate and update visibility delay are measured.
- [ ] Results include uncertainty/variation across repeated runs.
- [ ] Negative or inconclusive results are retained.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not remove unfavorable runs without a documented exclusion rule.

## Human review required?
Yes — this slice changes data authority, freshness behavior, or benchmark claims; obtain teammate review before merge.

## Ownership
Member A primary; Member B reviews integration and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
