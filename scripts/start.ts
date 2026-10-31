import { spawn } from "node:child_process";
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

const apiPort = Number(process.env.API_PORT ?? 3001);
const webPort = Number(process.env.PORT ?? 3000);
const mode = process.env.CATALOG_MODE ?? "live";

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
    throw new Error("Live catalog mode requires a reachable MySQL database; demo fallback is disabled.");
  }
} else {
  throw new Error("Live catalog mode requires DATABASE_URL. Set CATALOG_MODE=demo for local demonstration.");
}

const apiServer = createApiServer({
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

await apiServer.start(apiPort);
console.log(`[PolyFind API] Running on http://127.0.0.1:${apiPort} (${mode})`);
console.log(`[PolyFind Web] Starting production server on http://localhost:${webPort} ...`);

const nextProc = spawn(`npx next start web -p ${webPort}`, {
  shell: true,
  stdio: "inherit",
  env: {
    ...process.env,
    POLYFIND_API_URL: `http://127.0.0.1:${apiPort}`,
  },
});

const cleanup = async () => {
  console.log("\nShutting down PolyFind production services...");
  try {
    await apiServer.stop();
  } catch {}
  nextProc.kill("SIGINT");
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
