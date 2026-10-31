import {
  createApiServer,
  InMemoryCatalog,
  SearchService,
  generateSeedDataset,
  CatalogRepository,
  createDatabasePool,
  loadEnvironment,
} from "../src/index.js";
import type { CatalogReader } from "../src/contracts/types.js";

loadEnvironment();

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);
const mode = process.env.CATALOG_MODE ?? (process.env.NODE_ENV === "production" ? "live" : "demo");

let catalog: CatalogReader;
let catalogStatus: "available" | "not-configured" | "unavailable";

if (mode === "demo") {
  const dataset = generateSeedDataset({ seed: 42, productCount: 50 });
  catalog = new InMemoryCatalog(dataset.products);
  catalogStatus = "available";
} else if (mode === "live" && process.env.DATABASE_URL) {
  try {
    const pool = createDatabasePool();
    await pool.query("SELECT 1");
    catalog = new CatalogRepository(pool);
    catalogStatus = "available";
  } catch {
    console.error("Live catalog mode requires a reachable MySQL database. No demo fallback was used.");
    process.exit(1);
  }
} else {
  console.error("Live catalog mode requires DATABASE_URL. Set CATALOG_MODE=demo only for the deterministic demonstration.");
  process.exit(1);
}

const app = createApiServer({
  catalog,
  search: new SearchService({ catalog }),
  dependencyStatus: {
    catalog: catalogStatus,
    redis: process.env.REDIS_URL ? "available" : "not-configured",
    graph: process.env.NEO4J_URI ? "available" : "not-configured",
    vector: "available",
  },
  mode: mode as "demo" | "live",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  rateLimit: { windowMs: 60_000, maxRequests: Number(process.env.RATE_LIMIT_MAX ?? 120) },
});

await app.start(port);
console.log(`PolyFind API listening on http://127.0.0.1:${port}`);
console.log(`Active mode: ${mode === "demo" ? "DEMO (deterministic in-memory catalogue)" : "LIVE (authoritative MySQL catalogue)"}`);
