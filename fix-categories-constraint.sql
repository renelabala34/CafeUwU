-- ============================================
-- Script completo para categorías dinámicas
-- Ejecutar en: https://app.supabase.com -> SQL Editor
-- ============================================

-- 1. Eliminar la restricción CHECK en menu_items.type
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_type_check;

-- 2. Cambiar el tipo de columna a VARCHAR(50) para aceptar cualquier categoría
ALTER TABLE menu_items ALTER COLUMN type TYPE VARCHAR(50);

-- 3. Crear tabla de categorías (si no existe)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  type VARCHAR(50) NOT NULL UNIQUE,
  emoji VARCHAR(10) DEFAULT '📁',
  color VARCHAR(20) DEFAULT 'warm',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insertar categorías por defecto (si no existen)
INSERT INTO categories (name, description, type, emoji, color) VALUES
  ('Ofertas sin freír', 'Productos crudos/preparados para freír en casa', 'sin_freir', '🍗', 'warm'),
  ('Especial I''MAS — Preparados', 'Listos para comer', 'preparado', '🌮', 'olive')
ON CONFLICT (type) DO NOTHING;

-- 5. Función y trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- 6. Habilitar RLS y políticas de seguridad
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categorías visibles públicamente" ON categories;
CREATE POLICY "Categorías visibles públicamente"
  ON categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir inserción de categorías" ON categories;
CREATE POLICY "Permitir inserción de categorías"
  ON categories FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualización de categorías" ON categories;
CREATE POLICY "Permitir actualización de categorías"
  ON categories FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Permitir eliminación de categorías" ON categories;
CREATE POLICY "Permitir eliminación de categorías"
  ON categories FOR DELETE
  USING (true);

-- ============================================
-- ¡Listo! Ahora puedes crear categorías libremente
-- ============================================
