-- ============================================
-- SCRIPT DE CORRECCIÓN DEFINITIVO
-- ============================================
-- Este script recalcula el hash usando la misma lógica que JavaScript
-- ============================================

-- PASO 1: Habilitar la extensión pgcrypto (necesaria para digest)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- PASO 2: Eliminar duplicados de menu_items
DELETE FROM menu_items
WHERE id NOT IN (
  SELECT MIN(id)
  FROM menu_items
  GROUP BY name
);

-- PASO 3: Corregir las credenciales del admin
-- Eliminar credenciales existentes
DELETE FROM admin_credentials WHERE username = 'admin';

-- Calcular el hash correcto usando PostgreSQL
-- La función hashPassword en JavaScript hace: SHA256(password + salt)
-- En PostgreSQL usamos: digest(password || salt, 'sha256')
INSERT INTO admin_credentials (username, password_hash, salt)
VALUES (
  'admin',
  encode(digest('admin123' || 'default_salt_for_initial_setup', 'sha256'), 'hex'),
  'default_salt_for_initial_setup'
);

-- ============================================
-- Verificación: Este SELECT debe mostrar el hash correcto
-- ============================================
SELECT 
  username,
  password_hash,
  salt,
  encode(digest('admin123' || salt, 'sha256'), 'hex') as calculated_hash,
  CASE 
    WHEN password_hash = encode(digest('admin123' || salt, 'sha256'), 'hex') 
    THEN '✓ CORRECTO'
    ELSE '✗ INCORRECTO'
  END as status
FROM admin_credentials 
WHERE username = 'admin';

-- ============================================
-- ¡Ahora deberías poder entrar con admin/admin123!
-- ============================================
