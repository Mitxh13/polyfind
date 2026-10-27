import { createApiServer, InMemoryCatalog, SearchService, generateSeedDataset } from "../src/index.js";

const dataset = generateSeedDataset({ seed: 42, productCount: 50 });
const catalog = new InMemoryCatalog(dataset.products);
const app = createApiServer({
  catalog,
  search: new SearchService({ catalog }),
  dependencyStatus: {
    catalog: "available",
    redis: "not-configured",
    graph: "not-configured",
    vector: "available",
  },
});

const port = await app.start(Number(process.env.PORT ?? 3000));
console.log(`PolyFind API listening on http://127.0.0.1:${port}`);
