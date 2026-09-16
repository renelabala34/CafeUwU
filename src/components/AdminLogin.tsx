import { useState } from "react";
import { Lock, ArrowLeft, Shield } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem("admin_auth", "true");
        onLogin();
      } else {
        setError("Usuario o contraseña incorrectos");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-950 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-warm-400 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-cream-400 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-200/70 hover:text-cream-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver a la tienda</span>
        </button>

        {/* Login card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Icon */}
          <div className="w-16 h-16 bg-coffee-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-coffee-700" />
          </div>

          <h1 className="text-2xl font-bold text-coffee-900 text-center mb-2">
            Panel de Administración
          </h1>
          <p className="text-sm text-coffee-500 text-center mb-8">
            Inicia sesión para gestionar tus productos
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-coffee-800 hover:bg-coffee-900 disabled:bg-coffee-400 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
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

          <div className="mt-6 p-3 bg-cream-50 rounded-xl border border-cream-200">
            <p className="text-xs text-coffee-500 text-center">
              <span className="font-semibold">Demo:</span> usuario{" "}
              <code className="px-1.5 py-0.5 bg-white rounded text-coffee-700">admin</code>{" "}
              / contraseña{" "}
              <code className="px-1.5 py-0.5 bg-white rounded text-coffee-700">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
