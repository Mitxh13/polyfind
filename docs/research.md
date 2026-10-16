# Research — PolyFind

## Research direction
**PolyFind: Freshness-Constrained Adaptive Retrieval Across Heterogeneous Databases**

Status: candidate research direction; novelty is not yet established.

## The problem
Search applications increasingly combine relational filtering, cache-based acceleration, graph relationships, and semantic vector retrieval. Maintaining multiple representations creates a coordination problem: derived data may lag behind authoritative updates, retrieval paths have different costs, and results from separate stores must be combined without violating freshness or correctness requirements.

PolyFind will investigate whether a retrieval planner informed by query characteristics, data-version/freshness signals, and observed execution costs can improve the balance between relevance, freshness correctness, latency, and resource use.

## Who has this problem
- Developers building catalog, knowledge, or discovery applications that combine structured and semantic search.
- Data/platform engineers responsible for cache invalidation, derived indexes, and cross-store synchronization.
- Researchers evaluating hybrid retrieval and heterogeneous data systems.

These are target user groups for the project, not evidence of market demand.

## Why now / why this team
The project is suitable for a DBMS capstone because it provides hands-on work with relational transactions, caching, graph queries, vector retrieval, query planning, consistency, and measurable experiments.

## What exists already / preliminary related-work map
Adjacent research areas include:
- Cost-based query planning across heterogeneous data stores.
- Hybrid relational and vector query execution.
- Adaptive selection among symbolic, graph, neural, and hybrid retrieval.
- Cache invalidation and incremental search-index maintenance.
- Freshness-aware caching and consistency/performance trade-offs.
- Graph-enhanced retrieval and vector-search execution optimization.

A preliminary targeted search has surfaced work including *Cost-based Optimization of Multistore Query Plans* (2023), *CHASE: A Native Relational Database for Hybrid Queries* (2025), *SymRAG* (2025), *EA-GraphRAG* (2026), *DYNAMICANN* (2026), and *FreshCache* (2026 preprint). Treat these as leads to verify: confirm exact bibliographic metadata, venue/status, technical method, assumptions, and overlap before citing them in a submission. This list is not a systematic review and does not prove the proposed gap is novel.

### Literature review matrix

The table below audits preliminary lead papers against their technical method, core assumptions, evaluated metrics, limitations, and overlap with PolyFind:

| Candidate Paper / System | Method | Assumptions | Metrics | Limits | Overlap & Difference vs. PolyFind |
|---|---|---|---|---|---|
| *Cost-based Optimization of Multistore Query Plans* (2023) | Cost-based query plan generator across relational and NoSQL engines | Uniform or predictable network costs; stores are static during query execution | Total execution time, optimizer latency, plan cost accuracy | Does not model derived store staleness or transactional freshness violations | Shares multi-store cost-based dispatch; PolyFind uniquely enforces transactional freshness constraints and dynamic fallback on stale derived stores. |
| *CHASE: A Native Relational Database for Hybrid Queries* (2025) | Unified internal relational engine executing combined relational filtering and vector similarity | Single unified DBMS engine; synchronous ACID updates across vector index | Latency, throughput, vector recall@k, filter pushdown efficiency | Requires specialized monolithic engine; does not address decoupled heterogeneous polyglot stores | Both evaluate hybrid structured + vector retrieval; PolyFind addresses heterogeneous stores (MySQL + external vector DB) under eventual consistency. |
| *SymRAG* (2025) | Adaptive symbolic and neural retrieval router selecting retrieval tool by query type | Query classifier has near-zero runtime latency; all backends are assumed fresh | Tool selection accuracy, retrieval latency, response relevance | Assumes underlying stores are always up-to-date; no freshness check | Shares adaptive path selection based on query features; PolyFind extends routing to consider data freshness and cost constraints. |
| *EA-GraphRAG* (2026) | Entity-augmented graph and vector hybrid retrieval for complex associative queries | Graph and vector representations are synchronized offline in batches | Graph traversal hop count, precision@k, retrieval recall | High indexing overhead; assumes read-mostly workload without continuous writes | Uses graph and vector fusion; PolyFind focuses on online update handling and preventing stale graph/vector candidates from corrupting authoritative facts. |
| *DYNAMICANN* (2026) | Dynamic vector indexing under continuous streaming insertions and deletions | In-memory index structure with high memory headroom; isolated to vector domain | Ingestion throughput, build time, recall@k under dynamic updates | Confined to vector index internals; lacks cross-store transactional coordination | Addresses dynamic updates in vector stores; PolyFind addresses cross-store coordination across relational, cache, graph, and vector stores. |
| *FreshCache* (2026 preprint) | Freshness-aware cache invalidation and query bypass for dynamic web workloads | Key-value cache with bounded staleness tolerances per query | Stale read rate, cache hit ratio, tail latency reduction | Focuses on single KV cache layer; does not address multi-representation retrieval fusion | Directly relevant to PolyFind's Redis cache tier; PolyFind extends freshness validation across multiple derived stores (cache, graph, vector). |

