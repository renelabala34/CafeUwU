# Configuración de Base de Datos con Supabase

## 📋 Requisitos

- Cuenta gratuita en [Supabase](https://supabase.com)
- Node.js y npm instalados

## 🚀 Configuración paso a paso

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Haz clic en "New Project"
3. Completa los datos del proyecto:
   - **Name**: Nombre de tu proyecto (ej: "origen-coffee")
   - **Database Password**: Contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana a tus usuarios
4. Espera a que se cree el proyecto (1-2 minutos)

### 2. Obtener credenciales

1. En el panel de Supabase, ve a **Settings** (ícono de engranaje)
2. Haz clic en **API**
3. Copia:
   - **Project URL** (ej: `https://abcdefghijk.supabase.co`)
   - **anon public key** (clave pública)

### 3. Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y reemplaza con tus credenciales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Crear la tabla de productos

1. En el panel de Supabase, ve a **SQL Editor** (ícono de código)
2. Haz clic en "New Query"
3. Copia y pega el siguiente SQL:

```sql
-- Crear tabla de productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  roast VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  weight VARCHAR(50) NOT NULL,
  description TEXT,
  flavor_notes TEXT[],
  altitude VARCHAR(100),
  process VARCHAR(100),
  image TEXT,
  rating DECIMAL(2, 1) DEFAULT 4.5,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar productos de ejemplo
INSERT INTO products (name, origin, category, roast, price, weight, description, flavor_notes, altitude, process, image, rating) VALUES
('Etiopía Yirgacheffe', 'Etiopía', 'Origen Único', 'Ligero', 18.50, '250g', 'Un café excepcional de la región de Yirgacheffe con notas florales y cítricas que deleitan el paladar.', ARRAY['Jazmín', 'Bergamota', 'Limón', 'Miel'], '1,900 - 2,200 m', 'Lavado', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', 4.9),
('Colombia Huila', 'Colombia', 'Origen Único', 'Medio', 16.00, '250g', 'De las montañas del Huila colombiano llega este café equilibrado y dulce.', ARRAY['Caramelo', 'Naranja', 'Chocolate con leche', 'Nuez'], '1,600 - 1,900 m', 'Lavado', 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop', 4.7),
('Blend Aurora', 'Brasil & Guatemala', 'Blend', 'Medio-Oscuro', 14.00, '250g', 'Nuestra mezcla insignia combina la dulzura brasileña con la complejidad guatemalteca.', ARRAY['Chocolate negro', 'Avellana', 'Panela', 'Ciruela'], '1,200 - 1,800 m', 'Natural / Lavado', 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop', 4.6),
('Kenya AA Nyeri', 'Kenia', 'Origen Único', 'Medio', 21.00, '250g', 'Un café vibrante y complejo de las tierras altas de Nyeri.', ARRAY['Grosella negra', 'Tomate', 'Pomelo', 'Caña de azúcar'], '1,700 - 2,000 m', 'Lavado', 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=400&fit=crop', 4.8),
('Descafeinado Swiss Water', 'México', 'Descafeinado', 'Medio', 15.50, '250g', 'Descafeinado con el método Swiss Water que preserva todos los sabores sin químicos.', ARRAY['Cacao', 'Almendra', 'Vainilla', 'Galleta'], '1,100 - 1,400 m', 'Swiss Water®', 'https://images.unsplash.com/photo-1514432324607-a6351b050096?w=400&h=400&fit=crop', 4.5),
('Geisha Panamá Esmeralda', 'Panamá', 'Edición Especial', 'Ligero', 45.00, '100g', 'La joya de la corona del café mundial. Producción extremadamente limitada.', ARRAY['Rosa', 'Durazno', 'Té de jazmín', 'Papaya'], '1,600 - 1,800 m', 'Lavado', 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop', 5.0);

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_origin ON products(origin);
```

4. Haz clic en **Run** (o presiona Ctrl+Enter)

### 5. Configurar políticas de seguridad (RLS)

Para permitir lectura pública y escritura solo desde el admin:

```sql
-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (cualquiera puede ver productos)
CREATE POLICY "Productos visibles públicamente"
ON products FOR SELECT
USING (true);

-- Política para inserción (requiere autenticación)
CREATE POLICY "Solo autenticados pueden insertar"
ON products FOR INSERT
WITH CHECK (true);

-- Política para actualización (requiere autenticación)
CREATE POLICY "Solo autenticados pueden actualizar"
ON products FOR UPDATE
USING (true);

-- Política para eliminación (requiere autenticación)
CREATE POLICY "Solo autenticados pueden eliminar"
ON products FOR DELETE
USING (true);
```

### 6. Probar la conexión

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la aplicación en tu navegador
3. Los productos deberían cargarse desde Supabase
4. Ve al panel de administración y prueba crear/editar/eliminar productos
5. Verifica en Supabase > Table Editor que los cambios se reflejan

## 🔒 Seguridad (Recomendado para producción)

Para mayor seguridad, configura autenticación real:

1. En Supabase, ve a **Authentication**
2. Configura los proveedores que necesites (Email, Google, etc.)
3. Actualiza las políticas RLS para requerir autenticación:

```sql
-- Ejemplo: Solo usuarios autenticados pueden escribir
CREATE POLICY "Solo autenticados pueden insertar"
ON products FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

## 📊 Límites del plan gratuito

- **500 MB** de base de datos
- **2 GB** de transferencia mensual
- **50,000** usuarios activos mensuales
- **500 MB** de storage de archivos

Para la mayoría de tiendas pequeñas, esto es más que suficiente.

## 🐛 Solución de problemas

### "Supabase no disponible"
- Verifica que las variables `.env` estén correctas
- Reinicia el servidor de desarrollo después de cambiar `.env`

### "Error al agregar producto"
- Verifica que la tabla `products` exista
- Revisa las políticas RLS en Supabase

### Los productos no se actualizan
- Limpia el caché del navegador
- Verifica la consola del navegador para errores

## 📚 Recursos adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de JavaScript/TypeScript](https://supabase.com/docs/guides/with-javascript)
- [Referencia de la API](https://supabase.com/docs/reference/javascript)
