# PolyFind Documentation Index

| Area | File | Purpose |
|---|---|---|
| Overview | `README.md` | Project purpose and workflow |
| Agent rules | `AGENTS.md` | Rules for coding agents |
| Research | `docs/research.md` | Problem, candidate gap, research questions, evaluation |
| Product | `docs/PRD.md` | Scope, features, exclusions, success criteria |
| Architecture | `docs/ARCHITECTURE.md` | Stack, flow, modules, API, data authority |
| Decisions | `docs/decisions/` | Important architectural choices |
| Sprints | `docs/sprints/` | Six feature-level chunks |
| Slices | `docs/slices/` | Thirty testable implementation units |
| Environment | `.env.example` | Required variable names, no real secrets |

## Important status note
The research gap is a candidate hypothesis. The documentation does not claim that PolyFind is already novel or that the proposed method improves performance. These claims require a verified literature comparison and reproducible experiments.

## Parallel work and ownership

- `docs/PARALLEL_WORK_PLAN.md` — canonical single-owner assignment, interface strategy, and dependency rules.
- `docs/sprints/sprint-01.md` through `sprint-06.md` — five slices per sprint with one owner per slice.
- `docs/slices/` — each slice records its owner, output, prerequisite contract, and completion evidence.
- No slice is assigned to both members; use mocks, fixtures, and stubs to avoid unnecessary waiting.
