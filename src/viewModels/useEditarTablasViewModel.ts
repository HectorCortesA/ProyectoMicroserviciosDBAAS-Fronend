import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { collectionService, documentService } from "../services/api"; // Ajusta la ruta si es necesario
import type { DatabaseType, TableType } from "../models/types"; // Ajusta la ruta si es necesario

export function useEditarTablasViewModel() {
  const navigate = useNavigate();
  const { dbId } = useParams<{ dbId: string }>();
  const dbName = dbId ?? "";

  const [db, setDb] = useState<DatabaseType | null>(null);
  const [tables, setTables] = useState<TableType[]>([]);
  const [activeTableId, setActiveTableId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados para los Modales
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const fetchTableData = useCallback(async () => {
    if (!dbName) return;
    setLoading(true);

    try {
      const collResult = await collectionService.list(dbName);

      if (collResult.success && collResult.data.collections) {
        const tablesData: TableType[] = [];

        for (const collName of collResult.data.collections) {
          const docsResult = await documentService.find(dbName, collName);

          let columns: string[] = [];
          let data: any[] = [];

          if (docsResult.success && docsResult.data.data.length > 0) {
            data = docsResult.data.data;
            // Extraer nombres de las columnas, ignorando el _id interno de Mongo
            columns = Object.keys(data[0]).filter((key) => key !== "_id");
          } else {
            columns = ["dato"]; // Columna por defecto si está vacía
          }

          tablesData.push({ id: collName, name: collName, columns, data });
        }

        setTables(tablesData);
        if (tablesData.length > 0) setActiveTableId(tablesData[0].id);

        setDb({
          id: dbName,
          name: dbName,
          lastModified: "Ahora",
          tables: tablesData,
        });
      } else {
        setDb({ id: dbName, name: dbName, lastModified: "Ahora", tables: [] });
        setTables([]);
      }
    } catch (error) {
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [dbName]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const activeTable = tables.find((t) => t.id === activeTableId);

  // --- Lógica de Edición de Tablas ---

  const handleCellChange = (rowIndex: number, col: string, value: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== activeTableId) return t;
        const newData = [...t.data];
        newData[rowIndex] = { ...newData[rowIndex], [col]: value };
        return { ...t, data: newData };
      }),
    );
  };

  const handleAddRow = () => {
    if (!activeTable) return;
    // Crea una fila vacía con las columnas actuales
    const emptyRow = activeTable.columns.reduce<Record<string, unknown>>(
      (acc, col) => ({ ...acc, [col]: "" }),
      {},
    );
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTableId ? { ...t, data: [...t.data, emptyRow] } : t,
      ),
    );
  };

  const handleConfirmAddColumn = () => {
    if (!activeTable || !newColumnName.trim()) return;
    const col = newColumnName.trim();

    if (activeTable.columns.includes(col)) {
      toast.error("Ya existe una columna con ese nombre.");
      return;
    }

    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTableId
          ? {
              ...t,
              columns: [...t.columns, col],
              data: t.data.map((row) => ({ ...row, [col]: "" })), // Añade la columna a todas las filas
            }
          : t,
      ),
    );
    toast.success(`Columna "${col}" agregada.`);
    setIsColumnModalOpen(false);
    setNewColumnName("");
  };

  const handleConfirmAddTable = async () => {
    if (!newTableName.trim()) return;

    try {
      const res = await collectionService.create({
        db_name: dbName,
        collection_name: newTableName.trim(),
      });

      if (res.success) {
        // En Mongo debemos insertar un documento para que las columnas "existan"
        await documentService.insert({
          db_name: dbName,
          collection_name: newTableName.trim(),
          document: { dato: "" },
        });

        await fetchTableData();
        setIsTableModalOpen(false);
        setNewTableName("");
        toast.success("Tabla creada");
      } else {
        toast.error(res.error?.detail || "Error al crear la tabla");
      }
    } catch (e) {
      toast.error("Error al crear la tabla");
    }
  };

  const handleSave = async () => {
    if (!activeTable) return;
    setSaving(true);

    try {
      for (const row of activeTable.data) {
        // 1. SEPARAR EL _id: Extraemos el _id y dejamos el resto en "dataToSave"
        // Esto es CRUCIAL para que MongoDB no rechace la actualización
        const { _id, ...dataToSave } = row as any;

        // 2. Opcional: Verificar si la fila está completamente vacía
        // (Para no guardar basura si el usuario le dio a "Añadir fila" pero no escribió nada)
        const hasData = Object.values(dataToSave).some((val) => val !== "");

        if (_id) {
          // ---> ACTUALIZAR (El registro ya existe)
          await documentService.update({
            db_name: dbName,
            collection_name: activeTable.name,
            filter_query: { _id: String(_id) }, // Usamos el _id solo para buscar
            new_data: dataToSave, // Enviamos los datos SIN el _id
          });
        } else {
          // ---> INSERTAR (Es un registro nuevo)
          if (hasData || activeTable.data.length === 1) {
            await documentService.insert({
              db_name: dbName,
              collection_name: activeTable.name,
              document: dataToSave, // Mongo le generará su propio _id
            });
          }
        }
      }

      await fetchTableData(); // Refrescamos para obtener los datos actualizados
      toast.success("Cambios guardados correctamente");
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar la información");
    } finally {
      setSaving(false);
    }
  };

  // ¡AQUÍ ESTABA EL ERROR! Faltaba exportar todas estas funciones para la Vista
  return {
    db,
    tables,
    activeTable,
    activeTableId,
    setActiveTableId,
    isDropdownOpen,
    setIsDropdownOpen,
    loading,
    saving,
    isTableModalOpen,
    setIsTableModalOpen,
    newTableName,
    setNewTableName,
    isColumnModalOpen,
    setIsColumnModalOpen,
    newColumnName,
    setNewColumnName,
    handleCellChange,
    handleAddRow,
    handleConfirmAddColumn,
    handleConfirmAddTable,
    handleSave,
    navigate,
    dbName,
  };
}
