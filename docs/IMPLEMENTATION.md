# PolyFind — Implementation Guide

> A comprehensive reference covering how the project is built, how the 30 slices are distributed across 6 sprints, and which team member owns each piece of work.

---

## 1. What PolyFind Is

**PolyFind: Freshness-Constrained Adaptive Retrieval Across Heterogeneous Databases**

PolyFind is a research prototype and working search application that investigates a core question in multi-database systems: *can a retrieval planner — informed by query characteristics, data-version/freshness signals, and measured execution costs — improve the balance between search relevance, freshness correctness, latency, and resource use?*

The project is not a production marketplace. It is a DBMS capstone designed to exercise relational transactions, caching, graph queries, vector retrieval, query planning, cross-store consistency, and measurable experiments — all within a reproducible local setup.

---

## 2. Research Hypothesis

| Aspect | Detail |
|---|---|
| **Problem** | Search apps that combine SQL, cache, graph, and vector stores create a coordination challenge: derived data lags behind authoritative updates, retrieval paths differ in cost, and fusing results across stores risks serving stale transactional values (price, stock). |
| **Hypothesis** | A freshness-aware adaptive planner can reduce stale-result violations and latency/resource cost compared with fixed-routing and TTL-only baselines, without an unacceptable drop in search relevance. |
| **Novelty status** | **Hypothesis only** — the literature gap must be established through a full related-work matrix before any novelty claim is made. |
| **Research questions** | (1) Can version-aware validation reduce freshness violations vs TTL-only? (2) Can adaptive routing reduce latency/query work? (3) How do update frequency and sync delay shift quality/freshness/latency trade-offs? (4) How does the system degrade when a derived store is unavailable? |

---

## 3. Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js + TypeScript | Search UI, filters, diagnostic view |
| Authoritative store | **MySQL** | Single source of truth for all transactional fields (price, stock, product identity) |
| Cache | **Redis** | Selected cacheable results and query signals with version-aware invalidation |
| Relationship retrieval | **Neo4j** | Product/entity graph for related-candidate retrieval |
| Semantic retrieval | **One vector database** (selected in Sprint 1) | Embedding-based candidate retrieval via a replaceable adapter |
| Embeddings | Provider/model selected in Sprint 1 | Text embedding for catalog fields |
| Testing | Unit + integration + benchmark harness | Reproducible workloads, metrics, and raw-artifact export |
| Hosting | Local development only | No cloud deployment in v1 |

---

## 4. System Architecture

```
User
 │
 ▼
Next.js UI
 │
 ▼
Search API / Orchestrator
 │
 ▼
Freshness-aware Retrieval Planner
 ├──────────────────────┬──────────────────────┬──────────────────────┐
 ▼                      ▼                      ▼                      ▼
MySQL              Redis Cache             Neo4j Graph           Vector DB
(source of truth)  (signals/results)       (relationships)       (semantic)
 │                      │                      │                      │
 └──────────────────────┴──────────────────────┴──────────────────────┘
                                   │
                                   ▼
                      Validate · Deduplicate · Fuse · Rank
                                   │
                                   ▼
                            Search API Response
                                   │
                                   ▼
                              Next.js UI

Sync pipeline (MySQL → Redis / Neo4j / Vector DB):
MySQL ──SYNC──► Redis (version-tagged)
MySQL ──SYNC──► Neo4j (idempotent, version-tagged)
MySQL ──SYNC──► Vector DB (stable entity ID + source version)
```

### Data Authority Rule

MySQL is the **only** authoritative source for transactional fields (price, stock). Redis, Neo4j, and the vector database are derived / retrieval-supporting representations. They may improve retrieval quality but **must never silently override** an authoritative MySQL value. If freshness cannot be verified, the system must either read MySQL or return a clearly defined degraded response.

---

## 5. Module Map and Ownership

| Module | Description | Primary Owner |
|---|---|---|
| `catalog` | Authoritative product/category CRUD, SQL constraints, transactional updates | **Member A** |
| `search-api` | Request validation, response contract, pagination, error handling | **Shared** |
| `retrieval-planner` | Selects retrieval paths by query class, freshness requirement, observed cost | **Shared** |
| `cache` | Redis keys, TTLs, version metadata, invalidation and bypass rules | **Member B** |
| `graph-retrieval` | Neo4j graph schema, relationship queries, candidate generation | **Member B** |
| `semantic-retrieval` | Embedding generation, vector adapter, candidate generation | **Member B** |
| `sync` | Propagates MySQL changes to derived stores; tracks versions, retries, failures | **Shared** |
| `fusion` | Candidate normalization, deduplication, filtering, ranking, explanation signals | **Shared** |
| `benchmark` | Deterministic workloads, baselines, metrics, experiment config, result export | **Member A** |
| `web-ui` | Search controls, results, filters, freshness/diagnostic development view | **Shared** |
| `auth` | Only if authentication is approved in a later decision | TBD |

