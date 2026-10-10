# S1-03 — Local development configuration

## Module
`foundation`

## What to build
Document supported runtime versions and environment variables; make missing configuration fail clearly.

## Acceptance criteria
- [ ] `.env.example` contains names only and no usable secrets.
- [ ] Setup instructions explain how to configure MySQL, Redis, Neo4j, and the selected vector store locally.
- [ ] The application reports missing required configuration without exposing secret values.

## Dependencies
Complete the preceding slice(s) needed for this module and review `docs/ARCHITECTURE.md` plus the relevant sprint plan.

## Mockup / reference
Not applicable unless the implementation adds a UI surface.

## Out of scope for this slice
Do not commit `.env` or provision paid services.

## Human review required?
Yes if the implementation touches secrets, infrastructure, authentication, destructive migrations, or changes a documented freshness guarantee; otherwise normal PR review.

## Ownership
Shared; assign one driver before work begins.

## Evidence to attach to PR
- Acceptance criteria checked
- Tests and commands run
- Screenshots or raw benchmark artifacts when applicable
- Any changed assumptions, limitations, or follow-up issues
