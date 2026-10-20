# Neo4j Graph Schema and Synchronization Semantics

## 1. Graph Data Model

The graph database represents structural relationships among products and categories to accelerate relationship traversal and candidate discovery:

```mermaid
graph LR
    P[":Product (id, name, version)"] -->|IN_CATEGORY| C[":Category (id, name)"]
    P1[":Product (id, name, version)"] -->|RELATED_TO {weight}| P2[":Product (id, name, version)"]
```

### Node Labels and Properties
- **`:Product`**:
  - `id` (`string`, Unique Primary Key) — Corresponds to MySQL `Product.id`.
  - `name` (`string`) — Descriptive title.
  - `version` (`int`) — Source monotonic version for freshness tracking.
  - *(Note: Sensitive transactional facts like `price` and `stock` are intentionally omitted from graph properties to prevent stale derived facts from overriding MySQL authority).*
- **`:Category`**:
  - `id` (`string`, Unique Primary Key) — Corresponds to MySQL `Category.id`.
  - `name` (`string`) — Category title.

### Edge Relationships
- `(:Product)-[:IN_CATEGORY]->(:Category)`: Categorical classification.
- `(:Product)-[:RELATED_TO {weight: float}]->(:Product)`: Similarity or co-occurrence relationship.

---

## 2. Constraints and Indexes

Execute these Cypher statements on database initialization:

```cypher
-- Enforce unique product entity identifier
CREATE CONSTRAINT c_product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE;

-- Enforce unique category identifier
CREATE CONSTRAINT c_category_id IF NOT EXISTS FOR (c:Category) REQUIRE c.id IS UNIQUE;

-- Index on version to support fast version lookups during update verification
CREATE INDEX idx_product_version IF NOT EXISTS FOR (p:Product) ON (p.version);

-- Index on category membership
CREATE INDEX idx_product_category IF NOT EXISTS FOR (p:Product) ON (p.categoryId);
```

---

## 3. Idempotent Synchronization Semantics

The `Neo4jGraphSyncAdapter` implements `DerivedStoreSyncTarget` using Cypher `MERGE` semantics:
1. **Idempotence**: Repeatedly applying an event with the same `(productId, version)` produces no duplicate nodes or edges.
2. **Out-of-Order Rejection**: If an update arrives with an older version than currently recorded, the adapter skips applying it.
3. **Observability**: Exposes synchronization lag (`lastLagMs`), total nodes, total edges, and sync error counters. Logs sanitize all credentials via `redactSecret`.
