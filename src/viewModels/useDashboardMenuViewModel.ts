import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dbService, tokenService } from "../services/api"; // Asegúrate de que la ruta apunte a tu archivo api.ts

export interface DatabaseCard {
  id: string;
  name: string;
  lastModified: string;
}

export function useDashboardMenuViewModel() {
  const navigate = useNavigate();
  const [databases, setDatabases] = useState<DatabaseCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Cargar las bases de datos al iniciar el componente
  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    setLoading(true);
    try {
      const res = await dbService.list();

      // Evaluamos estrictamente res.success para evitar el error de tipos en res.error
      if (res.success) {
        const mappedDbs = res.data.databases.map((dbName) => ({
          id: dbName,
          name: dbName,
          lastModified: "Reciente",
        }));
        setDatabases(mappedDbs);
      } else {
        console.error("Error al cargar DBs:", res.error.detail);
        setDatabases([]);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenService.clear();
    navigate("/");
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  // Única declaración de handleDelete
  const handleDelete = async (
    e: React.MouseEvent,
    id: string,
    name: string,
  ) => {
    e.stopPropagation();
    setActiveMenuId(null);

    const isConfirmed = window.confirm(
      `¿Estás seguro de eliminar la base de datos '${name}'?`,
    );
    if (!isConfirmed) return;

    try {
      const res = await dbService.delete({ db_name: name });

      // Evaluamos estrictamente res.success
      if (res.success) {
        setDatabases((prev) => prev.filter((db) => db.name !== name));
        alert("Base de datos eliminada correctamente");
      } else {
        alert("Error al eliminar: " + res.error.detail);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  // Filtrado de búsqueda
  const filteredDatabases = databases.filter((db) =>
    db.name.toLowerCase().includes(search.toLowerCase()),
  );

  return {
    databases: filteredDatabases,
    loading,
    search,
    setSearch,
    activeMenuId,
    setActiveMenuId,
    toggleMenu,
    handleDelete,
    navigate,
    handleLogout,
  };
}