---

## 6. Key Architectural Decisions (ADRs)

### ADR-001 — MySQL Is the Authoritative Store *(Accepted)*
MySQL holds the correctness boundary for product identity and transactional fields. All other stores are derived. Search results must validate freshness-sensitive fields against MySQL or a trustworthy version mechanism. Benchmarks must report the cost of correctness checks.

### ADR-002 — Explicit Freshness Contracts *(Proposed — confirm before implementing)*
Freshness policies are defined per data class, not via a single universal TTL. At minimum, transactional fields (price/stock) are separated from descriptive/search signals. This makes freshness violations directly measurable.

### ADR-003 — Select One Vector Store *(Decision due Sprint 1)*
One vector database is selected after a short spike (S1-05) comparing local setup, metadata filtering, update/delete behavior, integration effort, licensing, and benchmark observability. Application code must stay behind a thin adapter to keep the backend replaceable.

---

## 7. Branch, Commit, and PR Conventions

| Item | Pattern |
|---|---|
| Branch | `feature/S1-01-repository-baseline` or `fix/S3-02-version-metadata` |
| Commit | `[S1-01] Establish repository baseline` |
| PR title | `[S1-01] Establish repository baseline` |
| PR description | Must include: slice ID · acceptance criteria checked · tests run · limitations |

### Human Review Required For
- Authentication/authorization changes
- Destructive migrations or data deletion
- Infrastructure, CI/CD, deployment, or secrets configuration
- Changes to source-of-truth semantics or freshness guarantees
- Changes to benchmark methodology that could affect reported research results

---

## 8. Sprint and Slice Plan — Full Breakdown

There are **6 sprints** and **30 slices** in total. Each sprint depends on the previous one passing its exit criteria.

---

### Sprint 1 — Research and Foundation
**Goal:** Create a reproducible project baseline and lock key contracts before feature work.

| Slice | Title | Module | Owner | Notes |
|---|---|---|---|---|
| S1-01 | Repository and contributor workflow | `foundation` | **Shared** | Branch/PR conventions, README navigation, issue traceability |
| S1-02 | Requirements and research-gap review | `research` | **Shared** | PRD open questions, hypothesis labels, literature-matrix template |
| S1-03 | Local development configuration | `foundation` | **Shared** | `.env.example`, setup docs for MySQL/Redis/Neo4j/vector, fail-clear on missing vars |
| S1-04 | Architecture contracts and module skeleton | `foundation` | **Shared** | Module boundaries, typed interfaces, health endpoint |
| S1-05 | Vector-store and embedding spike | `semantic-retrieval` | **Member B** (A reviews) | Compare vector-store candidates, update ADR-003 with evidence |

**Sprint 1 exit:** All 5 slices checked, unresolved blockers recorded, ADR-003 decision made.

---

### Sprint 2 — Authoritative Catalog
**Goal:** Implement reliable catalog data and transactions in MySQL.

| Slice | Title | Module | Owner | Notes |
|---|---|---|---|---|
| S2-01 | Relational schema and migrations | `catalog` | **Member A** (B reviews) | MySQL schema: Product, Category, ProductVersion; PKs, FKs, nullability, domain constraints |
| S2-02 | Seed dataset and data validation | `catalog` | **Member A** (B reviews) | Deterministic seed with stable IDs; documented source/license; duplicate/invalid-row detection |
| S2-03 | Catalog CRUD API | `catalog` | **Member A** (B reviews) | Create/read/update/list with parameterized SQL; safe 4xx errors; integration tests |
| S2-04 | Constraints, indexes, and transaction tests | `catalog` | **Member A** (B reviews) ⚠️ | Atomic versioned price/stock updates; FK tests; EXPLAIN baseline; **human review required** |
| S2-05 | Minimal catalog UI and structured filters | `web-ui` | **Shared** | Next.js browse/filter page; loading/empty/error states; calls API only |

**Sprint 2 exit:** MySQL schema proven on a clean database; CRUD and transaction tests pass; basic UI renders.

