# 🚀 Guía de Despliegue en Cloudflare Pages - I'MAS

## 📋 Resumen del proceso

1. Crear cuenta en Supabase (base de datos)
2. Configurar la base de datos
3. Obtener credenciales
4. Configurar variables de entorno localmente
5. Probar localmente
6. Subir código a GitHub
7. Desplegar en Cloudflare Pages

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

## 🔧 PASO 4: Configurar variables de entorno localmente

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

---

## 📤 PASO 6: Subir código a GitHub

### 6.1 Crear archivo .gitignore (si no existe)
Asegúrate de que `.gitignore` contenga:

```gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
build

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### 6.2 Inicializar Git y subir a GitHub
```bash
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit - I'MAS app with Supabase"

# Crear rama principal
git branch -M main

# Agregar repositorio remoto (reemplaza con tu URL de GitHub)
git remote add origin https://github.com/TU-USUARIO/imas.git

# Subir el código
git push -u origin main
```

⚠️ **IMPORTANTE**: 
- Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub
- Reemplaza `imas` con el nombre de tu repositorio
- Crea el repositorio en GitHub primero (puedes hacerlo desde github.com/new)

---

## 🌐 PASO 7: Desplegar en Cloudflare Pages

### 7.1 Crear cuenta en Cloudflare
1. Ve a [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Regístrate con email o GitHub
3. Verifica tu email

### 7.2 Ir a Cloudflare Pages
1. En el menú lateral izquierdo, busca **"Workers & Pages"**
2. Haz clic en **"Create application"**
3. Selecciona la pestaña **"Pages"**
4. Haz clic en **"Connect to Git"**

### 7.3 Conectar tu repositorio de GitHub
1. Si es la primera vez, Cloudflare te pedirá autorización
2. Haz clic en **"Authorize Cloudflare"**
3. Selecciona tu cuenta de GitHub
4. Elige el repositorio `imas` que creaste
5. Haz clic en **"Begin setup"**

### 7.4 Configurar el build
En la página de configuración del build, completa:

**Framework preset**: 
- Selecciona **"None"** (o busca "Vite" si aparece)

**Build settings**:
- **Project name**: `imas`
- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### 7.5 Agregar variables de entorno ⚠️ MUY IMPORTANTE
1. Despliega la sección **"Environment variables"**
2. Haz clic en **"Add variable"**
3. Agrega la primera variable:
   - **Variable name**: `VITE_SUPABASE_URL`
   - **Value**: `https://abcdefghijk.supabase.co` (tu Project URL de Supabase)
   
4. Haz clic en **"Save and deploy"** (NO, espera, primero agrega la segunda)
5. Haz clic en **"Add variable"** nuevamente
6. Agrega la segunda variable:
   - **Variable name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGci...` (tu anon key completa de Supabase)

⚠️ **IMPORTANTE**: 
- Las variables DEBEN empezar con `VITE_` para que Vite las reconozca
- Asegúrate de copiar la clave completa sin espacios
- Estas variables son para el entorno de **Production**

### 7.6 Desplegar
1. Haz clic en **"Save and Deploy"**
2. Espera 2-3 minutos mientras Cloudflare:
   - Clona tu repositorio
   - Instala dependencias (`npm install`)
   - Ejecuta el build (`npm run build`)
   - Despliega el sitio
3. Verás el progreso en tiempo real

### 7.7 Verificar el despliegue
1. Cuando termine, verás: **"Success!"**
2. Cloudflare te dará una URL como: `https://imas.pages.dev`
3. Haz clic en **"Visit site"** o abre la URL en tu navegador
4. Verifica que:
   - Los 20 productos se carguen desde Supabase
   - El panel de administración funcione
   - Los cambios se guarden en Supabase
   - El checkout por WhatsApp funcione

---

## 🎨 PASO 8: Personalizar el dominio (opcional)

### 8.1 Cambiar el subdominio de Cloudflare
1. En Cloudflare Pages, ve a tu proyecto `imas`
2. Haz clic en **"Custom domains"**
3. Haz clic en **"Set up a custom domain"**
4. Puedes usar el dominio gratuito de Cloudflare: `imas.pages.dev`
5. O conectar tu propio dominio (ej: `imas.com`)

