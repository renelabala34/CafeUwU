// Funciones de seguridad para manejo de contraseñas

/**
 * Hashea una contraseña usando SHA-256 con salt
 * @param password - Contraseña en texto plano
 * @param salt - Salt único para cada usuario
 * @returns Promise con el hash en formato hexadecimal
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Genera un salt aleatorio
 * @returns Salt en formato hexadecimal
 */
export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verifica si una contraseña coincide con el hash almacenado
 * @param password - Contraseña en texto plano a verificar
 * @param storedHash - Hash almacenado en la base de datos
 * @param salt - Salt usado para generar el hash
 * @returns Promise<boolean> - true si coincide, false si no
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return hash === storedHash;
}

/**
 * Valida la fortaleza de una contraseña
 * @param password - Contraseña a validar
 * @returns Objeto con validaciones
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Al menos una letra mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Al menos una letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Al menos un número');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Al menos un carácter especial');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
