import type {
  CatalogReader,
  Product,
  ProductFilters,
  RetrievalCandidate,
  RetrievalProvider,
  SearchRequest,
  SearchResponse,
} from "../contracts/types.js";
import { deduplicateCandidates } from "../retrieval/candidate.js";
import { FreshnessValidator } from "../planner/freshness.js";
import { RetrievalPlanner, type PlannerMode } from "../planner/routing.js";

export interface SearchServiceOptions {
  catalog: CatalogReader;
  providers?: readonly RetrievalProvider[];
  planner?: RetrievalPlanner;
  plannerMode?: PlannerMode;
  timeoutMs?: number;
}

export interface SearchQueryOptions {
  query: string;
  filters: ProductFilters;
  page: number;
  limit: number;
  freshnessMode: SearchRequest["freshnessMode"];
}

class KeywordRetrievalProvider implements RetrievalProvider {
  readonly name = "mysql";

  constructor(private readonly catalog: CatalogReader) {}

  async retrieve(request: SearchRequest): Promise<{ candidates: RetrievalCandidate[]; elapsedMs: number }> {
    const start = performance.now();
    const result = await this.catalog.listProducts(request.filters, 1, 100);
    const tokens = request.query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const candidates = result.items
      .map((product) => {
        const text = `${product.name} ${product.description}`.toLocaleLowerCase();
        const matches = tokens.filter((token) => text.includes(token)).length;
        return {
          productId: product.id,
          source: this.name,
          score: tokens.length === 0 ? 0 : matches / tokens.length,
          sourceVersion: product.version,
        };
      })
      .filter((candidate) => candidate.score > 0)
      .sort((left, right) => right.score - left.score || left.productId.localeCompare(right.productId));

    return {
      candidates,
      elapsedMs: Math.round((performance.now() - start) * 100) / 100,
    };
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Search dependency timed out.")), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export class SearchService {
  private readonly catalog: CatalogReader;
  private readonly providers: readonly RetrievalProvider[];
  private readonly planner: RetrievalPlanner;
  private readonly plannerMode: PlannerMode;
  private readonly timeoutMs: number;
  private readonly freshness: FreshnessValidator;

  constructor(options: SearchServiceOptions) {
    this.catalog = options.catalog;
    this.providers = options.providers ?? [new KeywordRetrievalProvider(options.catalog)];
    this.planner = options.planner ?? new RetrievalPlanner();
    this.plannerMode = options.plannerMode ?? "adaptive";
    this.timeoutMs = options.timeoutMs ?? 2_000;
    this.freshness = new FreshnessValidator(options.catalog);
  }

  async search(options: SearchQueryOptions): Promise<SearchResponse> {
    const started = performance.now();
    const request: SearchRequest = {
      query: options.query,
      filters: options.filters,
      freshnessMode: options.freshnessMode,
      page: options.page,
      limit: options.limit,
    };
    const plan = this.planner.plan(request, this.plannerMode, {
      vectorFreshness: "fresh",
      graphFreshness: "fresh",
    });
    const retrievalStarted = performance.now();
    const selected = this.providers.filter((provider) => {
      if (provider.name === "mysql") return plan.decision.stores.includes("mysql");
      if (provider.name === "vector-semantic" || provider.name === "vector") {
        return plan.decision.stores.includes("vector");
      }
      if (provider.name === "graph" || provider.name === "neo4j-graph") {
        return plan.decision.stores.includes("graph");
      }
      return false;
    });
    const providers = selected.length > 0 ? selected : [new KeywordRetrievalProvider(this.catalog)];
    const results = await Promise.all(
      providers.map(async (provider) => {
        try {
          return await withTimeout(provider.retrieve(request), this.timeoutMs);
        } catch {
          return { candidates: [], elapsedMs: this.timeoutMs };
        }
      }),
    );
    const candidates = deduplicateCandidates(
      results.flatMap((result) => result.candidates),
      { strategy: "max" },
    );
    const validationStarted = performance.now();
    const validated = await this.freshness.validateCandidates(
      candidates.map((candidate) => ({
        productId: candidate.productId,
        source: candidate.sources.join(","),
        score: candidate.score,
        ...(candidate.sourceVersion === undefined ? {} : { sourceVersion: candidate.sourceVersion }),
      })),
      { mode: options.freshnessMode },
    );
    const safe = validated.candidates
      .filter((candidate) => candidate.safeToPresent && candidate.product !== null)
      .map((candidate) => ({ product: candidate.product!, score: candidate.candidate.score }));
    const offset = (options.page - 1) * options.limit;
    const items = safe.slice(offset, offset + options.limit);
    const freshnessStatus = validated.telemetry.unverifiableCandidates > 0
      ? "unavailable"
      : validated.telemetry.staleCandidates > 0
        ? options.freshnessMode === "best-effort" ? "degraded" : "unavailable"
        : "verified";

    return {
      items,
      page: options.page,
      total: safe.length,
      strategy: `${this.plannerMode}-${plan.decision.stores.join("+")}`,
      timings: {
        totalMs: Math.round((performance.now() - started) * 100) / 100,
        retrievalMs: Math.round((performance.now() - retrievalStarted) * 100) / 100,
        validationMs: Math.round((performance.now() - validationStarted) * 100) / 100,
      },
      freshness: {
        mode: options.freshnessMode,
        status: freshnessStatus,
        checkedAt: new Date().toISOString(),
      },
    };
  }
}

export class InMemoryCatalog implements CatalogReader {
  private readonly products: Product[];

  constructor(products: readonly Product[]) {
    this.products = products.map((product) => ({ ...product }));
  }

  async getProduct(productId: string): Promise<Product | null> {
    return this.products.find((product) => product.id === productId) ?? null;
  }

  async listProducts(
    filters: ProductFilters,
    page: number,
    limit: number,
  ): Promise<{ items: Product[]; total: number }> {
    const filtered = this.products.filter((product) =>
      (filters.categoryId === undefined || product.categoryId === filters.categoryId) &&
      (filters.minPrice === undefined || product.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || product.price <= filters.maxPrice) &&
      (filters.inStock === undefined || (filters.inStock ? product.stock > 0 : product.stock === 0)),
    );
    const offset = (page - 1) * limit;
    return { items: filtered.slice(offset, offset + limit), total: filtered.length };
  }

  listAll(): Product[] {
    return this.products.map((product) => ({ ...product }));
  }
}
