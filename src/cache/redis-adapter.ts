/**
 * Redis Cache Adapter with Version-Aware Invalidation for PolyFind
 * Evaluates cached entry validity against authoritative entity versions.
 * Exposes real-time hit/miss and invalidation metrics.
 */

import type { ProductId, SourceVersion } from "../contracts/types.js";
import type { CachedSearchResult, CacheMetrics } from "./types.js";

export interface RedisCacheOptions {
  defaultTtlSeconds?: number;
  nowFn?: () => number;
}

export class RedisCacheAdapter {
  private memoryStore = new Map<string, CachedSearchResult>();
  private defaultTtlSeconds: number;
  private now: () => number;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    invalidations: 0,
    expirations: 0,
    bypasses: 0,
  };

  constructor(options: RedisCacheOptions = {}) {
    this.defaultTtlSeconds = options.defaultTtlSeconds ?? 60;
    this.now = options.nowFn ?? (() => Date.now());
  }

  /**
   * Retrieves a cached result, validating TTL and entity versions against current authoritative versions.
   * If any entity in the cache has a stale version, the cache entry is invalidated.
   */
  async get<T = unknown>(
    key: string,
    currentVersions?: Map<ProductId, SourceVersion>,
  ): Promise<CachedSearchResult<T> | null> {
    const entry = this.memoryStore.get(key) as CachedSearchResult<T> | undefined;

    if (!entry) {
      this.metrics.misses += 1;
      return null;
    }

    const currentTime = this.now();
    const ageSeconds = (currentTime - entry.cachedAt) / 1000;

    // Check TTL Expiry
    if (ageSeconds >= entry.ttlSeconds) {
      this.memoryStore.delete(key);
      this.metrics.expirations += 1;
      this.metrics.misses += 1;
      return null;
    }

    // Version-Aware Freshness Validation
    if (currentVersions) {
      let isStale = false;
      for (const [prodId, cachedVer] of Object.entries(entry.versionSnapshots)) {
        const currentVer = currentVersions.get(prodId);
        if (currentVer !== undefined && currentVer > cachedVer) {
          isStale = true;
          break;
        }
      }

      if (isStale) {
        // Entry is invalidated due to upstream version change
        this.memoryStore.delete(key);
        this.metrics.invalidations += 1;
        this.metrics.misses += 1;
        return null;
      }
    }

    this.metrics.hits += 1;
    return entry;
  }

  /**
   * Stores a search result with explicit TTL and version snapshots of included entities.
   */
  async set<T = unknown>(
    key: string,
    data: T,
    options: {
      productIds?: ProductId[] | undefined;
      versionSnapshots?: Record<ProductId, SourceVersion> | undefined;
      ttlSeconds?: number | undefined;
    } = {},
  ): Promise<void> {
    const ttlSeconds = options.ttlSeconds ?? this.defaultTtlSeconds;
    const cachedAt = this.now();
    const productIds = options.productIds ?? [];
    const versionSnapshots = options.versionSnapshots ?? {};

    const entry: CachedSearchResult<T> = {
      key,
      cachedAt,
      ttlSeconds,
      productIds,
      versionSnapshots,
      data,
    };

    this.memoryStore.set(key, entry as unknown as CachedSearchResult);
  }

  /**
   * Invalidates all cached query entries that reference a specific product.
   */
  async invalidateProduct(productId: ProductId): Promise<number> {
    let invalidatedCount = 0;
    for (const [key, entry] of this.memoryStore.entries()) {
      if (entry.productIds.includes(productId) || entry.versionSnapshots[productId] !== undefined) {
        this.memoryStore.delete(key);
        invalidatedCount += 1;
      }
    }
    this.metrics.invalidations += invalidatedCount;
    return invalidatedCount;
  }

  async clear(): Promise<void> {
    this.memoryStore.clear();
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      invalidations: 0,
      expirations: 0,
      bypasses: 0,
    };
  }

  size(): number {
    return this.memoryStore.size;
  }
}
