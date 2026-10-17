import type { Pool, RowDataPacket } from "mysql2/promise";
import type { Category, Product, ProductFilters } from "../contracts/types.js";
import {
  CatalogValidationError,
  NotFoundError,
  SafeDatabaseError,
  VersionConflictError,
} from "./errors.js";

export interface ListProductsOptions {
  q?: string;
  filters?: ProductFilters;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  items: Product[];
  page: number;
  limit: number;
  total: number;
}

export interface CreateProductInput {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  version?: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  stock?: number;
}

interface ProductRow extends RowDataPacket {
  id: string;
  name: string;
  description: string;
  category_id: string;
  price: string | number;
  stock: number;
  version: number;
  updated_at: Date | string;
}

interface CategoryRow extends RowDataPacket {
  id: string;
  name: string;
  description: string | null;
}

export function mapRowToProduct(row: ProductRow): Product {
  const updatedAt =
    row.updated_at instanceof Date
      ? row.updated_at.toISOString()
      : new Date(row.updated_at).toISOString();

  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description),
    categoryId: String(row.category_id),
    price: Number(row.price),
    stock: Number(row.stock),
    version: Number(row.version),
    updatedAt,
  };
}

export class CatalogRepository {
  constructor(private readonly pool: Pool) {}

  async getCategory(id: string): Promise<Category | null> {
    try {
      const [rows] = await this.pool.query<CategoryRow[]>(
        "SELECT id, name, description FROM categories WHERE id = ?",
        [id],
      );
      const row = rows[0];
      if (!row) {
        return null;
      }
      return {
        id: row.id,
        name: row.name,
      };
    } catch (error) {
      throw new SafeDatabaseError(error);
    }
  }