---

### Sprint 3 — Retrieval Paths
**Goal:** Add semantic and graph retrieval behind explicit adapters and stable IDs.

| Slice | Title | Module | Owner | Notes |
|---|---|---|---|---|
| S3-01 | Retrieval interfaces and candidate schema | `retrieval-planner` | **Shared** | Shared candidate format (stable ID + source tag); adapter interface; deduplication unit test |
| S3-02 | Embedding generation and vector ingestion | `semantic-retrieval` | **Member B** (A reviews) | Documented model/preprocessing; repeatable ingestion; vector record carries entity ID + source version |
| S3-03 | Vector semantic search adapter | `semantic-retrieval` | **Member B** (A reviews) | Semantic candidate retrieval; fixture-validated IDs; latency/count exposed for benchmarking |
| S3-04 | Neo4j graph schema and synchronization | `graph-retrieval` | **Member B** (A reviews) | Node/relationship definitions; idempotent sync; observable sync lag/failures |
| S3-05 | Graph candidate retrieval and baseline fusion | `fusion` | **Member B** (A reviews) | One graph query; simple deterministic fusion baseline (SQL + vector + graph); deduplication tested |

**Sprint 3 exit:** Vector and graph retrieval return stable-ID candidates; fusion baseline is documented and deterministic.

---

### Sprint 4 — Freshness and Adaptive Coordination
**Goal:** Make cross-store freshness visible and implement first planner baselines.

| Slice | Title | Module | Owner | Notes |
|---|---|---|---|---|
| S4-01 | Version metadata and update events | `sync` | **Shared** | Product changes advance a version; idempotent retry; failed updates observable |
| S4-02 | Redis cache with version-aware invalidation | `cache` | **Member B** (A reviews) | Keys include all result-affecting params; version-change invalidation policy; hit/miss/invalidation counts observable |
| S4-03 | Freshness validation and safe fallback | `retrieval-planner` | **Shared** ⚠️ | Stale-version detection; price/stock validated against MySQL; explicit tested fallback; violations counted; **human review required** |
| S4-04 | Fixed-routing and adaptive planner baselines | `retrieval-planner` | **Shared** ⚠️ | Fixed multi-store baseline + first adaptive policy; logged decisions; same-workload comparison; no held-out tuning; **human review required** |
| S4-05 | Search API and UI integration | `search-api` | **Shared** | Text + structured-filter search end-to-end; freshness/strategy metadata in response; dev diagnostics protected |

**Sprint 4 exit:** Freshness violations are detectable and counted; planner baselines can both run on the same workload; search API is functional end-to-end.

---

### Sprint 5 — Evaluation and Robustness
**Goal:** Build controlled workloads and measure the proposed approach against baselines.

| Slice | Title | Module | Owner | Notes |
|---|---|---|---|---|
| S5-01 | Deterministic query and update workload | `benchmark` | **Member A** (B reviews) | Replayable workload config (size, query mix, update rate, delay, seed); low/medium/high update regimes |
| S5-02 | Search relevance labels and metrics | `benchmark` | **Member A** (B reviews) | Relevance judgments; Precision@K, Recall@K, NDCG@K unit-tested against hand-calculated fixtures |
| S5-03 | Latency/resource benchmark harness | `benchmark` | **Member A** (B reviews) ⚠️ | Median + p95 latency; warm/cold cache state recorded; machine-readable raw export; **human review required** |
| S5-04 | Ablation and delayed-update experiments | `benchmark` | **Member A** (B reviews) ⚠️ | Disable one signal at a time; freshness violation rate + update visibility delay measured; negative results kept; **human review required** |
| S5-05 | Failure injection, regression, and security review | `reliability` | **Shared** ⚠️ | Redis/Neo4j/vector unavailability tests; authoritative-field protection verified; no secrets in logs; **human review required** |

**Sprint 5 exit:** Benchmark harness produces machine-readable results; all baselines compared; regression suite passes; security reviewed.

---

### Sprint 6 — Analysis and Submission
**Goal:** Produce reproducible results, documentation, and a clear final demonstration.

