import {
  ChevronDown,
  Save,
  Menu as MenuIcon,
  Database,
  Table as TableIcon,
  Plus,
  Columns,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEditarTablasViewModel } from "../viewModels/useEditarTablasViewModel";

export function EditarTablasView() {
  const vm = useEditarTablasViewModel();

  if (vm.loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-white">
        <Loader2 className="w-5 h-5 animate-spin text-[#54A796]" />
        Cargando base de datos...
      </div>
    );
  }

  if (!vm.db) return null;

  return (
    <div
      className="p-4 md:p-6 max-w-[1200px] mx-auto min-h-screen flex flex-col relative"
      onClick={() => vm.setIsDropdownOpen(false)}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#54A796]" />
            <h1 className="text-lg md:text-xl font-semibold text-white/90">
              Nombre de la base de datos
            </h1>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white pl-7">
            {vm.db.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={vm.handleSave}
            disabled={vm.saving}
            className="bg-white/10 hover:bg-[#54A796] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            {vm.saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Guardar base de datos</span>
            <span className="sm:hidden">Guardar</span>
          </button>
          <button
            onClick={() => vm.navigate("/dashboard")}
            className="bg-[#d9d9d9] hover:bg-white text-black px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <MenuIcon className="w-4 h-4" />
            Menú
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Table selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 relative z-10">
          <label className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-gray-400" />
            Tabla:
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  vm.setIsDropdownOpen(!vm.isDropdownOpen);
                }}
                className="w-full sm:w-auto bg-[#d9d9d9] text-black px-5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between min-w-[200px] hover:bg-white transition-colors"
                disabled={vm.tables.length === 0}
              >
                {vm.activeTable?.name || "Sin tablas"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ml-3 ${vm.isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {vm.isDropdownOpen && vm.tables.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-xl overflow-hidden z-20">
                  {vm.tables.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        vm.setActiveTableId(t.id);
                        vm.setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-sm font-medium transition-colors ${vm.activeTableId === t.id ? "bg-[#54A796]/10 text-[#54A796]" : "text-black hover:bg-gray-100"}`}
                    >
                      {t.name}
                    </button>
                  ))}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        vm.setIsDropdownOpen(false);
                        vm.setIsTableModalOpen(true);
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm font-semibold text-[#54A796] hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva tabla...
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => vm.setIsTableModalOpen(true)}
              className="bg-white/10 hover:bg-[#54A796] text-white p-2.5 rounded-xl transition-colors"
              title="Añadir nueva tabla"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Data grid */}
        <div className="flex-1 bg-[#d9d9d9] rounded-2xl md:rounded-[30px] p-5 md:p-6 overflow-hidden flex flex-col shadow-2xl relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {vm.activeTable?.name || "Selecciona o crea una tabla"}
            </h2>
            {vm.activeTable && (
              <button
                onClick={() => vm.setIsColumnModalOpen(true)}
                className="bg-[#54A796] hover:bg-[#468e7f] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Columns className="w-4 h-4" />
                <span className="hidden sm:inline">Añadir columna</span>
                <span className="sm:hidden">Columna</span>
              </button>
            )}
          </div>

          {vm.activeTable ? (
            <div className="flex-1 bg-white/50 rounded-xl overflow-auto border border-gray-300">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    {vm.activeTable.columns.map((col) => (
                      <th
                        key={col}
                        className="p-3 font-bold text-gray-700 border-b border-gray-300 uppercase text-xs tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vm.activeTable.data.map((row, i) => (
                    <tr key={i} className="hover:bg-white/80 transition-colors">
                      {vm.activeTable!.columns.map((col) => (
                        <td
                          key={`${i}-${col}`}
                          className="p-1 border-b border-gray-200/50 min-w-[120px]"
                        >
                          <input
                            type="text"
                            value={String(row[col] ?? "")}
                            onChange={(e) =>
                              vm.handleCellChange(i, col, e.target.value)
                            }
                            className="w-full bg-transparent hover:bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#54A796]/50 rounded px-2 py-1.5 outline-none text-sm text-gray-800 transition-all font-medium"
                            placeholder="..."
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan={vm.activeTable.columns.length || 1}
                      className="p-0 border-b border-gray-200/50"
                    >
                      <button
                        onClick={vm.handleAddRow}
                        className="w-full text-left p-3 text-sm text-gray-500 font-semibold italic flex items-center gap-1.5 hover:text-[#54A796] hover:bg-white/50 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Agregar nuevo registro
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white/30 rounded-xl border border-gray-300">
              <TableIcon className="w-12 h-12 mb-3 text-gray-400" />
              <p>No hay tablas en esta base de datos.</p>
              <button
                onClick={() => vm.setIsTableModalOpen(true)}
                className="mt-4 text-[#54A796] font-semibold hover:underline"
              >
                Crear primera tabla
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(vm.isTableModalOpen || vm.isColumnModalOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#232323] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-white">
                  {vm.isTableModalOpen
                    ? "Crear Nueva Tabla"
                    : "Añadir Nueva Columna"}
                </h3>
                <button
                  onClick={() => {
                    vm.setIsTableModalOpen(false);
                    vm.setIsColumnModalOpen(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {vm.isTableModalOpen
                    ? "Nombre de la tabla"
                    : "Nombre de la columna (Entidad)"}
                </label>
                <input
                  type="text"
                  autoFocus
                  value={
                    vm.isTableModalOpen ? vm.newTableName : vm.newColumnName
                  }
                  onChange={(e) =>
                    vm.isTableModalOpen
                      ? vm.setNewTableName(e.target.value)
                      : vm.setNewColumnName(e.target.value)
                  }
                  placeholder={
                    vm.isTableModalOpen ? "Ej. Pedidos" : "Ej. fecha_creacion"
                  }
                  className="w-full bg-white/10 border border-white/20 focus:border-[#54A796] rounded-xl px-4 py-3 text-white outline-none transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      vm.isTableModalOpen
                        ? vm.handleConfirmAddTable()
                        : vm.handleConfirmAddColumn();
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    vm.setIsTableModalOpen(false);
                    vm.setIsColumnModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={
                    vm.isTableModalOpen
                      ? vm.handleConfirmAddTable
                      : vm.handleConfirmAddColumn
                  }
                  className="bg-[#54A796] hover:bg-[#468e7f] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg"
                >
                  {vm.isTableModalOpen ? "Crear Tabla" : "Añadir Columna"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
