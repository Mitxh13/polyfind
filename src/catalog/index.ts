export {
  createDatabasePool,
  getDatabasePool,
  closeDatabasePool,
  parseDatabaseUrl,
  loadEnvironment,
} from "./db.js";

export {
  runMigrations,
  getAppliedMigrations,
  getAvailableMigrationFiles,
  dropAllTables,
  DEFAULT_MIGRATIONS_DIR,
  type MigrationResult,
} from "./migrations.js";

export {
  CatalogRepository,
  mapRowToProduct,
  type ListProductsOptions,
  type PaginatedProducts,
  type CreateProductInput,
  type UpdateProductInput,
} from "./repository.js";

export {
  CatalogError,
  CatalogValidationError,
  NotFoundError,
  VersionConflictError,
  SafeDatabaseError,
  sanitizeDatabaseErrorMessage,
} from "./errors.js";

export {
  handleListProducts,
  handleGetProduct,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  formatErrorResponse,
  type ApiResponse,
  type ApiErrorBody,
} from "./api.js";
