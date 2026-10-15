# S1-05 — Vector-store and embedding spike

## Module
`semantic-retrieval`

## What to build
Compare a small set of candidate vector stores and embedding options, then update ADR-003 with evidence.

## Acceptance criteria
- [ ] Candidates are tested against the same small fixture.
- [ ] Filtering, update/delete, local setup, and reproducibility are recorded.
- [ ] One backend and embedding approach are selected or a concrete blocker is documented.

## Dependencies
Use the prerequisite/interface contract below and review `docs/ARCHITECTURE.md` plus the relevant sprint plan. Do not wait for unrelated upstream implementation when fixtures or mocks are sufficient.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not integrate multiple vector databases into v1.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
The directly responsible owner listed below is accountable for implementation, tests, acceptance evidence, and the slice PR. The other member may review without becoming a co-owner.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues

## Single-owner assignment and parallel execution

- **Directly responsible owner:** Member B.
- **Deliverable:** Evidence-based vector/embedding decision or documented unresolved decision.
- **Prerequisite/interface contract:** Evaluation criteria; use a synthetic fixture independently of the catalog.
- **Parallel-work rule:** Start with agreed contracts, fixtures, mocks, or stub adapters. Do not wait for another implementation if the interface can be agreed and tested independently.
- **Completion evidence:** Meet the original acceptance criteria, add/update tests, record commands and results, and note limitations in the PR.
- **Ownership rule:** This slice has one owner only. The other member may review but is not a co-owner. Preserve the existing slice ID.