| Slice | Title | Module | Owner | Notes |
|---|---|---|---|---|
| S6-01 | Repeated runs and statistical summaries | `benchmark` | **Member A** (B reviews) | Run count + summary method documented; variability reported (not just best-case); reproducible from config |
| S6-02 | Baseline comparison and result visualization | `benchmark` | **Member A** (B reviews) | Tables/plots: relevance, freshness, latency, resource cost; trade-offs visible; no metric cherry-picking |
| S6-03 | Research claims, limitations, and related-work matrix | `research` | **Shared** ⚠️ | Verified bibliographic details; established/proposed/measured findings distinguished; novelty scoped to evidence; **human review required** |
| S6-04 | Final report, setup guide, and demo script | `docs` | **Shared** | Clean-checkout setup; demo covers structured/semantic/graph search, stale-update scenario, benchmark output; failures and limitations included |
| S6-05 | Final acceptance, clean-room setup, and viva preparation | `release` | **Shared** | Team member who did not implement the setup follows README successfully; PRD criteria mapped to evidence; viva notes cover design, baselines, metrics, research limits |

**Sprint 6 exit:** All PRD success criteria mapped and verified; demo is reproducible; report is complete.

---

## 9. Work Division Summary

### Member A — Relational Data, Correctness, and Benchmarking Lead

**Primary slices (10):**

| Sprint | Slices |
|---|---|
| Sprint 2 | S2-01, S2-02, S2-03, S2-04 |
| Sprint 5 | S5-01, S5-02, S5-03, S5-04 |
| Sprint 6 | S6-01, S6-02 |

**Domain responsibilities:**
- MySQL schema design, migrations, and transactional correctness
- Seed dataset creation and data validation
- Catalog CRUD API with parameterized SQL
- Atomic price/stock updates with version tracking
- Benchmark harness design and execution
- Relevance metric implementation (Precision@K, Recall@K, NDCG@K)
- Latency measurement (median/p95) and hardware-condition recording
- Ablation experiments with negative-result retention
- Statistical summaries and result visualization
- Reviewer for Sprint 5 and 6 slices driven by Member B

**Reviews:** S1-05 · S3-02 · S3-03 · S3-04 · S3-05 · S4-02 · S5-01–S5-04 (cross-review with B)

---

### Member B — Cache, Graph, Semantic Retrieval, and Fusion Lead

**Primary slices (6):**

| Sprint | Slices |
|---|---|
| Sprint 1 | S1-05 |
| Sprint 3 | S3-02, S3-03, S3-04, S3-05 |
| Sprint 4 | S4-02 |

**Domain responsibilities:**
- Vector store evaluation and ADR-003 decision
- Embedding model/provider selection and documentation
- Vector record ingestion pipeline (stable IDs + source versions)
- Semantic search adapter behind the retrieval interface
- Neo4j graph schema and idempotent synchronization
- Graph candidate retrieval
- Baseline fusion algorithm (deduplicate, rank, explain)
- Redis cache design with version-aware invalidation
- Cache hit/miss/invalidation observability
- Reviewer for Sprint 2 slices and SQL integration

**Reviews:** S2-01 · S2-02 · S2-03 · S2-04 · S3-01 (as co-owner) · S6-01 · S6-02 (cross-review with A)

---

### Shared Slices (14)

Both members co-own the following slices. Assign a **driver** before work begins on each one to avoid ambiguity.

| Slice | Title | Sprint | ⚠️ Human Review? |
|---|---|---|---|
| S1-01 | Repository and contributor workflow | 1 | — |
| S1-02 | Requirements and research-gap review | 1 | — |
| S1-03 | Local development configuration | 1 | — |
| S1-04 | Architecture contracts and module skeleton | 1 | — |
| S2-05 | Minimal catalog UI and structured filters | 2 | — |
| S3-01 | Retrieval interfaces and candidate schema | 3 | — |
| S4-01 | Version metadata and update events | 4 | — |
| S4-03 | Freshness validation and safe fallback | 4 | ⚠️ Yes |
| S4-04 | Fixed-routing and adaptive planner baselines | 4 | ⚠️ Yes |
| S4-05 | Search API and UI integration | 4 | — |
| S5-05 | Failure injection, regression, and security review | 5 | ⚠️ Yes |
| S6-03 | Research claims, limitations, and related-work matrix | 6 | ⚠️ Yes |
| S6-04 | Final report, setup guide, and demo script | 6 | — |
| S6-05 | Final acceptance, clean-room setup, and viva preparation | 6 | — |

---

## 10. Slice Count by Member

| Owner | Slices | % of 30 |
|---|---|---|
| Member A primary | 10 | 33 % |
| Member B primary | 6 | 20 % |
| Shared (both) | 14 | 47 % |
| **Total** | **30** | **100 %** |

