# PolyFind

PolyFind is a research-oriented multi-database search application exploring freshness-constrained adaptive retrieval across heterogeneous databases.

## Start here
1. Read `AGENTS.md`.
2. Read `docs/research.md`.
3. Review and approve `docs/PRD.md`.
4. Review `docs/ARCHITECTURE.md` and the ADRs.
5. Execute one slice at a time from `docs/sprints/` and `docs/slices/`.

## Current repository status

This repository is the planning baseline plus the S1-04 TypeScript contract
layer. It is not yet a complete Next.js application and does not include
database migrations or live integrations. Install the development dependencies
and run the contract checks with `npm install`, `npm test`, and
`npm run typecheck`. Begin with the assigned Sprint 1 slices; do not treat the
placeholder values in `.env.example` as working credentials.

## Current Project direction
**PolyFind: Freshness-Constrained Adaptive Retrieval Across Heterogeneous Databases**

The project investigates whether retrieval decisions informed by query characteristics, source versions/freshness, and observed execution costs can improve the trade-off between search relevance, freshness correctness, latency, and resource usage.

This is a hypothesis to test, not a proven novelty claim. The literature review must be extended and the closest prior systems compared before claiming a research gap.

## Planned stack
- Frontend/application: Next.js + TypeScript
- Authoritative relational store: MySQL
- Cache: Redis
- Relationship retrieval: Neo4j
- Semantic retrieval: one vector database, selected through a documented evaluation
- Testing/benchmarking: automated tests and a reproducible benchmark harness

## Parallel team ownership

- **Member A (17 slices):** S1-01, S1-02, S1-04, S2-01, S2-03, S2-04, S3-01, S3-05, S4-01, S4-03, S4-04, S5-01, S5-02, S5-05, S6-01, S6-03, S6-05.
- **Member B (13 slices):** S1-03, S1-05, S2-02, S2-05, S3-02, S3-03, S3-04, S4-02, S4-05, S5-03, S5-04, S6-02, S6-04.

Every slice has one directly responsible owner; there are no shared/co-owned slices. Both members work in parallel from the beginning using published contracts, fixtures, mocks, and stub adapters. The other member may review a PR without becoming a co-owner. Integration proceeds incrementally and must not block independent work.

## Documentation map
- `docs/research.md` — problem framing and related-work audit plan
- `docs/PRD.md` — scope and success criteria
- `docs/ARCHITECTURE.md` — system design and API contract
- `docs/decisions/` — decisions worth recording
- `docs/sprints/` — feature-level implementation chunks
- `docs/slices/` — individually executable, testable tasks
- `docs/contracts.md` — S1-04 typed boundaries, validation, interfaces, and examples
- `AGENTS.md` — coding-agent operating rules
