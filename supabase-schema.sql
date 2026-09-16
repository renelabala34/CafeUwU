-- ============================================
-- Script de creación de tabla para I'MAS
-- Ejecutar en: SQL Editor de Supabase
-- ============================================

-- Crear tabla de productos del menú
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  section VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  unit VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('sin_freir', 'preparado')),
  description TEXT,
  emoji VARCHAR(10) DEFAULT '🍽️',
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_menu_items_type ON menu_items(type);
CREATE INDEX IF NOT EXISTS idx_menu_items_section ON menu_items(section);
CREATE INDEX IF NOT EXISTS idx_menu_items_in_stock ON menu_items(in_stock);

-- Insertar datos iniciales
INSERT INTO menu_items (name, section, category, price, unit, type, description, emoji, in_stock) VALUES
-- Ofertas sin freír
('Croquetas de embutido', 'sin_freir', 'Croquetas (10 unid)', 250, '10 unidades', 'sin_freir', 'Crujientes croquetas de embutido, listas para freír en casa. Sabor casero tradicional.', '🍗', true),
('Croquetas de pollo', 'sin_freir', 'Croquetas (10 unid)', 300, '10 unidades', 'sin_freir', 'Croquetas de pollo jugosas con relleno cremoso. Perfectas para freír al momento.', '🍗', true),
('Croquetas de atún', 'sin_freir', 'Croquetas (10 unid)', 400, '10 unidades', 'sin_freir', 'Croquetas de atún con un sabor intenso del mar. Crujientes por fuera, suaves por dentro.', '🐟', true),
('Croquetas rellenas de salchicha', 'sin_freir', 'Croquetas rellenas (5 unid)', 350, '5 unidades', 'sin_freir', 'Croquetas XL rellenas de salchicha. Sorpresa de sabor en cada mordida.', '🌭', true),
('Croquetas rellenas de queso', 'sin_freir', 'Croquetas rellenas (5 unid)', 350, '5 unidades', 'sin_freir', 'Croquetas con corazón de queso fundido. Irresistibles recién fritas.', '🧀', true),
('Croquetas rellenas de salchicha y queso', 'sin_freir', 'Croquetas rellenas (5 unid)', 400, '5 unidades', 'sin_freir', 'La combinación perfecta: salchicha y queso fundido en una croqueta crujiente.', '🧀', true),
('Croquetas rellenas de atún', 'sin_freir', 'Croquetas rellenas (5 unid)', 500, '5 unidades', 'sin_freir', 'Croquetas rellenas de atún premium. Sabor del mar en cada bocado.', '🐟', true),
('Medallones de queso', 'sin_freir', 'Medallones (5 unid)', 300, '5 unidades', 'sin_freir', 'Medallones dorados rellenos de queso. Crujientes y con centro fundido.', '🧀', true),
('Medallones de jamón', 'sin_freir', 'Medallones (5 unid)', 350, '5 unidades', 'sin_freir', 'Medallones con jamón picado. Sabor clásico en cada bocado.', '🥓', true),
('Medallones de jamón y queso', 'sin_freir', 'Medallones (5 unid)', 400, '5 unidades', 'sin_freir', 'La dupla perfecta: jamón y queso en un medallón crujiente dorado.', '🥓', true),
('Bolitas de queso', 'sin_freir', 'Bolitas (10 unid)', 300, '10 unidades', 'sin_freir', 'Bolitas doradas de queso, perfectas como aperitivo o acompañamiento.', '🧀', true),
('Bolitas de jamón', 'sin_freir', 'Bolitas (10 unid)', 350, '10 unidades', 'sin_freir', 'Bolitas crujientes de jamón. Ideales para compartir en familia.', '🥓', true),
('Yuca rellena de picadillo', 'sin_freir', 'Yuca rellena (1 unid)', 70, '1 unidad', 'sin_freir', 'Yuca crujiente rellena de picadillo a la cubana. Sabor tradicional.', '🥔', true),
('Yuca rellena de salchicha en salsa', 'sin_freir', 'Yuca rellena (1 unid)', 80, '1 unidad', 'sin_freir', 'Yuca rellena de salchicha bañada en salsa. Un bocado completo y sabroso.', '🥔', true),
-- Especial I'MAS — Preparados
('Tamal de picadillo', 'preparado', 'Tamales (1 unid)', 300, '1 unidad', 'preparado', 'Tamal de maíz con picadillo de cerdo. Receta cubana tradicional, listo para comer.', '🌽', true),
('Tamal de pollo', 'preparado', 'Tamales (1 unid)', 400, '1 unidad', 'preparado', 'Tamal relleno de pollo desmenuzado. Sabor casero en cada bocado.', '🌽', true),
('Tamal de lomo ahumado', 'preparado', 'Tamales (1 unid)', 500, '1 unidad', 'preparado', 'Tamal premium con lomo ahumado. Una experiencia de sabor única.', '🌽', true),
('Banana''MAS (canoa) de picadillo', 'preparado', 'Bananas (2 unid)', 400, '2 unidades', 'preparado', 'Plátano maduro en forma de canoa relleno de picadillo. Exquisito y reconfortante.', '🍌', true),
('Banana''MAS (canoa) de picadillo con queso', 'preparado', 'Bananas (2 unid)', 500, '2 unidades', 'preparado', 'Nuestra Banana''MAS con queso gratinado encima. La combinación perfecta.', '🍌', true),
('Salchirollos', 'preparado', 'Salchirollos (8 unid)', 850, '8 unidades', 'preparado', 'Rollos de masa rellenos de salchicha, horneados hasta dorar. Listos para disfrutar.', '🌭', true);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad (RLS)
-- Habilitar RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (cualquiera puede ver productos)
DROP POLICY IF EXISTS "Productos visibles públicamente" ON menu_items;
CREATE POLICY "Productos visibles públicamente"
  ON menu_items FOR SELECT
  USING (true);

-- Políticas para escritura (requieren autenticación)
-- Nota: Si quieres que cualquiera pueda escribir (modo desarrollo), usa estas:
DROP POLICY IF EXISTS "Permitir inserción" ON menu_items;
CREATE POLICY "Permitir inserción"
  ON menu_items FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualización" ON menu_items;
CREATE POLICY "Permitir actualización"
  ON menu_items FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Permitir eliminación" ON menu_items;
CREATE POLICY "Permitir eliminación"
  ON menu_items FOR DELETE
  USING (true);

-- ============================================
-- ¡Listo! La tabla está creada y poblada
-- ============================================
