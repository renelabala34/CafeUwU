-- ============================================
-- SCRIPT DE CORRECCIÓN - Ejecutar UNA VEZ
-- ============================================
-- Este script corrige los problemas:
-- 1. Elimina productos duplicados
-- 2. Corrige las credenciales del admin
-- ============================================

-- PASO 1: Eliminar duplicados de menu_items
-- Mantiene solo el primer registro de cada producto (por nombre)
DELETE FROM menu_items
WHERE id NOT IN (
  SELECT MIN(id)
  FROM menu_items
  GROUP BY name
);

-- PASO 2: Corregir las credenciales del admin
-- Eliminar credenciales existentes
DELETE FROM admin_credentials WHERE username = 'admin';

-- Insertar credenciales correctas
-- Hash SHA-256 de "admin123" con salt "default_salt_for_initial_setup"
INSERT INTO admin_credentials (username, password_hash, salt)
VALUES (
  'admin',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  'default_salt_for_initial_setup'
);

-- ============================================
-- ¡Listo! Ahora puedes entrar con admin/admin123
-- ============================================
