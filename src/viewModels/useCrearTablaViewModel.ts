import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { dbService, collectionService, documentService } from "../services/api";

interface ColumnDraft {
  id: number;
  name: string;
}
interface TableDraft {
  id: number;
  name: string;
  columns: ColumnDraft[];
}

export function useCrearTablaViewModel() {
  const navigate = useNavigate();
  const [dbName, setDbName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<TableDraft[]>([
    { id: 1, name: "", columns: [{ id: 1, name: "" }] },
  ]);

  const addTable = () => {
    setTables((prev) => [
      ...prev,
      { id: Date.now(), name: "", columns: [{ id: Date.now() + 1, name: "" }] },
    ]);
  };

  const addColumn = (tableId: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, columns: [...t.columns, { id: Date.now(), name: "" }] }
          : t,
      ),
    );
  };

  const updateTableName = (tableId: number, name: string) =>
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, name } : t)),
    );

  const updateColumnName = (tableId: number, colId: number, name: string) =>
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              columns: t.columns.map((c) =>
                c.id === colId ? { ...c, name } : c,
              ),
            }
          : t,
      ),
    );

  const handleCreate = async () => {
    if (!dbName.trim()) {
      toast.error("Por favor, ingresa un nombre para la base de datos.");
      return;
    }

    const validTables = tables.filter((t) => t.name.trim());
    setLoading(true);

    try {
      // 1. Crear Base de Datos
      const dbResult = await dbService.create({ db_name: dbName.trim() });
      if (!dbResult.success) {
        toast.error("Error al crear DB: " + dbResult.error.detail);
        setLoading(false);
        return;
      }

      // 2. Crear cada tabla e inicializarla con sus "columnas"
      for (const table of validTables) {
        // Crear colección
        await collectionService.create({
          db_name: dbName.trim(),
          collection_name: table.name.trim(),
        });

        // Insertar un documento inicial para definir las llaves (columnas)
        const initialDoc = table.columns.reduce((acc, col) => {
          if (col.name.trim()) acc[col.name.trim()] = "";
          return acc;
        }, {} as any);

        await documentService.insert({
          db_name: dbName.trim(),
          collection_name: table.name.trim(),
          document: initialDoc,
        });
      }

      toast.success("Estructura creada exitosamente");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error inesperado: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    dbName,
    setDbName,
    loading,
    tables,
    addTable,
    addColumn,
    updateTableName,
    updateColumnName,
    handleCreate,
    navigate,
  };
}
