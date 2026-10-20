export {
  createProductUpdateEvent,
  type ProductUpdateEvent,
  type UpdateOperation,
} from "./events.js";

export {
  SyncManager,
  type DerivedStoreSyncTarget,
  type SyncLogEntry,
  type SyncStatus,
} from "./processor.js";

export {
  Neo4jGraphSyncAdapter,
  InMemoryGraphStorage,
  NEO4J_SCHEMA_CYPHER,
  type GraphNode,
  type GraphEdge,
  type GraphSyncMetrics,
} from "./neo4j-sync.js";