### 8.2 Conectar dominio propio (opcional)
Si tienes un dominio propio:
1. Haz clic en **"Activate a domain"**
2. Ingresa tu dominio (ej: `imas.com`)
3. Cloudflare te dará instrucciones para configurar los DNS
4. Si tu dominio está en Cloudflare, se configura automáticamente
5. Si está en otro proveedor, deberás cambiar los DNS manualmente

---

## 🔄 PASO 9: Actualizaciones automáticas

### 9.1 Cómo funciona
Una vez desplegado, Cloudflare Pages detectará automáticamente los cambios en tu repositorio:

```bash
# Cuando hagas cambios en el código
git add .
git commit -m "Actualizar productos"
git push
```

Cloudflare automáticamente:
1. Detectará el push a la rama `main`
2. Ejecutará el build
3. Desplegará la nueva versión
4. Todo en 1-2 minutos

### 9.2 Ver el historial de deploys
1. En tu proyecto de Cloudflare Pages
2. Ve a la pestaña **"Deployments"**
3. Verás todos los deploys con su estado y fecha
4. Puedes hacer rollback a versiones anteriores si es necesario

---

## 🛠️ Solución de problemas

### Problema: "Build failed"
**Causa**: Error en el build o dependencias faltantes

**Solución**:
1. Ve a la pestaña **"Deployments"**
2. Haz clic en el deploy fallido
3. Revisa los logs para ver el error específico
4. Errores comunes:
   - Dependencias faltantes: `npm install` falló
   - Error de sintaxis en el código
   - Variables de entorno mal configuradas

### Problema: "Supabase credentials not found"
**Causa**: Las variables de entorno no están configuradas en Cloudflare

**Solución**:
1. Ve a tu proyecto en Cloudflare Pages
2. Haz clic en **"Settings"** → **"Environment variables"**
3. Verifica que existan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Si no existen, agrégalas
5. Haz un nuevo deploy (puedes hacerlo desde la pestaña "Deployments")

### Problema: Los productos no se cargan
**Causa**: La tabla no se creó o las políticas RLS están bloqueando el acceso

**Solución**:
1. Verifica en Supabase que la tabla `menu_items` exista
2. Verifica que tenga los 20 productos
3. Verifica que las políticas RLS estén configuradas (ver script SQL)
4. Revisa la consola del navegador (F12) para ver errores específicos

### Problema: Los cambios no se guardan en Supabase
**Causa**: Las políticas RLS están bloqueando la escritura

**Solución**:
1. Ve a **"Authentication"** → **"Policies"** en Supabase
2. Verifica que las políticas de INSERT, UPDATE y DELETE estén configuradas
3. Para desarrollo, puedes usar las políticas permisivas del script SQL

### Problema: "Page not found" después del deploy
**Causa**: Configuración incorrecta del build output

**Solución**:
1. Verifica que el **"Build output directory"** sea `dist`
2. Verifica que el **"Build command"** sea `npm run build`
3. Haz un nuevo deploy

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

## 📊 Ventajas de Cloudflare Pages

- ✅ **Bandwidth ilimitado**: No tienes que preocuparte por el tráfico
- ✅ **CDN global**: Tu sitio se carga rápido en todo el mundo
- ✅ **SSL automático**: HTTPS incluido sin configuración
- ✅ **Deploy automático**: Cada push a GitHub despliega automáticamente
- ✅ **500 builds/mes**: Más que suficiente para desarrollo activo
- ✅ **Preview deployments**: Cada pull request genera una URL de preview
- ✅ **Totalmente gratis**: Sin límites ocultos para sitios estáticos

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación de Cloudflare Pages: [https://developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
2. Revisa la documentación de Supabase: [https://supabase.com/docs](https://supabase.com/docs)
3. Revisa los logs de deploy en Cloudflare Pages

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
- [ ] Cuenta de Cloudflare creada
- [ ] Repositorio conectado a Cloudflare Pages
- [ ] Variables de entorno configuradas en Cloudflare
- [ ] Build configurado correctamente (npm run build, dist)
- [ ] Sitio desplegado y funcionando
- [ ] Panel de administración funcionando
- [ ] Cambios se reflejan en Supabase

---

## 🎉 ¡Felicidades!

Tu sitio I'MAS está en línea con:
- ✅ Base de datos en la nube (Supabase)
- ✅ CDN global ultra rápido (Cloudflare)
- ✅ Deploy automático desde GitHub
- ✅ HTTPS automático
- ✅ Bandwidth ilimitado

¡Disfruta tu aplicación en producción! 🚀