### Literature matrix template for ongoing review

Use this template when recording newly reviewed papers during Sprint 1–6:

| Field | Description / Instruction |
|---|---|
| **Citation / Reference** | Full bibliographic reference, publication venue, and DOI/arXiv identifier. |
| **Method** | Core algorithmic or architectural approach. |
| **Assumptions** | Stated or unstated operational assumptions (e.g. static data, unified engine, hardware). |
| **Metrics** | Quantitative evaluation measures (e.g. NDCG, latency percentiles, staleness rate). |
| **Limits** | Weaknesses, scale limits, failure modes, or unaddressed scenarios. |
| **Overlap & Distinction** | Precise intersection with PolyFind and what distinguishes PolyFind's investigation. |

## Candidate gap
The candidate gap is the joint evaluation of cross-store retrieval decisions under changing freshness of derived data, with explicit correctness constraints for authoritative fields and a measured trade-off among relevance, freshness violations, tail latency, and resource use.

This is a hypothesis, not a claim that no prior system does this. Before making a novelty claim, compare the proposed method against the closest freshness-aware cache, multistore optimizer, and hybrid retrieval systems.

## Rough shape of the solution
PolyFind will keep MySQL authoritative for transactional facts. Redis, Neo4j, and the vector index will be treated as derived or retrieval-supporting stores. A retrieval planner will choose and combine paths using query class, freshness requirements, version metadata, and measured execution costs; freshness-sensitive fields will be validated against MySQL or a trustworthy version mechanism.

## Research questions and formal hypotheses

All performance, freshness, and relevance advantages are working hypotheses subject to experimental verification in Sprint 5 and Sprint 6. No claim of novelty or superiority is accepted without empirical evidence.

### Research questions
1. Can version-aware validation reduce stale-result violations compared with TTL-only caching?
2. Can adaptive routing reduce latency or query work without unacceptable degradation in search relevance?
3. How do update frequency and synchronization delay change the quality/freshness/latency trade-off?
4. How does the design degrade when a derived store is unavailable or behind?

### Formal hypotheses (H1–H4)
- **Hypothesis 1 (H1 — Freshness Correctness):** Version-aware validation reduces stale-result violations for authoritative transactional fields (price, stock) to zero, significantly outperforming TTL-only caching under concurrent write workloads.
- **Hypothesis 2 (H2 — Tail Latency & Adaptive Routing):** Adaptive query routing conditioned on query features and store health reduces p95 tail latency and aggregate store operation counts relative to a fixed multi-store baseline, without statistically significant degradation in search relevance (NDCG@10).
- **Hypothesis 3 (H3 — Synchronization Delay Resilience):** Under increasing write arrival rates and artificial synchronization lag in derived stores, a freshness-constrained policy maintains consistent search accuracy while fixed hybrid baselines suffer escalating freshness violation rates.
- **Hypothesis 4 (H4 — Graceful Fallback & Availability):** When derived stores (Redis, Neo4j, or vector store) fail or lag beyond tolerable thresholds, automated fallback to authoritative MySQL maintains system availability and transactional correctness with documented latency degradation.

## Evaluation plan
Compare at least:
- MySQL-only structured baseline.
- Fixed multi-store retrieval.
- Fixed hybrid retrieval without freshness-aware decisions.
- TTL-only cache policy.
- Proposed freshness-constrained adaptive policy.

Measure Precision@K, Recall@K, NDCG@K, freshness violation rate, update visibility delay, median/p95 latency, throughput, database operations per query, and recovery behavior. Record hardware, dataset, workload, seeds, cache state, and run repetitions. Use ablation studies to isolate each signal/mechanism.

## Open questions and decision tracking

| # | Question | Owner | Target Slice / Date | Status |
|---|---|---|---|---|
| 1 | Which vector database and embedding provider best fit local reproducibility and project constraints? | Member B | Sprint 1 (`S1-05`) | Under evaluation in vector spike; documented in ADR-003. |
| 2 | What freshness contract applies to price/stock versus descriptive metadata? | Member A | Sprint 1 (`S1-04` / ADR-002) | Price/stock: zero stale tolerance. Descriptive fields: bounded staleness. |
| 3 | What dataset and query set will be used, and how will relevance labels be created? | Member A & B | Sprint 2 (`S2-02`) & Sprint 5 (`S5-02`) | Seed dataset in S2-02; relevance annotations in S5-02. |
| 4 | What baselines can be implemented fairly within the project timeline? | Member A | Sprint 1 (`S1-02`) | Feasible: MySQL-only, Fixed multi-store, Fixed hybrid, TTL cache. |
| 5 | Which exact prior works are closest to the combined problem and method? | Member A | Sprint 1 (`S1-02`) | Literature audit initialized in research matrix above. |
| 6 | What deadline and sprint duration apply? | Member A | Sprint 1 baseline | Six sprints aligned with parallel work plan. |

## Research exit check
Do not claim the gap is established until a reproducible literature matrix covers the closest work and documents method, assumptions, metrics, limitations, and differences from PolyFind.

