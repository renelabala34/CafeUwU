-- ============================================
-- Script completo para configurar imágenes en I'MAS
-- Ejecutar en: SQL Editor de Supabase
-- ============================================

-- 1. Agregar columna image_url a la tabla menu_items (si no existe)
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Comentario para documentar la columna
COMMENT ON COLUMN menu_items.image_url IS 'URL pública de la imagen del producto almacenada en Supabase Storage';

-- 2. Crear índice para búsquedas por imagen
CREATE INDEX IF NOT EXISTS idx_menu_items_image_url ON menu_items(image_url);

-- ============================================
-- CONFIGURACIÓN DEL BUCKET DE STORAGE
-- ============================================

-- 3. Crear el bucket 'productos' si no existe
-- Este script crea el bucket directamente desde SQL
DO $$
BEGIN
  -- Verificar si el bucket ya existe
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'productos') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('productos', 'productos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  ELSE
    -- Actualizar configuración si ya existe
    UPDATE storage.buckets SET
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    WHERE id = 'productos';
  END IF;
END $$;

-- ============================================
-- POLÍTICAS DE SEGURIDAD PARA EL BUCKET
-- ============================================

-- 4. Habilitar RLS en el bucket productos
-- Las políticas se aplican a la tabla storage.objects

-- Política para permitir lectura pública de todos los archivos
DROP POLICY IF EXISTS "Permitir lectura pública de imágenes" ON storage.objects;
CREATE POLICY "Permitir lectura pública de imágenes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'productos');

-- Política para permitir subida de archivos (sin autenticación requerida)
-- IMPORTANTE: Esto es para desarrollo. En producción deberías requerir autenticación.
DROP POLICY IF EXISTS "Permitir subida de imágenes" ON storage.objects;
CREATE POLICY "Permitir subida de imágenes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'productos');

-- Política para permitir actualización de archivos
DROP POLICY IF EXISTS "Permitir actualización de imágenes" ON storage.objects;
CREATE POLICY "Permitir actualización de imágenes"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'productos');

-- Política para permitir eliminación de archivos
DROP POLICY IF EXISTS "Permitir eliminación de imágenes" ON storage.objects;
CREATE POLICY "Permitir eliminación de imágenes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'productos');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Consultar configuración del bucket
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'productos';

-- Consultar políticas del bucket
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- ============================================
-- ¡LISTO! El sistema de imágenes está configurado
-- ============================================
