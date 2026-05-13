import {
  X,
  Plus,
  Database,
  Table,
  Columns,
  Check,
  Loader2,
} from "lucide-react";
import { useCrearTablaViewModel } from "../viewModels/useCrearTablaViewModel";

export function CrearTablaView() {
  const vm = useCrearTablaViewModel();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen flex flex-col relative">
      <div className="flex justify-end items-center gap-3 mb-8">
        <button
          onClick={vm.handleCreate}
          disabled={vm.loading}
          className="bg-[#54A796] hover:bg-[#468e7f] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#54A796]/20"
        >
          {vm.loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Crear db
        </button>
        <button
          onClick={() => vm.navigate("/dashboard")}
          className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-3xl space-y-8 pb-20">
          {/* DB Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-white/5 p-5 rounded-2xl border border-white/10">
            <label className="text-lg md:text-xl font-semibold text-white w-40 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#54A796]" />
              Nombre de db
            </label>
            <input
              type="text"
              value={vm.dbName}
              onChange={(e) => vm.setDbName(e.target.value)}
              placeholder="Ej. Mi_Base_Datos"
              className="flex-1 bg-white/10 border border-white/10 focus:border-[#54A796] rounded-xl py-2.5 px-4 text-white placeholder-gray-500 outline-none transition-colors text-sm"
            />
          </div>

          {/* Tables */}
          <div className="space-y-6">
            {vm.tables.map((table, tIndex) => (
              <div
                key={table.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 relative"
              >
                {tIndex > 0 && (
                  <div className="absolute -top-3 -left-3 bg-[#232323] p-1 rounded-full">
                    <Table className="w-5 h-5 text-gray-500" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6">
                  <label className="text-lg md:text-xl font-semibold text-white/90 w-40 flex items-center gap-2">
                    <Table className="w-4 h-4 text-gray-400" />
                    Nombre de tabla
                  </label>
                  <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      value={table.name}
                      onChange={(e) =>
                        vm.updateTableName(table.id, e.target.value)
                      }
                      placeholder="Ej. Usuarios"
                      className="w-full sm:w-auto flex-1 bg-white/10 border border-white/10 focus:border-[#54A796] rounded-xl py-2.5 px-4 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={vm.addTable}
                        className="bg-white/10 hover:bg-[#54A796] text-white p-2.5 rounded-xl transition-colors"
                        title="Añadir otra tabla"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Columns */}
                <div className="pl-0 sm:pl-[184px] space-y-3">
                  <div className="text-sm font-semibold text-[#54A796] mb-3 flex items-center gap-1.5">
                    <Columns className="w-3.5 h-3.5" />
                    Columnas de esta tabla
                  </div>

                  {table.columns.map((col, cIndex) => (
                    <div
                      key={col.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      <label className="text-sm font-medium text-gray-400 sm:w-24 whitespace-nowrap">
                        Columna {cIndex > 0 ? cIndex + 1 : ""}
                      </label>
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) =>
                            vm.updateColumnName(
                              table.id,
                              col.id,
                              e.target.value,
                            )
                          }
                          placeholder="Ej. id, nombre, email..."
                          className="w-full sm:w-auto flex-1 bg-white/5 border border-white/10 focus:border-[#54A796] rounded-xl py-2.5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                        />
                        {cIndex === table.columns.length - 1 && (
                          <button
                            onClick={() => vm.addColumn(table.id)}
                            className="bg-white/5 hover:bg-white/20 border border-white/5 p-2.5 rounded-xl text-white transition-colors"
                            title="Añadir otra columna"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
