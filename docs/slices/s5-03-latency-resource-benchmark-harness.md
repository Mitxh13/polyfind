# S5-03 — Latency/resource benchmark harness

## Module
`benchmark`

## What to build
Measure end-to-end and per-store timing, query counts, and available resource metrics.

## Acceptance criteria
- [ ] Median and p95 latency are reported with run count.
- [ ] Warm/cold cache state and hardware/software versions are recorded.
- [ ] Baseline and proposed policy share the same workload.
- [ ] Raw measurements are exported in machine-readable form.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not compare runs with undocumented configuration differences.

## Human review required?
Yes — this slice changes data authority, freshness behavior, or benchmark claims; obtain teammate review before merge.

## Ownership
Member A primary; Member B reviews integration and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
