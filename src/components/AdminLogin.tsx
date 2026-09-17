import { useState } from "react";
import { Lock, ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import { verifyPassword } from "../lib/security";

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!supabase) {
        // Fallback: credenciales por defecto si Supabase no está configurado
        if (username === "admin" && password === "admin123") {
          sessionStorage.setItem("admin_auth", "true");
          onLogin();
        } else {
          setError("Usuario o contraseña incorrectos");
        }
        setLoading(false);
        return;
      }

      // Obtener credenciales de la base de datos
      const { data: credentials, error: fetchError } = await supabase
        .from("admin_credentials")
        .select("*")
        .eq("username", username)
        .single();

      if (fetchError || !credentials) {
        setError("Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // Verificar contraseña
      const isValid = await verifyPassword(
        password,
        credentials.password_hash,
        credentials.salt
      );

      if (isValid) {
        sessionStorage.setItem("admin_auth", "true");
        onLogin();
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tomato-800 via-tomato-700 to-warm-700 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-cream-300 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-warm-300 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-200/70 hover:text-cream-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver al menú</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="w-16 h-16 bg-tomato-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-tomato-700" />
          </div>

          <h1 className="text-2xl font-black text-tomato-900 text-center mb-2">
            Panel de Administración
          </h1>
          <p className="text-sm text-tomato-600 text-center mb-8">
            Inicia sesión para gestionar el menú
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-tomato-800 mb-1.5">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-4 py-3 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-tomato-800 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tomato-400 hover:text-tomato-600 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-tomato-600 hover:bg-tomato-700 disabled:bg-tomato-300 text-white font-bold rounded-full transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
