import type {
  AuthCredentials,
  RegisterCredentials,
  AuthResponse,
  DatabaseModel,
  CollectionModel,
  DocumentModel,
  UpdateDocumentModel,
  DeleteDocumentModel,
  FilterQueryModel,
  AggregateQueryModel,
  DistinctQueryModel,
  JoinQueryModel,
  ApiResult,
} from "../models/types";

// ─── Config ─────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8000";

// ─── Token helpers ──────────────────────────────────────────────
export const tokenService = {
  get: (): string | null => localStorage.getItem("access_token"),
  set: (token: string) => localStorage.setItem("access_token", token),
  clear: () => localStorage.removeItem("access_token"),
  isSet: (): boolean => !!localStorage.getItem("access_token"),
};

// ─── Base fetch wrapper ─────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true,
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (requiresAuth) {
    const token = tokenService.get();
    if (!token) {
      return {
        success: false,
        error: { detail: "No autenticado", status: 401 },
      };
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    console.log(
      `[API] ${options.method || "GET"} ${BASE_URL}${path}`,
      JSON.parse((options.body as string) || "{}"),
    );
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let detail = `Error ${res.status}`;
      try {
        const errBody = await res.json();
        detail = errBody?.detail ?? detail;
        console.error(`[API Error] ${detail}`, errBody);
      } catch {
        // ignore parse errors
      }
      return { success: false, error: { detail, status: res.status } };
    }

    const data = (await res.json()) as T;
    console.log(`[API Success] ${options.method || "GET"} ${path}`, data);
    return { success: true, data };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Error desconocido";
    console.error(`[API Connection Error] ${BASE_URL}${path}:`, errorMsg);
    return {
      success: false,
      error: { detail: `No se pudo conectar con el servidor: ${errorMsg}` },
    };
  }
}

// ─── Auth Service ───────────────────────────────────────────────
export const authService = {
  login: (credentials: AuthCredentials) =>
    apiFetch<AuthResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
      false,
    ),

  register: (credentials: RegisterCredentials) =>
    apiFetch<AuthResponse>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
      false,
    ),
  getUsers: () =>
    apiFetch<{ users: { email: string; username: string }[] }>("/auth/users", {
      method: "GET",
    }),
};

// ─── Database Service ───────────────────────────────────────────
export const dbService = {
  create: (payload: DatabaseModel) =>
    apiFetch<{ message: string }>("/db/create", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // CORREGIDO: El backend devuelve un objeto con la llave "databases"
  list: () => apiFetch<{ databases: string[] }>("/db/list", { method: "GET" }),

  delete: (payload: DatabaseModel) =>
    apiFetch<{ message: string }>("/db/delete", {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),

  assign: (payload: { db_name: string; target_email: string; role: string }) =>
    apiFetch<{ message: string }>("/db/assign", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ─── Collection Service ──────────────────────────────────────────
export const collectionService = {
  create: (payload: CollectionModel) =>
    apiFetch<{ message: string }>("/collection/create", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // CORREGIDO: El backend devuelve un objeto con la llave "collections"
  list: (db_name: string) =>
    apiFetch<{ collections: string[] }>(
      `/collection/list?db_name=${encodeURIComponent(db_name)}`,
      {
        method: "GET",
      },
    ),

  delete: (payload: CollectionModel) =>
    apiFetch<{ message: string }>("/collection/delete", {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),
};

// ─── Document Service ───────────────────────────────────────────
export const documentService = {
  insert: (payload: DocumentModel) =>
    apiFetch<{ inserted_id: string; message: string }>("/document/insert", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // CORREGIDO: El backend devuelve un objeto con la llave "data"
  find: (db_name: string, collection_name: string) =>
    apiFetch<{ data: Record<string, unknown>[] }>(
      `/document/find?db_name=${encodeURIComponent(db_name)}&collection_name=${encodeURIComponent(collection_name)}`,
      { method: "GET" },
    ),

  update: (payload: UpdateDocumentModel) =>
    apiFetch<{ modified_count: number; message: string }>("/document/update", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (payload: DeleteDocumentModel) =>
    apiFetch<{ deleted_count: number; message: string }>("/document/delete", {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),
};

// ─── Query Service ──────────────────────────────────────────────
export const queryService = {
  // CORREGIDO: Las consultas devuelven un objeto con la llave "data"
  filter: (payload: FilterQueryModel) =>
    apiFetch<{ data: Record<string, unknown>[] }>("/query/filter", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  aggregate: (payload: AggregateQueryModel) =>
    apiFetch<{ data: Record<string, unknown>[] }>("/query/aggregate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  distinct: (payload: DistinctQueryModel) =>
    apiFetch<{ data: unknown[] }>("/query/distinct", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  join: (payload: JoinQueryModel) =>
    apiFetch<{ data: Record<string, unknown>[] }>("/query/join", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
