import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dbService, authService, tokenService } from "../services/api";
import { toast } from "sonner";

export interface DatabaseCard {
  id: string;
  name: string;
  lastModified: string;
}

export interface UserListItem {
  email: string;
  username: string;
}

export function useDashboardMenuViewModel() {
  const navigate = useNavigate();

  // Estados de la lista de DB
  const [databases, setDatabases] = useState<DatabaseCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Estados para Compartir / Asignar
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [dbToShare, setDbToShare] = useState<string | null>(null);
  const [usersList, setUsersList] = useState<UserListItem[]>([]);
  const [targetEmail, setTargetEmail] = useState("");
  const [shareRole, setShareRole] = useState("lectura");
  const [sharing, setSharing] = useState(false);

  const fetchDatabases = async () => {
    setLoading(true);
    try {
      const res = await dbService.list();
      if (!res.success) {
        console.error("Error al cargar DBs:", res.error.detail);
        setDatabases([]);
        return;
      }
      const mappedDbs = res.data.databases.map((dbName) => ({
        id: dbName,
        name: dbName,
        lastModified: "Reciente",
      }));
      setDatabases(mappedDbs);
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDatabases();
  }, []);

  const handleLogout = () => {
    tokenService.clear();
    localStorage.removeItem("current_username");
    localStorage.removeItem("current_email");
    navigate("/");
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (
    e: React.MouseEvent,
    _id: string,
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
      if (!res.success) {
        toast.error("Error al eliminar: " + res.error.detail);
        return;
      }
      setDatabases((prev) => prev.filter((db) => db.name !== name));
      toast.success("Base de datos eliminada correctamente");
    } catch {
      toast.error("Error inesperado al eliminar");
    }
  };

  // Carga la lista de usuarios al abrir el modal de compartir
  const openShareModal = async (e: React.MouseEvent, dbName: string) => {
    e.stopPropagation();
    setDbToShare(dbName);
    setIsShareModalOpen(true);
    setActiveMenuId(null);

    try {
      const res = await authService.getUsers();
      if (res.success && res.data) {
        setUsersList(res.data.users);
        if (res.data.users.length > 0) {
          setTargetEmail(res.data.users[0].email);
        }
      }
    } catch {
      toast.error("No se pudo cargar la lista de usuarios");
    }
  };

  const handleShare = async () => {
    if (!dbToShare || !targetEmail.trim()) {
      toast.error("Selecciona un usuario válido");
      return;
    }

    setSharing(true);
    try {
      const res = await dbService.assign({
        db_name: dbToShare,
        target_email: targetEmail.trim(),
        role: shareRole,
      });

      if (!res.success) {
        toast.error(res.error?.detail || "Error al asignar");
        return;
      }
      toast.success(res.data?.message || "Acceso asignado");
      setIsShareModalOpen(false);
      setTargetEmail("");
    } catch {
      toast.error("Error al compartir");
    } finally {
      setSharing(false);
    }
  };

  const filteredDatabases = databases.filter((db) =>
    db.name.toLowerCase().includes(search.toLowerCase()),
  );

  const getUsername = () => {
    const stored = localStorage.getItem("current_username");
    if (stored) return stored;

    const token = tokenService.get();
    if (!token) return "Usuario";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.username) return payload.username;
      if (payload.sub) return payload.sub.split("@")[0];
      return "Usuario";
    } catch {
      return "Usuario";
    }
  };

  const username = getUsername();

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
    // Compartir
    isShareModalOpen,
    setIsShareModalOpen,
    dbToShare,
    usersList,
    targetEmail,
    setTargetEmail,
    shareRole,
    setShareRole,
    sharing,
    openShareModal,
    handleShare,
    username,
    getUsername,
  };
}
