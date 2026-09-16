# 🚀 Guía Completa de Despliegue y Base de Datos - I'MAS

## 📋 Resumen del proceso

1. Crear cuenta en Supabase (base de datos)
2. Configurar la base de datos
3. Obtener credenciales
4. Configurar variables de entorno
5. Probar localmente
6. Desplegar en Vercel (gratis)

---

## 🗄️ PASO 1: Crear cuenta en Supabase

### 1.1 Registrarse
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Inicia sesión con GitHub (recomendado) o email

### 1.2 Crear nuevo proyecto
1. Haz clic en **"New Project"**
2. Completa los datos:
   - **Organization**: Tu organización (o la que aparece por defecto)
   - **Name**: `imas` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura y **GUÁRDALA**
   - **Region**: Selecciona la más cercana (ej: `US East` para Cuba)
   - **Pricing Plan**: Free (gratis)
3. Haz clic en **"Create new project"**
4. Espera 1-2 minutos a que se cree el proyecto

---

## 🗃️ PASO 2: Configurar la base de datos

### 2.1 Ejecutar el script SQL
1. En el panel de Supabase, ve a **"SQL Editor"** (ícono de código en el menú lateral)
2. Haz clic en **"New query"**
3. Abre el archivo `supabase-schema.sql` de este proyecto
4. Copia **TODO** el contenido del archivo
5. Pégalo en el SQL Editor de Supabase
6. Haz clic en **"Run"** (o presiona `Ctrl+Enter`)
7. Deberías ver: **"Success. No rows returned"**

### 2.2 Verificar que se creó la tabla
1. Ve a **"Table Editor"** (ícono de tabla en el menú lateral)
2. Deberías ver la tabla `menu_items`
3. Haz clic en ella para ver los 20 productos iniciales

---

## 🔑 PASO 3: Obtener credenciales

### 3.1 Ir a la configuración de API
1. En el menú lateral, haz clic en el ícono de **engranaje** (Settings)
2. Haz clic en **"API"**

### 3.2 Copiar las credenciales
Necesitas dos valores:

1. **Project URL**: 
   - Sección "Project URL"
   - Algo como: `https://abcdefghijk.supabase.co`
   - **Cópiala completa**

2. **anon public key**:
   - Sección "Project API keys"
   - Busca la clave que dice **"anon public"**
   - Es una cadena larga que empieza con `eyJhbGci...`
   - **Cópiala completa**

⚠️ **IMPORTANTE**: La clave `anon` es pública y segura para usar en el frontend. NO uses la clave `service_role`.

---

## 🔧 PASO 4: Configurar variables de entorno

### 4.1 Crear archivo .env
1. En la raíz de tu proyecto, crea un archivo llamado `.env` (sin extensión)
2. Copia el contenido de `.env.example`:

```bash
# En terminal (Linux/Mac):
cp .env.example .env

# O en Windows:
copy .env.example .env
```

### 4.2 Editar el archivo .env
Abre el archivo `.env` y reemplaza con tus credenciales:

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Mz...
```

⚠️ **IMPORTANTE**: 
- Reemplaza `https://abcdefghijk.supabase.co` con tu Project URL real
- Reemplaza la clave anon con tu clave real
- NO subas el archivo `.env` a Git (ya está en `.gitignore`)

---

## 🧪 PASO 5: Probar localmente

### 5.1 Instalar dependencias
```bash
npm install
```

### 5.2 Ejecutar en modo desarrollo
```bash
npm run dev
```

### 5.3 Verificar que funciona
1. Abre tu navegador en `http://localhost:5173`
2. Deberías ver los 20 productos cargados desde Supabase
3. Ve al panel de administración (usuario: `admin`, contraseña: `admin123`)
4. Prueba:
   - Crear un nuevo producto
   - Editar un producto existente
   - Eliminar un producto
   - Marcar un producto como agotado
5. Ve a la tabla `menu_items` en Supabase para verificar que los cambios se guardaron

### 5.4 Verificar en Supabase
1. Ve a **"Table Editor"** > **"menu_items"**
2. Deberías ver todos los cambios que hiciste
3. Si modificaste algo, recarga la página y verifica que persiste

---

## 🌐 PASO 6: Desplegar en Vercel

### 6.1 Preparar el proyecto
1. Asegúrate de que todo funcione localmente
2. Sube tu código a GitHub (si no lo has hecho):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

### 6.2 Crear cuenta en Vercel
1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"**
3. Inicia sesión con GitHub (recomendado)

### 6.3 Importar proyecto
1. Haz clic en **"Add New..."** > **"Project"**
2. Busca tu repositorio de GitHub
3. Haz clic en **"Import"**

