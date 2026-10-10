# S4-02 — Redis cache with version-aware invalidation

## Module
`cache`

## What to build
Cache selected query results or query signals with explicit TTL and source-version metadata.

## Acceptance criteria
- [ ] Cache keys include all result-affecting filters/query parameters.
- [ ] Version changes invalidate, bypass, or mark affected entries according to the policy.
- [ ] Cache hit/miss and invalidation counts are observable.
- [ ] Tests cover expiry and update-after-cache behavior.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not cache unverified price/stock as authoritative current values.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member B primary; Member A reviews data authority, SQL integration, and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
