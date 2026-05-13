import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuthViewModel } from "../viewModels/useAuthViewModel";
import "../index.css";
const DbTableIllustration = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-lg mb-6"
  >
    <ellipse
      cx="120"
      cy="50"
      rx="60"
      ry="20"
      fill="white"
      fillOpacity="0.15"
      stroke="white"
      strokeWidth="4"
    />
    <path
      d="M60 50v35c0 11 27 20 60 20s60-9 60-20V50"
      fill="white"
      fillOpacity="0.1"
      stroke="white"
      strokeWidth="4"
    />
    <path
      d="M60 85v35c0 11 27 20 60 20s60-9 60-20V85"
      fill="white"
      fillOpacity="0.15"
      stroke="white"
      strokeWidth="4"
    />
    <path
      d="M120 140v25"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="6 6"
    />
    <circle cx="120" cy="165" r="4" fill="white" />
    <g transform="translate(0, 15)">
      <rect
        x="40"
        y="160"
        width="160"
        height="60"
        rx="6"
        fill="white"
        fillOpacity="0.15"
        stroke="white"
        strokeWidth="4"
      />
      <line
        x1="40"
        y1="180"
        x2="200"
        y2="180"
        stroke="white"
        strokeWidth="3"
        strokeOpacity="0.8"
      />
      <line
        x1="40"
        y1="200"
        x2="200"
        y2="200"
        stroke="white"
        strokeWidth="3"
        strokeOpacity="0.8"
      />
      <line
        x1="93"
        y1="160"
        x2="93"
        y2="220"
        stroke="white"
        strokeWidth="3"
        strokeOpacity="0.8"
      />
      <line
        x1="146"
        y1="160"
        x2="146"
        y2="220"
        stroke="white"
        strokeWidth="3"
        strokeOpacity="0.8"
      />
      {[66, 119, 173].map((cx) => (
        <React.Fragment key={cx}>
          <circle cx={cx} cy="170" r="3" fill="white" />
          <circle cx={cx} cy="190" r="3" fill="white" fillOpacity="0.5" />
          <circle cx={cx} cy="210" r="3" fill="white" fillOpacity="0.5" />
        </React.Fragment>
      ))}
    </g>
    <circle cx="180" cy="40" r="6" fill="white" fillOpacity="0.3" />
    <circle cx="195" cy="65" r="3" fill="white" fillOpacity="0.5" />
    <circle cx="45" cy="110" r="4" fill="white" fillOpacity="0.4" />
  </svg>
);

export function Auth() {
  const vm = useAuthViewModel();
  const isLogin = vm.mode === "login";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-sans bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]">
      <motion.div
        layout
        className={`bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-4xl w-full min-h-[500px] flex flex-col ${isLogin ? "md:flex-row" : "md:flex-row-reverse"}`}
      >
        {/* Graphic panel */}
        <motion.div
          layout
          className="w-full md:w-[45%] bg-[#54A796] p-8 flex flex-col items-center justify-center text-white relative z-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={vm.mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <DbTableIllustration />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {isLogin ? "¡Bienvenido de nuevo!" : "Únete a nosotros"}
              </h2>
              <p className="text-white/80 text-sm max-w-xs leading-relaxed">
                {isLogin
                  ? "Accede a tu cuenta para gestionar y visualizar tus bases de datos y tablas."
                  : "Regístrate para comenzar a organizar tu información de la manera más eficiente."}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Form panel */}
        <motion.div
          layout
          className="w-full md:w-[55%] p-6 md:p-10 flex flex-col justify-center bg-white relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={vm.mode}
              initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm mx-auto"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </h3>

              <form className="space-y-4" onSubmit={vm.handleSubmit}>
                {/* Username field (register only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Nombre de usuario
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required={!isLogin}
                        value={vm.form.username}
                        onChange={(e) =>
                          vm.updateField("username", e.target.value)
                        }
                        className="block text-sm w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#54A796]/20 focus:border-[#54A796] transition-all outline-none"
                        placeholder="usuario123"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={vm.form.email}
                      onChange={(e) => vm.updateField("email", e.target.value)}
                      className="block text-sm w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#54A796]/20 focus:border-[#54A796] transition-all outline-none"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={vm.showPassword ? "text" : "password"}
                      required
                      value={vm.form.password}
                      onChange={(e) =>
                        vm.updateField("password", e.target.value)
                      }
                      className="block text-sm w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#54A796]/20 focus:border-[#54A796] transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => vm.setShowPassword(!vm.showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#54A796] transition-colors focus:outline-none"
                    >
                      {vm.showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role field (register only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Tipo de usuario
                    </label>
                    <select
                      value={vm.form.role}
                      onChange={(e) => vm.updateField("role", e.target.value)}
                      className="block text-sm w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#54A796]/20 focus:border-[#54A796] transition-all outline-none cursor-pointer"
                    >
                      <option value="usuario de lectura">Lectura</option>
                      <option value="usuario de escritura">Escritura</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </motion.div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-end pt-1">
                    <a
                      href="#"
                      className="text-xs font-semibold text-[#54A796] hover:text-[#418c7c] transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={vm.loading}
                  className="w-full text-sm bg-[#54A796] hover:bg-[#468e7f] disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group mt-2 shadow-lg shadow-[#54A796]/30 hover:shadow-[#54A796]/40 active:scale-[0.98]"
                >
                  {vm.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Ingresar" : "Registrarse"}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-center text-sm text-gray-600">
                  {isLogin
                    ? "¿No tienes una cuenta?"
                    : "¿Ya tienes una cuenta?"}
                  <button
                    onClick={vm.toggleMode}
                    className="ml-2 font-bold text-[#54A796] hover:text-[#418c7c] transition-colors focus:outline-none"
                  >
                    {isLogin ? "Regístrate" : "Inicia Sesión"}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
