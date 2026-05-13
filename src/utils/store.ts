export interface TableType {
  id: string;
  name: string;
  columns: string[];
  data: any[];
}

export interface DatabaseType {
  id: string;
  name: string;
  lastModified: string;
  tables: TableType[];
}

const STORAGE_KEY = "mock_databases_v1";

const defaultInitialData: DatabaseType[] = [
  {
    id: "1",
    name: "Inventario_Principal",
    lastModified: "12/05/2026 14:30",
    tables: [
      {
        id: "t1",
        name: "Usuarios",
        columns: ["id", "nombre", "email", "rol"],
        data: [
          {
            id: 1,
            nombre: "Ana García",
            email: "ana@ejemplo.com",
            rol: "Admin",
          },
          {
            id: 2,
            nombre: "Carlos Ruiz",
            email: "carlos@ejemplo.com",
            rol: "Usuario",
          },
          {
            id: 3,
            nombre: "María Lopez",
            email: "maria@ejemplo.com",
            rol: "Usuario",
          },
        ],
      },
      {
        id: "t2",
        name: "Productos",
        columns: ["id", "nombre", "precio", "stock"],
        data: [
          { id: 1, nombre: "Laptop Pro", precio: "$1200", stock: 45 },
          { id: 2, nombre: "Teclado Mecánico", precio: "$150", stock: 120 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Usuarios_App",
    lastModified: "10/05/2026 09:15",
    tables: [],
  },
  { id: "3", name: "Ventas_Q2", lastModified: "08/05/2026 18:45", tables: [] },
];

export const getDatabases = (): DatabaseType[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading from localStorage", e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInitialData));
  return defaultInitialData;
};

export const saveDatabases = (dbs: DatabaseType[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dbs));
};

export const getDatabaseById = (id: string): DatabaseType | undefined => {
  return getDatabases().find((db) => db.id === id);
};

export const deleteDatabase = (id: string): DatabaseType[] => {
  const dbs = getDatabases().filter((db) => db.id !== id);
  saveDatabases(dbs);
  return dbs;
};

export const addDatabase = (db: DatabaseType) => {
  const dbs = getDatabases();
  dbs.push(db);
  saveDatabases(dbs);
};

export const updateDatabase = (id: string, updatedDb: DatabaseType) => {
  const dbs = getDatabases();
  const index = dbs.findIndex((db) => db.id === id);
  if (index !== -1) {
    dbs[index] = updatedDb;
    saveDatabases(dbs);
  }
};