> The workload is balanced when shared slices are split evenly. Member A's primary work is heavier in data/benchmarking; Member B's primary work is heavier in retrieval/integration. The 14 shared slices — covering foundations, API, planner, sync, and final submission — require active collaboration throughout.

---

## 11. Slices Requiring Human Review Before Merge

These 8 slices touch data authority, freshness guarantees, or benchmark methodology. **Both members must approve before merge.**

| Slice | Reason |
|---|---|
| S2-04 | Modifies transactional update semantics |
| S4-03 | Changes freshness validation behavior |
| S4-04 | Changes planner and benchmark comparison baseline |
| S5-03 | Changes benchmark measurement methodology |
| S5-04 | Changes ablation/experiment design |
| S5-05 | Security review; failure-mode behavior |
| S6-03 | Research claims and novelty wording |

---

## 12. Evaluation Plan

### Baselines to Compare
1. MySQL-only structured retrieval (no derived stores)
2. Fixed multi-store retrieval (SQL + cache + graph + vector, no freshness decisions)
3. Fixed hybrid retrieval without freshness-aware decisions
4. TTL-only cache policy
5. **Proposed:** freshness-constrained adaptive planner

### Metrics to Report

| Category | Metrics |
|---|---|
| Search quality | Precision@K · Recall@K · NDCG@K |
| Freshness | Freshness violation rate · Update visibility delay |
| Performance | Median latency · p95 latency · Throughput · DB operations per query |
| Robustness | Recovery behavior when a derived store is unavailable |

### Reproducibility Requirements
- Pin all library versions
- Seed all generated data and workloads
- Record hardware, dataset, query mix, update rate, cache state, and run repetitions with every result
- Export raw measurements in machine-readable form alongside every summary
- Retain negative and inconclusive results

---

## 13. Environment Variables Reference

```env
# App
NODE_ENV=development
APP_URL=http://localhost:3000

# MySQL (authoritative)
DATABASE_URL=mysql://polyfind:change-me@localhost:3306/polyfind

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=change-me

# Vector database (backend selected in S1-05)
VECTOR_STORE_PROVIDER=
VECTOR_STORE_URL=
VECTOR_STORE_API_KEY=

# Embeddings (model selected and documented in S1-05)
EMBEDDING_PROVIDER=
EMBEDDING_MODEL=
EMBEDDING_API_KEY=

# Application secret
AUTH_SECRET=replace-with-local-random-secret
```

> Never commit real values. The application must fail with a clear error message when a required variable is missing.

---

## 14. API Contract

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/health` | — | `{ status }` |
| GET | `/api/products` | `q?, category?, minPrice?, maxPrice?, page?, limit?` | `{ items, page, total }` |
| GET | `/api/products/:id` | — | `{ item }` |
| POST | `/api/products` | product fields (dev/admin only) | `{ item }` |
| PATCH | `/api/products/:id` | changed fields + expected version | `{ item, version }` |
| POST | `/api/search` | `{ query, filters, freshnessMode?, limit? }` | `{ items, strategy, timings, freshness }` |
| POST | `/api/benchmark/run` | workload/config identifier (dev only) | `{ runId, status }` |
| GET | `/api/benchmark/results/:runId` | — | `{ config, metrics, artifacts }` |

> Benchmark endpoints must not be exposed in any public deployment. All paths and shapes are implementation contracts — align code and tests before external use.

---

## 15. What Is Out of Scope

- Production-scale marketplace, payment processing, or live pricing integrations
- Guaranteeing global strong consistency across all stores (explicit freshness contracts instead)
- Training a new embedding model or claiming a novel embedding approach
- Multiple simultaneous vector databases in v1
- Cloud deployment, paid APIs, or production SSO (unless explicitly approved)
- CI/CD pipelines, Docker, or cloud infrastructure (unless a slice explicitly authorizes them)
- Adding new features during final acceptance (S6-05)

---

## 16. How to Start

1. Read `AGENTS.md` — the operating rules for every slice.
2. Read this document and `docs/PRD.md` — scope and success criteria.
3. Read `docs/ARCHITECTURE.md` and the three ADRs.
4. Begin Sprint 1: assign a driver for S1-01, then work through slices in order.
5. Execute one slice at a time. Read the slice file, its sprint file, the PRD, and any relevant ADR before writing code.
6. Never skip a slice's acceptance criteria — they are the test contract.
7. Record blockers explicitly rather than silently changing scope.
