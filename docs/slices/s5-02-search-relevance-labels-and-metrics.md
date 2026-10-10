# S5-02 — Search relevance labels and metrics

## Module
`benchmark`

## What to build
Create relevance judgments for a manageable query set and implement search-quality metrics.

## Acceptance criteria
- [ ] Judgment method and limitations are documented.
- [ ] Precision@K, Recall@K, and NDCG@K are unit-tested against hand-calculated fixtures.
- [ ] Missing judgments are handled consistently.
- [ ] All methods are evaluated on the same query set.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not fabricate relevance labels or report metrics without a defined ground truth.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member A primary; Member B reviews integration and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
