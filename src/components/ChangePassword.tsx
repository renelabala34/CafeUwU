import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { hashPassword, generateSalt, verifyPassword, validatePassword } from "../lib/security";

interface ChangePasswordProps {
  onClose: () => void;
}

export default function ChangePassword({ onClose }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordValidation = validatePassword(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("La nueva contraseña no cumple con los requisitos de seguridad");
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        throw new Error("Supabase no está configurado");
      }

      // Obtener credenciales actuales
      const { data: credentials, error: fetchError } = await supabase
        .from("admin_credentials")
        .select("*")
        .eq("username", "admin")
        .single();

      if (fetchError || !credentials) {
        throw new Error("No se pudieron obtener las credenciales");
      }

      // Verificar contraseña actual
      const isValid = await verifyPassword(
        currentPassword,
        credentials.password_hash,
        credentials.salt
      );

      if (!isValid) {
        setError("La contraseña actual es incorrecta");
        setLoading(false);
        return;
      }

      // Generar nuevo salt y hash
      const newSalt = generateSalt();
      const newPasswordHash = await hashPassword(newPassword, newSalt);

      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from("admin_credentials")
        .update({
          password_hash: newPasswordHash,
          salt: newSalt,
        })
        .eq("username", "admin");

      if (updateError) {
        throw new Error("Error al actualizar la contraseña");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-tomato-100 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-tomato-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-tomato-900">Cambiar Contraseña</h2>
            <p className="text-sm text-tomato-600">Actualiza tu contraseña de administrador</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-medium text-tomato-800 mb-1.5">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tomato-400 hover:text-tomato-600 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-tomato-800 mb-1.5">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                placeholder="Ingresa la nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tomato-400 hover:text-tomato-600 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Validaciones de contraseña */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  {newPassword.length >= 8 ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-tomato-400" />
                  )}
                  <span className={newPassword.length >= 8 ? "text-green-600" : "text-tomato-600"}>
                    Mínimo 8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/[A-Z]/.test(newPassword) ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-tomato-400" />
                  )}
                  <span className={/[A-Z]/.test(newPassword) ? "text-green-600" : "text-tomato-600"}>
                    Al menos una letra mayúscula
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/[a-z]/.test(newPassword) ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-tomato-400" />
                  )}
                  <span className={/[a-z]/.test(newPassword) ? "text-green-600" : "text-tomato-600"}>
                    Al menos una letra minúscula
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/[0-9]/.test(newPassword) ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-tomato-400" />
                  )}
                  <span className={/[0-9]/.test(newPassword) ? "text-green-600" : "text-tomato-600"}>
                    Al menos un número
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-tomato-400" />
                  )}
                  <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : "text-tomato-600"}>
                    Al menos un carácter especial
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirmar nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-tomato-800 mb-1.5">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                placeholder="Confirma la nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tomato-400 hover:text-tomato-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden</p>
            )}
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              ¡Contraseña actualizada exitosamente!
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-tomato-200 text-tomato-700 font-medium rounded-xl hover:bg-tomato-50 transition-all"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid || newPassword !== confirmPassword}
              className="flex-1 px-4 py-2.5 bg-tomato-600 hover:bg-tomato-700 disabled:bg-tomato-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Cambiar Contraseña"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
