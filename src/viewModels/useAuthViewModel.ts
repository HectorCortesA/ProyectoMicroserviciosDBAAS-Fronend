import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authService, tokenService } from "../services/api";
import type { UserRole } from "../models/types";

export type AuthMode = "login" | "register";

export function useAuthViewModel() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "usuario de lectura" as UserRole,
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setForm({
      username: "",
      email: "",
      password: "",
      role: "usuario de lectura",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (mode === "login") {
      result = await authService.login({
        email: form.email,
        password: form.password,
      });
    } else {
      result = await authService.register({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
    }

    setLoading(false);

    if (!result.success) {
      const status = result.error.status;
      if (status === 401) toast.error("Credenciales incorrectas.");
      else if (status === 403) toast.error("Acceso denegado.");
      else
        toast.error(
          result.error.detail ?? "Error de conexión con el servidor.",
        );
      return;
    }

    tokenService.set(result.data.access_token);
    toast.success(mode === "login" ? "¡Bienvenido!" : "¡Cuenta creada!");
    navigate("/dashboard");
  };

  return {
    mode,
    loading,
    showPassword,
    form,
    updateField,
    toggleMode,
    handleSubmit,
    setShowPassword,
  };
}
