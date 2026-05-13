import {
  Database,
  Plus,
  Clock,
  Search,
  MoreVertical,
  LogOut,
  Trash2,
  Loader2,
} from "lucide-react";
import { useDashboardMenuViewModel } from "../viewModels/useDashboardMenuViewModel";

export function DashboardMenu() {
  const vm = useDashboardMenuViewModel();

  return (
    <div
      className="flex flex-col md:flex-row h-screen p-4 md:p-6 gap-6 max-w-7xl mx-auto"
      onClick={() => vm.setActiveMenuId(null)}
    >
      {/* Left Sidebar */}
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

      {/* Right Content */}
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
                <span className="text-sm">Cargando bases de datos...</span>
              </div>
            ) : vm.databases.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                No hay bases de datos disponibles.
              </div>
            ) : (
              vm.databases.map((db) => (
                <div
                  key={db.id}
                  onClick={() => vm.navigate(`/dashboard/edit/${db.name}`)}
                  className="group bg-white/5 hover:bg-white/15 border border-transparent hover:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer transition-all duration-200 relative"
                >
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className="bg-[#54A796]/20 text-[#54A796] p-2.5 rounded-xl group-hover:bg-[#54A796] group-hover:text-white transition-colors">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="text-lg md:text-xl font-semibold text-white/90 group-hover:text-white">
                      {db.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Modificado: {db.lastModified}</span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => vm.toggleMenu(e, db.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-300" />
                      </button>

                      {vm.activeMenuId === db.id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-[#2a2a2a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                          <button
                            onClick={(e) => vm.handleDelete(e, db.id, db.name)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Borrar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
