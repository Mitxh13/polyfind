# PolyFind

PolyFind is a research-oriented multi-database search application exploring freshness-constrained adaptive retrieval across heterogeneous databases.

## Start here
1. Read `AGENTS.md`.
2. Read `docs/research.md`.
3. Review and approve `docs/PRD.md`.
4. Review `docs/ARCHITECTURE.md` and the ADRs.
5. Execute one slice at a time from `docs/sprints/` and `docs/slices/`.

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

## Team
- **Member A:** MySQL, relational integrity, SQL/transactions, authoritative-data correctness, benchmarking lead.
- **Member B:** Redis, Neo4j, embeddings/vector retrieval, retrieval fusion lead.
- **Shared:** API/frontend integration, security review, experiment design, docs, demo, and final report.

Member names and deadline are intentionally not assumed.

## Documentation map
- `docs/research.md` — problem framing and related-work audit plan
- `docs/PRD.md` — scope and success criteria
- `docs/ARCHITECTURE.md` — system design and API contract
- `docs/decisions/` — decisions worth recording
- `docs/sprints/` — feature-level implementation chunks
- `docs/slices/` — individually executable, testable tasks
- `AGENTS.md` / `CLAUDE.md` — coding-agent operating rules
