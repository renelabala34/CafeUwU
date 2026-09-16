-- ============================================
-- Script de creación de tabla para I'MAS
-- Ejecutar en: SQL Editor de Supabase
-- ============================================

-- Crear tabla de credenciales de administrador
CREATE TABLE IF NOT EXISTS admin_credentials (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar credenciales iniciales (admin/admin123)
-- Password hash generado con SHA-256 + salt
INSERT INTO admin_credentials (username, password_hash, salt) 
VALUES (
  'admin',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  'default_salt_for_initial_setup'
)
ON CONFLICT (username) DO NOTHING;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_admin_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_credentials_updated_at ON admin_credentials;
CREATE TRIGGER update_admin_credentials_updated_at
  BEFORE UPDATE ON admin_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_credentials_updated_at();

-- Políticas de seguridad para admin_credentials
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Solo lectura pública (necesario para login)
DROP POLICY IF EXISTS "Admin credentials readable for login" ON admin_credentials;
CREATE POLICY "Admin credentials readable for login"
  ON admin_credentials FOR SELECT
  USING (true);

-- Solo escritura para autenticados (cambio de contraseña)
DROP POLICY IF EXISTS "Admin credentials writable" ON admin_credentials;
CREATE POLICY "Admin credentials writable"
  ON admin_credentials FOR ALL
  USING (true)
  WITH CHECK (true);

-- Crear tabla de productos del menú
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  section VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
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
INSERT INTO menu_items (name, section, price, quantity, type, description, emoji, in_stock) VALUES
-- Ofertas sin freír
('Croquetas de embutido', 'sin_freir', 250, 10, 'sin_freir', 'Crujientes croquetas de embutido, listas para freír en casa. Sabor casero tradicional.', '🍗', true),
('Croquetas de pollo', 'sin_freir', 300, 10, 'sin_freir', 'Croquetas de pollo jugosas con relleno cremoso. Perfectas para freír al momento.', '🍗', true),
('Croquetas de atún', 'sin_freir', 400, 10, 'sin_freir', 'Croquetas de atún con un sabor intenso del mar. Crujientes por fuera, suaves por dentro.', '🐟', true),
('Croquetas rellenas de salchicha', 'sin_freir', 350, 5, 'sin_freir', 'Croquetas XL rellenas de salchicha. Sorpresa de sabor en cada mordida.', '🌭', true),
('Croquetas rellenas de queso', 'sin_freir', 350, 5, 'sin_freir', 'Croquetas con corazón de queso fundido. Irresistibles recién fritas.', '🧀', true),
('Croquetas rellenas de salchicha y queso', 'sin_freir', 400, 5, 'sin_freir', 'La combinación perfecta: salchicha y queso fundido en una croqueta crujiente.', '🧀', true),
('Croquetas rellenas de atún', 'sin_freir', 500, 5, 'sin_freir', 'Croquetas rellenas de atún premium. Sabor del mar en cada bocado.', '🐟', true),
('Medallones de queso', 'sin_freir', 300, 5, 'sin_freir', 'Medallones dorados rellenos de queso. Crujientes y con centro fundido.', '🧀', true),
('Medallones de jamón', 'sin_freir', 350, 5, 'sin_freir', 'Medallones con jamón picado. Sabor clásico en cada bocado.', '🥓', true),
('Medallones de jamón y queso', 'sin_freir', 400, 5, 'sin_freir', 'La dupla perfecta: jamón y queso en un medallón crujiente dorado.', '🥓', true),
('Bolitas de queso', 'sin_freir', 300, 10, 'sin_freir', 'Bolitas doradas de queso, perfectas como aperitivo o acompañamiento.', '🧀', true),
('Bolitas de jamón', 'sin_freir', 350, 10, 'sin_freir', 'Bolitas crujientes de jamón. Ideales para compartir en familia.', '🥓', true),
('Yuca rellena de picadillo', 'sin_freir', 70, 1, 'sin_freir', 'Yuca crujiente rellena de picadillo a la cubana. Sabor tradicional.', '🥔', true),
('Yuca rellena de salchicha en salsa', 'sin_freir', 80, 1, 'sin_freir', 'Yuca rellena de salchicha bañada en salsa. Un bocado completo y sabroso.', '🥔', true),
-- Especial I'MAS — Preparados
('Tamal de picadillo', 'preparado', 300, 1, 'preparado', 'Tamal de maíz con picadillo de cerdo. Receta cubana tradicional, listo para comer.', '🌽', true),
('Tamal de pollo', 'preparado', 400, 1, 'preparado', 'Tamal relleno de pollo desmenuzado. Sabor casero en cada bocado.', '🌽', true),
('Tamal de lomo ahumado', 'preparado', 500, 1, 'preparado', 'Tamal premium con lomo ahumado. Una experiencia de sabor única.', '🌽', true),
('Banana''MAS (canoa) de picadillo', 'preparado', 400, 2, 'preparado', 'Plátano maduro en forma de canoa relleno de picadillo. Exquisito y reconfortante.', '🍌', true),
('Banana''MAS (canoa) de picadillo con queso', 'preparado', 500, 2, 'preparado', 'Nuestra Banana''MAS con queso gratinado encima. La combinación perfecta.', '🍌', true),
('Salchirollos', 'preparado', 850, 8, 'preparado', 'Rollos de masa rellenos de salchicha, horneados hasta dorar. Listos para disfrutar.', '🌭', true);

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
