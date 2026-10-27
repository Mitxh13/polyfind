import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { healthCheck } from "../contracts/health.js";
import { ContractValidationError } from "../contracts/errors.js";
import { parseSearchRequest } from "../contracts/validation.js";
import type { CatalogReader, ProductFilters } from "../contracts/types.js";
import { CatalogValidationError, NotFoundError, SafeDatabaseError } from "../catalog/errors.js";
import { SearchService, type InMemoryCatalog } from "./search.js";

const MAX_LIMIT = 100;

export interface ApiServerOptions {
  catalog: CatalogReader;
  search?: SearchService;
  dependencyStatus?: Record<string, "available" | "not-configured" | "unavailable">;
}

export interface ApiServer {
  server: Server;
  start(port?: number, host?: string): Promise<number>;
  stop(): Promise<void>;
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Content-Length", Buffer.byteLength(payload));
  response.end(payload);
}

function errorResponse(error: unknown): { status: number; body: object } {
  if (error instanceof ContractValidationError) {
    return { status: 400, body: { error: { code: error.code, message: error.message, issues: error.issues } } };
  }
  if (error instanceof CatalogValidationError) {
    return { status: 400, body: { error: { code: error.code, message: error.message } } };
  }
  if (error instanceof NotFoundError) {
    return { status: 404, body: { error: { code: error.code, message: error.message } } };
  }
  if (error instanceof SafeDatabaseError) {
    return { status: 503, body: { error: { code: error.code, message: error.message } } };
  }
  return { status: 500, body: { error: { code: "INTERNAL_ERROR", message: "The request could not be completed." } } };
}

function parseInteger(value: string | null, name: string, defaultValue: number): number {
  if (value === null || value === "") return defaultValue;
  if (!/^\d+$/.test(value)) throw new CatalogValidationError(`${name} must be a positive integer.`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new CatalogValidationError(`${name} must be a positive integer.`);
  return parsed;
}

function parseFilters(url: URL): { q: string | undefined; filters: ProductFilters; page: number; limit: number; sort: string } {
  const page = parseInteger(url.searchParams.get("page"), "page", 1);
  const limit = parseInteger(url.searchParams.get("limit"), "limit", 20);
  if (limit > MAX_LIMIT) throw new CatalogValidationError(`limit must be between 1 and ${MAX_LIMIT}.`);
  const minRaw = url.searchParams.get("minPrice");
  const maxRaw = url.searchParams.get("maxPrice");
  const minPrice = minRaw === null || minRaw === "" ? undefined : Number(minRaw);
  const maxPrice = maxRaw === null || maxRaw === "" ? undefined : Number(maxRaw);
  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) throw new CatalogValidationError("minPrice must be a non-negative number.");
  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) throw new CatalogValidationError("maxPrice must be a non-negative number.");
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) throw new CatalogValidationError("minPrice cannot be greater than maxPrice.");
  const stockRaw = url.searchParams.get("inStock");
  const inStock = stockRaw === null ? undefined : stockRaw === "true" ? true : stockRaw === "false" ? false : (() => { throw new CatalogValidationError("inStock must be true or false."); })();
  const categoryId = url.searchParams.get("category") ?? url.searchParams.get("categoryId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  const sort = url.searchParams.get("sort") ?? "relevance";
  if (!["relevance", "name", "price", "updatedAt"].includes(sort)) throw new CatalogValidationError("sort must be relevance, name, price, or updatedAt.");
  return { q, filters: { ...(categoryId === undefined ? {} : { categoryId }), ...(minPrice === undefined ? {} : { minPrice }), ...(maxPrice === undefined ? {} : { maxPrice }), ...(inStock === undefined ? {} : { inStock }) }, page, limit, sort };
}

async function handle(request: IncomingMessage, response: ServerResponse, options: ApiServerOptions): Promise<void> {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: { code: "METHOD_NOT_ALLOWED", message: "Only GET requests are supported." } });
    return;
  }
  const url = new URL(request.url ?? "/", "http://localhost");
  try {
    if (url.pathname === "/api/health") {
      sendJson(response, 200, { ...healthCheck(), dependencies: options.dependencyStatus ?? {} });
      return;
    }
    if (url.pathname === "/api/products") {
      const parsed = parseFilters(url);
      const all = "listAll" in options.catalog
        ? (options.catalog as InMemoryCatalog).listAll()
        : (await options.catalog.listProducts(parsed.filters, 1, 100)).items;
      const query = parsed.q?.trim().toLocaleLowerCase();
      const filtered = all.filter((product) =>
        (!query || `${product.name} ${product.description}`.toLocaleLowerCase().includes(query)) &&
        (parsed.filters.categoryId === undefined || product.categoryId === parsed.filters.categoryId) &&
        (parsed.filters.minPrice === undefined || product.price >= parsed.filters.minPrice) &&
        (parsed.filters.maxPrice === undefined || product.price <= parsed.filters.maxPrice) &&
        (parsed.filters.inStock === undefined || (parsed.filters.inStock ? product.stock > 0 : product.stock === 0)),
      );
      const sorted = [...filtered].sort((a, b) => parsed.sort === "name" ? a.name.localeCompare(b.name) : parsed.sort === "price" ? a.price - b.price || a.id.localeCompare(b.id) : parsed.sort === "updatedAt" ? b.updatedAt.localeCompare(a.updatedAt) : a.id.localeCompare(b.id));
      const offset = (parsed.page - 1) * parsed.limit;
      sendJson(response, 200, { items: sorted.slice(offset, offset + parsed.limit), page: parsed.page, limit: parsed.limit, total: sorted.length, totalPages: Math.max(1, Math.ceil(sorted.length / parsed.limit)), sort: parsed.sort });
      return;
    }
    const productMatch = /^\/api\/products\/([^/]+)$/.exec(url.pathname);
    if (productMatch) {
      const product = await options.catalog.getProduct(decodeURIComponent(productMatch[1]!));
      if (!product) throw new NotFoundError("Product", productMatch[1]!);
      sendJson(response, 200, { item: product });
      return;
    }
    if (url.pathname === "/api/search") {
      const parsed = parseFilters(url);
      if (!parsed.q?.trim()) throw new CatalogValidationError("q is required and must be non-empty.");
      const freshnessMode = url.searchParams.get("freshnessMode") ?? "strict";
      const request = parseSearchRequest({ query: parsed.q, filters: parsed.filters, page: parsed.page, limit: parsed.limit, freshnessMode });
      const result = await (options.search ?? new SearchService({ catalog: options.catalog })).search(request);
      sendJson(response, 200, result);
      return;
    }
    sendJson(response, 404, { error: { code: "NOT_FOUND", message: "The requested endpoint was not found." } });
  } catch (error) {
    const formatted = errorResponse(error);
    sendJson(response, formatted.status, formatted.body);
  }
}

export function createApiServer(options: ApiServerOptions): ApiServer {
  const server = createServer((request, response) => {
    void handle(request, response, options);
  });
  return {
    server,
    start(port = 3000, host = "127.0.0.1") {
      return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, host, () => {
          server.removeListener("error", reject);
          const address = server.address();
          resolve(typeof address === "object" && address ? address.port : port);
        });
      });
    },
    stop() {
      return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    },
  };
}
