# ADR-003 — Select One Vector Store

## Status
Proposed; decision due in Sprint 1.

## Context
PolyFind needs semantic retrieval but must remain reproducible and manageable for a two-person capstone team.

## Decision
Select one vector database after a short spike comparing local setup, metadata filtering, update/delete behavior, integration effort, licensing, reproducibility, and benchmark observability. Keep application code behind a small adapter so the chosen backend is replaceable.

## Why
Prematurely committing to multiple vector systems adds complexity without helping answer the research question.

## Alternatives considered
- Use a local vector database: potentially easiest for reproducible experiments.
- Use a separately hosted vector service: may simplify operations but introduces external-service, credential, and availability dependencies.

## Required evidence
Record the candidates, version, test dataset, filtering/update behavior, setup friction, and the reason for selection before marking this ADR accepted.
