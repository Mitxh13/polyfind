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

## Active sprint and slice status

- **Active Sprint:** [Sprint 1 — Research and foundation](docs/sprints/sprint-01.md)
- **Active Slices:**
  - `S1-01` — [Repository and contributor workflow](docs/slices/s1-01-repository-and-contributor-workflow.md) (Owner: Member A) — Completed
  - `S1-02` — [Requirements and research-gap review](docs/slices/s1-02-requirements-and-research-gap-review.md) (Owner: Member A) — Completed
  - `S1-03` — [Local development configuration](docs/slices/s1-03-local-development-configuration.md) (Owner: Member B)
  - `S1-04` — [Architecture contracts and module skeleton](docs/slices/s1-04-architecture-contracts-and-module-skeleton.md) (Owner: Member A) — Completed
  - `S1-05` — [Vector-store and embedding spike](docs/slices/s1-05-vector-store-and-embedding-spike.md) (Owner: Member B)
- **Full Slice Roadmap:** See [docs/PARALLEL_WORK_PLAN.md](docs/PARALLEL_WORK_PLAN.md) for all 30 slices across Sprints 1–6.

## Contributor workflow and conventions

All team members and agents follow the rules in `AGENTS.md` and the parallel execution plan:

### 1. Branch naming convention
- Feature branches: `feature/<slice-id>-<short-description>` (e.g. `feature/S1-01-repository-baseline`)
- Fix branches: `fix/<slice-id>-<short-description>` (e.g. `fix/S3-02-version-metadata`)

### 2. Commit message convention
- Format: `[<slice-id>] <Imperative summary>`
- Example: `[S1-01] Establish repository baseline`

### 3. Pull request (PR) convention
- **PR Title:** `[<slice-id>] <Summary>` (e.g. `[S1-01] Establish repository baseline`)
- **PR Description Requirements:**
  - Slice ID reference
  - Acceptance criteria checked (`- [x]`)
  - Commands and tests run (`npm test`, `npm run typecheck`)
  - Evidence attached (test outputs, benchmark runs, or screenshots if UI)
  - Limitations, changed assumptions, or follow-up issues

### 4. Issue-to-slice traceability and ownership
- Every task, branch, and PR links directly to one slice file in `docs/slices/`.
- Every slice has exactly one directly responsible owner; joint ownership is not permitted.
- Work proceeds in parallel using published contracts (`src/contracts/`, `docs/contracts.md`), mocks, and fixtures without blocking on upstream implementations.

### 5. Secrets and generated data hygiene
- `.env.example` is the sole variable-name reference; never commit real credentials or `.env` files.
- Never commit private keys (`.pem`, `.key`, `id_rsa`) or unapproved datasets.
- Derived and generated data are excluded from source control via `.gitignore`:
  - `results/`
  - `artifacts/`
  - `data/generated/`
  - `node_modules/`, `build/`, `dist/`, `.next/`, `coverage/`

## Documentation map
- `docs/research.md` — problem framing and related-work audit plan
- `docs/PRD.md` — scope and success criteria
- `docs/ARCHITECTURE.md` — system design and API contract
- `docs/decisions/` — decisions worth recording
- `docs/sprints/` — feature-level implementation chunks
- `docs/slices/` — individually executable, testable tasks
- `docs/contracts.md` — S1-04 typed boundaries, validation, interfaces, and examples
- `AGENTS.md` — coding-agent operating rules

