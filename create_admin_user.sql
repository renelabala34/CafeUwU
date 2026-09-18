-- Script para crear un nuevo usuario administrador "dueno" en Supabase
-- Este script genera el hash y salt correctamente usando SHA-256

-- Insertar el usuario "dueno" con contraseña "dueno123"
-- El password_hash es el resultado de SHA256(salt + password)
-- El salt es un valor aleatorio hexadecimal de 32 caracteres

INSERT INTO admin_credentials (username, password_hash, salt)
VALUES (
  'dueno', 
  '0c4017210ffe9afc827c7ded6d68343a346ace8416fcfbcecbeb9d437f442947', 
  '5fbfc33e8135598a1838aeb07ac7be57'
);

-- Credenciales del nuevo usuario:
-- Usuario: dueno
-- Contraseña: dueno123

-- Nota: Asegúrate de ejecutar este script en el SQL Editor de Supabase
-- después de conectar tu proyecto.
