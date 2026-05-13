import {
  Database,
  Plus,
  Clock,
  Search,
  LogOut,
  Trash2,
  Loader2,
  Share2,
  X,
  User,
} from "lucide-react";
import { useDashboardMenuViewModel } from "../viewModels/useDashboardMenuViewModel";

export function DashboardMenu() {
  const vm = useDashboardMenuViewModel();

  return (
    <div
      className="flex flex-col md:flex-row h-screen p-4 md:p-6 gap-6 max-w-7xl mx-auto"
      onClick={() => vm.setActiveMenuId(null)}
    >
      {/* Sidebar Izquierdo */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-[#d9d9d9] rounded-br-[40px] rounded-tl-xl rounded-tr-xl md:rounded-tl-none md:rounded-tr-none md:rounded-br-[60px] p-6 pb-10 shadow-xl shadow-black/20 text-[#232323]">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            Bienvenido,
          </h1>
          <p className="text-lg md:text-xl font-semibold text-gray-800">
            Administrador
          </p>
        </div>

        <button
          onClick={() => vm.navigate("/dashboard/create")}
          className="bg-[#54A796] hover:bg-[#468e7f] text-white p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 shadow-lg shadow-[#54A796]/20 mx-4 md:mx-0 md:ml-6"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-lg md:text-xl font-semibold">
              Crea nueva db
            </span>
          </div>
          <Database className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="mt-auto mx-4 md:mx-0 md:ml-6 pb-2">
          <button
            onClick={vm.handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="w-full md:w-2/3 flex flex-col mt-2 md:mt-12">
        <div className="flex items-center justify-between mb-6 px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Database className="w-6 h-6 text-[#54A796]" />
            Bases de datos Existentes
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[30px] p-5 md:p-8 shadow-2xl flex-1 overflow-hidden flex flex-col">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={vm.search}
              onChange={(e) => vm.setSearch(e.target.value)}
              placeholder="Buscar base de datos..."
              className="w-full text-sm bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#54A796]/50 transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {vm.loading ? (
              <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Cargando...</span>
              </div>
            ) : vm.databases.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                No hay bases de datos.
              </div>
            ) : (
              vm.databases.map((db) => (
                <div
                  key={db.id}
                  className="group bg-white/5 hover:bg-white/15 border border-transparent hover:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-all duration-200 relative"
                >
                  <div
                    onClick={() => vm.navigate(`/dashboard/edit/${db.name}`)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="bg-[#54A796]/20 text-[#54A796] p-2.5 rounded-xl group-hover:bg-[#54A796] group-hover:text-white transition-colors">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="text-lg md:text-xl font-semibold text-white/90 group-hover:text-white">
                      {db.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 sm:mt-0">
                    <div className="flex items-center gap-1.5 mr-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{db.lastModified}</span>
                    </div>

                    {/* BOTONES DIRECTOS (Sin menú desplegable) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => vm.openShareModal(e, db.name)}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center gap-1.5"
                        title="Compartir"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline font-medium">
                          Asignar
                        </span>
                      </button>

                      <button
                        onClick={(e) => vm.handleDelete(e, db.id, db.name)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-1.5"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline font-medium">
                          Borrar
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Compartir */}
      {vm.isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => vm.setIsShareModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#54A796]" /> Asignar Usuario
            </h3>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                  Seleccionar Usuario
                </label>
                <select
                  value={vm.targetEmail}
                  onChange={(e) => vm.setTargetEmail(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#54A796] transition-colors text-sm"
                >
                  {/* Validar si la lista está vacía */}
                  {vm.usersList && vm.usersList.length > 0 ? (
                    vm.usersList.map((u) => (
                      <option key={u.email} value={u.email}>
                        {u.username} ({u.email})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No se encontraron usuarios
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                  Permisos
                </label>
                <select
                  value={vm.shareRole}
                  onChange={(e) => vm.setShareRole(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#54A796] transition-colors text-sm"
                >
                  <option value="lectura">Solo Lectura</option>
                  <option value="escritura">Escritura y Edición</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => vm.setIsShareModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={vm.handleShare}
                disabled={vm.sharing}
                className="bg-[#54A796] hover:bg-[#468e7f] disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
              >
                {vm.sharing && <Loader2 className="w-4 h-4 animate-spin" />}
                Asignar Acceso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
