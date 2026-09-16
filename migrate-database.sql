-- ============================================
-- Script de migración para I'MAS
-- Ejecutar en: SQL Editor de Supabase
-- ============================================

-- PASO 1: Eliminar columnas antiguas
ALTER TABLE menu_items DROP COLUMN IF EXISTS category;
ALTER TABLE menu_items DROP COLUMN IF EXISTS unit;

-- PASO 2: Agregar nueva columna quantity
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

-- PASO 3: Actualizar datos existentes (convertir unit a quantity)
UPDATE menu_items SET quantity = 10 WHERE name LIKE '%Croquetas de embutido%';
UPDATE menu_items SET quantity = 10 WHERE name LIKE '%Croquetas de pollo%';
UPDATE menu_items SET quantity = 10 WHERE name LIKE '%Croquetas de atún%';
UPDATE menu_items SET quantity = 5 WHERE name LIKE '%Croquetas rellenas%';
UPDATE menu_items SET quantity = 5 WHERE name LIKE '%Medallones%';
UPDATE menu_items SET quantity = 10 WHERE name LIKE '%Bolitas%';
UPDATE menu_items SET quantity = 1 WHERE name LIKE '%Yuca%';
UPDATE menu_items SET quantity = 1 WHERE name LIKE '%Tamal%';
UPDATE menu_items SET quantity = 2 WHERE name LIKE '%Banana%';
UPDATE menu_items SET quantity = 8 WHERE name LIKE '%Salchirollos%';

-- ============================================
-- ¡Listo! La base de datos está actualizada
-- ============================================
