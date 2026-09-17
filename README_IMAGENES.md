# 📸 Configuración de Imágenes para I'MAS

Esta guía te ayudará a configurar correctamente la subida de imágenes en tu aplicación.

## 🔧 Pasos Requeridos

### 1. Configurar Variables de Entorno (.env)

Edita el archivo `.env` con tus credenciales reales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**¿Dónde obtener estas credenciales?**
1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** (engranaje) → **API**
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 2. Ejecutar Script SQL en Supabase

1. En tu dashboard de Supabase, ve a **SQL Editor**
2. Crea una nueva consulta
3. Copia y pega TODO el contenido del archivo `setup-images.sql`
4. Haz clic en **Run** (o Ctrl+Enter)

Este script hará lo siguiente:
- ✅ Agrega la columna `image_url` a la tabla `menu_items`
- ✅ Crea el bucket `productos` en Storage
- ✅ Configura el bucket como público
- ✅ Crea políticas para leer, subir, actualizar y eliminar imágenes

### 3. Verificar que todo esté correcto

Después de ejecutar el script, verifica en Supabase:

#### En Database:
- Ve a **Table Editor** → `menu_items`
- Confirma que existe la columna `image_url`

#### En Storage:
- Ve a **Storage**
- Deberías ver un bucket llamado `productos`
- El bucket debe ser **público** (icono de mundo 🌍)

#### En Authentication (opcional):
- Las políticas actuales permiten uploads sin autenticación
- Para mayor seguridad en producción, puedes requerir auth

### 4. Reiniciar la Aplicación

```bash
npm run dev
```

## 🎯 Cómo Usar

Una vez configurado:

1. Inicia sesión como administrador
2. Haz clic en "Nuevo producto" o edita uno existente
3. En el campo "Imagen del producto":
   - Haz clic en "Subir imagen"
   - Selecciona un archivo (JPG, PNG, WebP, GIF - máx 5MB)
   - Espera a que se complete la subida
   - La imagen aparecerá en vista previa
4. Guarda el producto

La imagen se almacenará en el bucket `productos` y su URL pública se guardará en la base de datos.

## ❌ Solución de Problemas

### Error: "Bucket not found"
- Ejecuta el script SQL `setup-images.sql` en Supabase
- Verifica que el bucket `productos` exista en Storage

### Error: "Permission denied"
- Revisa que las políticas RLS estén creadas correctamente
- El bucket debe ser público o tener políticas adecuadas

### Error: "Invalid credentials"
- Verifica que `.env` tenga las credenciales correctas
- Asegúrate de que no haya espacios extra
- Reinicia el servidor de desarrollo

### La imagen no se muestra
- Verifica que el bucket sea público
- Abre la URL de la imagen directamente en el navegador
- Revisa la consola del navegador (F12) para errores

## 📁 Archivos Modificados/Creados

| Archivo | Propósito |
|---------|-----------|
| `.env` | Credenciales de Supabase |
| `setup-images.sql` | Script SQL para configurar DB y Storage |
| `src/components/AdminPanel.tsx` | Lógica de subida de imágenes (ya incluido) |
| `src/lib/supabase.ts` | Cliente de Supabase (ya incluido) |

## 🔒 Seguridad

Las políticas actuales están configuradas para **desarrollo**:
- ✅ Cualquiera puede subir imágenes (sin autenticación)
- ✅ Cualquiera puede ver imágenes
- ✅ Cualquiera puede eliminar imágenes

**Para producción**, considera:
- Requerir autenticación para uploads
- Validar tipos de archivo más estrictamente
- Implementar límites de tamaño por usuario

---

¡Listo! Tu sistema de imágenes debería funcionar correctamente.
