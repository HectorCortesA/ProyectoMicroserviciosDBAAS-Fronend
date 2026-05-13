// ─── Auth Models ───────────────────────────────────────────────

export type UserRole =
  | "administrador"
  | "usuario de escritura"
  | "usuario de lectura";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  token_type?: string;
}

export interface DecodedToken {
  sub: string; // email or user ID
  role: UserRole;
  exp: number;
}

// ─── Database Models ────────────────────────────────────────────

export interface DatabaseModel {
  db_name: string;
}

export interface CollectionModel {
  db_name: string;
  collection_name: string;
}

export interface DocumentModel {
  db_name: string;
  collection_name: string;
  document: Record<string, unknown>;
}

export interface UpdateDocumentModel {
  db_name: string;
  collection_name: string;
  filter_query: Record<string, unknown>;
  new_data: Record<string, unknown>;
}

export interface DeleteDocumentModel {
  db_name: string;
  collection_name: string;
  filter_query: Record<string, unknown>;
}

// ─── Query Models ───────────────────────────────────────────────

export interface FilterQueryModel {
  db_name: string;
  collection_name: string;
  filters?: Record<string, unknown>;
}

export interface AggregateQueryModel {
  db_name: string;
  collection_name: string;
  pipeline: Record<string, unknown>[];
}

export interface DistinctQueryModel {
  db_name: string;
  collection_name: string;
  field: string;
}

export interface JoinQueryModel {
  db_name: string;
  collection_name: string;
  from_table: string;
  local_field: string;
  foreign_field: string;
  as_name: string;
}

// ─── UI State Models ────────────────────────────────────────────

export interface TableType {
  id: string;
  name: string; // maps to collection_name
  columns: string[];
  data: Record<string, unknown>[];
}

export interface DatabaseType {
  id: string;
  name: string; // maps to db_name
  tables: TableType[];

  // UI metadata
  lastModified?: string;

  // Optional backend timestamps
  created_at?: string;
  updated_at?: string;
}

// ─── API Response Wrappers ──────────────────────────────────────

export interface ApiError {
  detail: string;
  status?: number;
}

export type ApiResult<T> =
  | {
      success: true;
      data: T;
      error?: never;
    }
  | {
      success: false;
      error: ApiError;
      data?: never;
    };
