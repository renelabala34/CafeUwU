-- ============================================
-- Migración para añadir restricción de unicidad
-- Evita productos duplicados en la base de datos
-- Ejecutar en: SQL Editor de Supabase
-- ============================================

-- Añadir restricción UNIQUE para evitar duplicados
-- Un producto se considera duplicado si tiene el mismo nombre, sección y tipo
ALTER TABLE menu_items
ADD CONSTRAINT unique_menu_item_name_section_type UNIQUE (name, section, type);

-- Eliminar duplicados existentes (manteniendo el de menor ID)
DELETE FROM menu_items a
USING menu_items b
WHERE a.id > b.id
  AND a.name = b.name
  AND a.section = b.section
  AND a.type = b.type;

-- ============================================
-- ¡Listo! La restricción está creada
-- ============================================
