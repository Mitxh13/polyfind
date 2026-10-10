# S3-02 — Embedding generation and vector ingestion

## Module
`semantic-retrieval`

## What to build
Generate embeddings for the chosen text fields and ingest stable IDs plus source versions.

## Acceptance criteria
- [ ] Embedding model/provider and preprocessing are documented.
- [ ] Ingestion is repeatable and handles updates/deletes.
- [ ] Each vector record stores a stable entity ID and source version where supported.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not claim embeddings are novel or universally superior.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Member B primary; Member A reviews data authority, SQL integration, and tests.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
