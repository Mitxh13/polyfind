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

## Candidate gap
The candidate gap is the joint evaluation of cross-store retrieval decisions under changing freshness of derived data, with explicit correctness constraints for authoritative fields and a measured trade-off among relevance, freshness violations, tail latency, and resource use.

This is a hypothesis, not a claim that no prior system does this. Before making a novelty claim, compare the proposed method against the closest freshness-aware cache, multistore optimizer, and hybrid retrieval systems.

## Rough shape of the solution
PolyFind will keep MySQL authoritative for transactional facts. Redis, Neo4j, and the vector index will be treated as derived or retrieval-supporting stores. A retrieval planner will choose and combine paths using query class, freshness requirements, version metadata, and measured execution costs; freshness-sensitive fields will be validated against MySQL or a trustworthy version mechanism.

## Research questions
1. Can version-aware validation reduce stale-result violations compared with TTL-only caching?
2. Can adaptive routing reduce latency or query work without unacceptable degradation in search relevance?
3. How do update frequency and synchronization delay change the quality/freshness/latency trade-off?
4. How does the design degrade when a derived store is unavailable or behind?

## Evaluation plan
Compare at least:
- MySQL-only structured baseline.
- Fixed multi-store retrieval.
- Fixed hybrid retrieval without freshness-aware decisions.
- TTL-only cache policy.
- Proposed freshness-constrained adaptive policy.

Measure Precision@K, Recall@K, NDCG@K, freshness violation rate, update visibility delay, median/p95 latency, throughput, database operations per query, and recovery behavior. Record hardware, dataset, workload, seeds, cache state, and run repetitions. Use ablation studies to isolate each signal/mechanism.

## Open questions
- Which vector database and embedding provider best fit local reproducibility and project constraints?
- What freshness contract applies to price/stock versus descriptive metadata?
- What dataset and query set will be used, and how will relevance labels be created?
- What baselines can be implemented fairly within the project timeline?
- Which exact prior works are closest to the combined problem and method?
- What deadline and sprint duration apply?

## Research exit check
Do not claim the gap is established until a reproducible literature matrix covers the closest work and documents method, assumptions, metrics, limitations, and differences from PolyFind.