### 6.4 Configurar variables de entorno en Vercel
1. En la página de configuración del proyecto, busca **"Environment Variables"**
2. Agrega las siguientes variables:

**Variable 1:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://abcdefghijk.supabase.co` (tu Project URL)

**Variable 2:**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGci...` (tu anon key)

3. Haz clic en **"Save"**

### 6.5 Desplegar
1. Haz clic en **"Deploy"**
2. Espera 1-2 minutos
3. Vercel te dará una URL como: `https://imas.vercel.app`
4. ¡Tu sitio está en línea!

### 6.6 Verificar el despliegue
1. Abre la URL que te dio Vercel
2. Verifica que los productos se carguen desde Supabase
3. Prueba el panel de administración
4. Verifica que los cambios se reflejen en Supabase

---

## 🔄 PASO 7: Actualizaciones futuras

### 7.1 Actualizar código
Cuando hagas cambios en el código:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel desplegará automáticamente los cambios.

### 7.2 Actualizar base de datos
Si necesitas modificar la estructura de la base de datos:

1. Ve a **"SQL Editor"** en Supabase
2. Ejecuta los comandos SQL necesarios
3. Los cambios se aplicarán inmediatamente

---

## 🛠️ Solución de problemas

### Problema: "Supabase credentials not found"
**Causa**: Las variables de entorno no están configuradas correctamente.

**Solución**:
1. Verifica que el archivo `.env` exista en la raíz del proyecto
2. Verifica que las variables empiecen con `VITE_`
3. Reinicia el servidor de desarrollo (`npm run dev`)

### Problema: Los productos no se cargan
**Causa**: La tabla no se creó o las políticas RLS están bloqueando el acceso.

**Solución**:
1. Verifica en Supabase que la tabla `menu_items` exista
2. Verifica que las políticas RLS estén configuradas (ver script SQL)
3. Revisa la consola del navegador para ver errores específicos

### Problema: Los cambios no se guardan
**Causa**: Las políticas RLS están bloqueando la escritura.

**Solución**:
1. Ve a **"Authentication"** > **"Policies"** en Supabase
2. Verifica que las políticas de INSERT, UPDATE y DELETE estén configuradas
3. Para desarrollo, puedes usar las políticas permisivas del script SQL

### Problema: Vercel no despliega
**Causa**: Las variables de entorno no están configuradas en Vercel.

**Solución**:
1. Ve a la configuración del proyecto en Vercel
2. Agrega las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Redeploy el proyecto

---

## 🔒 Seguridad (Para producción)

### Configurar autenticación real
Actualmente, el panel de administración usa credenciales hardcodeadas (`admin`/`admin123`). Para producción, deberías:

1. **Habilitar autenticación en Supabase**:
   - Ve a **"Authentication"** en Supabase
   - Configura Email/Password o providers externos (Google, GitHub)

2. **Actualizar las políticas RLS**:
   ```sql
   -- Solo usuarios autenticados pueden escribir
   DROP POLICY IF EXISTS "Permitir inserción" ON menu_items;
   CREATE POLICY "Solo autenticados pueden insertar"
     ON menu_items FOR INSERT
     WITH CHECK (auth.role() = 'authenticated');
   ```

3. **Actualizar el código de autenticación**:
   - Modifica `AdminLogin.tsx` para usar Supabase Auth
   - Protege las rutas del panel de administración

---

## 📊 Límites del plan gratuito de Supabase

- **500 MB** de base de datos
- **2 GB** de transferencia mensual
- **50,000** usuarios activos mensuales
- **500 MB** de storage de archivos

Para I'MAS, esto es más que suficiente. Si necesitas más, puedes actualizar a un plan de pago ($25/mes).

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación de Supabase: [https://supabase.com/docs](https://supabase.com/docs)
2. Revisa la documentación de Vercel: [https://vercel.com/docs](https://vercel.com/docs)
3. Abre un issue en el repositorio del proyecto

---

## ✅ Checklist final

- [ ] Cuenta de Supabase creada
- [ ] Proyecto de Supabase creado
- [ ] Tabla `menu_items` creada con el script SQL
- [ ] Políticas RLS configuradas
- [ ] Credenciales copiadas (Project URL y anon key)
- [ ] Archivo `.env` creado con las credenciales
- [ ] Pruebas locales exitosas
- [ ] Código subido a GitHub
- [ ] Cuenta de Vercel creada
- [ ] Variables de entorno configuradas en Vercel
- [ ] Sitio desplegado y funcionando
- [ ] Panel de administración funcionando
- [ ] Cambios se reflejan en Supabase

¡Felicidades! Tu sitio I'MAS está en línea con base de datos en la nube. 🎉