  async createCategory(category: { id: string; name: string; description?: string }): Promise<Category> {
    if (!category.id || category.id.trim().length === 0) {
      throw new CatalogValidationError("Category ID must be a non-empty string.");
    }
    if (!category.name || category.name.trim().length === 0) {
      throw new CatalogValidationError("Category name must be a non-empty string.");
    }

    try {
      await this.pool.query(
        "INSERT INTO categories (id, name, description) VALUES (?, ?, ?)",
        [category.id.trim(), category.name.trim(), category.description ?? null],
      );
      return {
        id: category.id.trim(),
        name: category.name.trim(),
      };
    } catch (error) {
      throw new SafeDatabaseError(error);
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    if (!id || id.trim().length === 0) {
      return null;
    }

    try {
      const [rows] = await this.pool.query<ProductRow[]>(
        "SELECT id, name, description, category_id, price, stock, version, updated_at FROM products WHERE id = ?",
        [id],
      );
      const row = rows[0];
      if (!row) {
        return null;
      }
      return mapRowToProduct(row);
    } catch (error) {
      throw new SafeDatabaseError(error);
    }
  }

  async listProducts(options: ListProductsOptions = {}): Promise<PaginatedProducts> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 20));
    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (options.q && options.q.trim().length > 0) {
      whereClauses.push("(name LIKE ? OR description LIKE ?)");
      const term = `%${options.q.trim()}%`;
      params.push(term, term);
    }

    const filters = options.filters ?? {};

    if (filters.categoryId && filters.categoryId.trim().length > 0) {
      whereClauses.push("category_id = ?");
      params.push(filters.categoryId.trim());
    }

    if (filters.minPrice !== undefined) {
      if (typeof filters.minPrice !== "number" || filters.minPrice < 0 || !Number.isFinite(filters.minPrice)) {
        throw new CatalogValidationError("minPrice must be a finite non-negative number.");
      }
      whereClauses.push("price >= ?");
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      if (typeof filters.maxPrice !== "number" || filters.maxPrice < 0 || !Number.isFinite(filters.maxPrice)) {
        throw new CatalogValidationError("maxPrice must be a finite non-negative number.");
      }
      whereClauses.push("price <= ?");
      params.push(filters.maxPrice);
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
      throw new CatalogValidationError("minPrice cannot be greater than maxPrice.");
    }

    if (filters.inStock === true) {
      whereClauses.push("stock > 0");
    } else if (filters.inStock === false) {
      whereClauses.push("stock = 0");
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    try {
      const countSql = `SELECT COUNT(*) AS total FROM products ${whereSql}`;
      const [countRows] = await this.pool.query<RowDataPacket[]>(countSql, params);
      const total = Number(countRows[0]?.["total"] ?? 0);

      const itemsSql = `
        SELECT id, name, description, category_id, price, stock, version, updated_at
        FROM products
        ${whereSql}
        ORDER BY id ASC
        LIMIT ? OFFSET ?
      `;
      const [itemsRows] = await this.pool.query<ProductRow[]>(itemsSql, [...params, limit, offset]);
      const items = itemsRows.map(mapRowToProduct);

      return {
        items,
        page,
        limit,
        total,
      };
    } catch (error) {
      if (error instanceof CatalogValidationError) {
        throw error;
      }
      throw new SafeDatabaseError(error);
    }
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    if (!input.id || input.id.trim().length === 0) {
      throw new CatalogValidationError("Product ID must be a non-empty string.");
    }
    if (!input.name || input.name.trim().length === 0) {
      throw new CatalogValidationError("Product name must be a non-empty string.");
    }
    if (!input.description || input.description.trim().length === 0) {
      throw new CatalogValidationError("Product description must be a non-empty string.");
    }
    if (!input.categoryId || input.categoryId.trim().length === 0) {
      throw new CatalogValidationError("Category ID must be a non-empty string.");
    }
    if (typeof input.price !== "number" || input.price < 0 || !Number.isFinite(input.price)) {
      throw new CatalogValidationError("Product price must be a finite non-negative number.");
    }
    if (typeof input.stock !== "number" || input.stock < 0 || !Number.isInteger(input.stock)) {
      throw new CatalogValidationError("Product stock must be a non-negative integer.");
    }

    const version = input.version !== undefined ? Math.max(1, input.version) : 1;
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        `INSERT INTO products (id, name, description, category_id, price, stock, version)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          input.id.trim(),
          input.name.trim(),
          input.description.trim(),
          input.categoryId.trim(),
          input.price,
          input.stock,
          version,
        ],
      );

      await connection.query(
        `INSERT INTO product_versions (product_id, version, price, stock, change_reason)
         VALUES (?, ?, ?, ?, ?)`,
        [input.id.trim(), version, input.price, input.stock, "initial_creation"],
      );

      const [rows] = await connection.query<ProductRow[]>(
        "SELECT id, name, description, category_id, price, stock, version, updated_at FROM products WHERE id = ?",
        [input.id.trim()],
      );

      await connection.commit();

      const created = rows[0];
      if (!created) {
        throw new Error("Failed to retrieve created product.");
      }
      return mapRowToProduct(created);
    } catch (error) {
      await connection.rollback();
      if (error instanceof CatalogValidationError) {
        throw error;
      }
      throw new SafeDatabaseError(error);
    } finally {
      connection.release();
    }
  }

  async updateProduct(
    id: string,
    patch: UpdateProductInput,
    expectedVersion?: number,
  ): Promise<Product> {
    if (!id || id.trim().length === 0) {
      throw new CatalogValidationError("Product ID must be a non-empty string.");
    }

    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (patch.name !== undefined) {
      if (!patch.name || patch.name.trim().length === 0) {
        throw new CatalogValidationError("Product name cannot be empty.");
      }
      updates.push("name = ?");
      params.push(patch.name.trim());
    }

    if (patch.description !== undefined) {
      if (!patch.description || patch.description.trim().length === 0) {
        throw new CatalogValidationError("Product description cannot be empty.");
      }
      updates.push("description = ?");
      params.push(patch.description.trim());
    }

    if (patch.categoryId !== undefined) {
      if (!patch.categoryId || patch.categoryId.trim().length === 0) {
        throw new CatalogValidationError("Category ID cannot be empty.");
      }
      updates.push("category_id = ?");
      params.push(patch.categoryId.trim());
    }

    if (patch.price !== undefined) {
      if (typeof patch.price !== "number" || patch.price < 0 || !Number.isFinite(patch.price)) {
        throw new CatalogValidationError("Product price must be a finite non-negative number.");
      }
      updates.push("price = ?");
      params.push(patch.price);
    }

    if (patch.stock !== undefined) {
      if (typeof patch.stock !== "number" || patch.stock < 0 || !Number.isInteger(patch.stock)) {
        throw new CatalogValidationError("Product stock must be a non-negative integer.");
      }
      updates.push("stock = ?");
      params.push(patch.stock);
    }

    if (updates.length === 0) {
      throw new CatalogValidationError("No update fields provided.");
    }

    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      // Lock row to verify current existence and version
      const [existingRows] = await connection.query<ProductRow[]>(
        "SELECT id, version FROM products WHERE id = ? FOR UPDATE",
        [id],
      );

      const existing = existingRows[0];
      if (!existing) {
        throw new NotFoundError("Product", id);
      }

      const currentVersion = Number(existing.version);
      if (expectedVersion !== undefined && currentVersion !== expectedVersion) {
        throw new VersionConflictError(id, expectedVersion, currentVersion);
      }

      const nextVersion = currentVersion + 1;
      updates.push("version = ?");
      params.push(nextVersion);

      const updateSql = `UPDATE products SET ${updates.join(", ")} WHERE id = ?`;
      params.push(id);

      await connection.query(updateSql, params);

      // Fetch the updated product
      const [updatedRows] = await connection.query<ProductRow[]>(
        "SELECT id, name, description, category_id, price, stock, version, updated_at FROM products WHERE id = ?",
        [id],
      );

      const updated = updatedRows[0];
      if (!updated) {
        throw new Error("Failed to retrieve updated product.");
      }

      // Record new version in product_versions
      await connection.query(
        `INSERT INTO product_versions (product_id, version, price, stock, change_reason)
         VALUES (?, ?, ?, ?, ?)`,
        [id, nextVersion, Number(updated.price), Number(updated.stock), "product_update"],
      );

      await connection.commit();
      return mapRowToProduct(updated);
    } catch (error) {
      await connection.rollback();
      if (error instanceof CatalogValidationError || error instanceof NotFoundError || error instanceof VersionConflictError) {
        throw error;
      }
      throw new SafeDatabaseError(error);
    } finally {
      connection.release();
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      return false;
    }

    try {
      const [result] = await this.pool.query<RowDataPacket[] & { affectedRows: number }>(
        "DELETE FROM products WHERE id = ?",
        [id],
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new SafeDatabaseError(error);
    }
  }
}
