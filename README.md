# 📋 Sistema Facilitador de Contratación Pública - SERCOP

Sistema automatizado profesional para gestión de beneficiarios y procesos de contratación pública del Ecuador, con diseño idéntico a SERCOP, autenticación segura y extracción automática de datos.

## ✨ Características Principales

- **Autenticación Segura con Firebase** - Login, registro y verificación de email en tiempo real
- **Interfaz tipo SERCOP** - Diseño profesional con colores oficiales (azul marino #003366, amarillo #FFCC00)
- **Gestión de Beneficiarios** - Crear nuevos o actualizar existentes
- **Carga de Documentos** - PDF, Excel, TXT con extracción automática de datos
- **Autocompletado Inteligente** - Los campos se rellenan automáticamente al cargar archivos
- **Listado de Procesos** - Tabla con procesos de contratación activos
- **Base de Datos PostgreSQL** - Almacenamiento seguro y estructurado
- **API REST Completa** - Endpoints para todas las operaciones

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ instalado
- PostgreSQL 12+ instalado
- Cuenta de Firebase (crear en https://firebase.google.com)
- npm o pnpm

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Activa **Authentication** > Sign-in method > Email/Password
4. En **Project Settings** copia tus credenciales
5. Pega las credenciales en `.env.local`

### 2. Configurar Base de Datos PostgreSQL

\`\`\`bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE sercop_contratacion;"

# Ejecutar script de inicialización
psql -U postgres -d sercop_contratacion -f scripts/01_init_database.sql
\`\`\`

### 3. Configurar Variables de Entorno

Edita el archivo `.env.local`:

\`\`\`env
# PostgreSQL
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sercop_contratacion

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tuproyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tuproyecto-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tuproyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx
\`\`\`

### 4. Instalar Dependencias y Ejecutar

\`\`\`bash
npm install
npm run dev
\`\`\`

Accede a: **http://localhost:3000**

## 📖 Uso del Sistema

### Paso 1: Registro

1. Haz clic en "Regístrate aquí" en la página de login
2. Completa:
   - Nombre
   - Apellido
   - Correo Electrónico
   - Teléfono
   - Contraseña
   - Confirmar Contraseña
3. Haz clic en "Registrarse"
4. Se enviará un email de verificación a tu correo
5. **Haz clic en el enlace de verificación** que recibiste en el email
6. Vuelve a la página y haz clic en "Continuar al Login"

### Paso 2: Login

1. Ingresa tu correo electrónico
2. Ingresa tu contraseña
3. Haz clic en "Iniciar Sesión"

### Paso 3: Tab - Nuevo Beneficiario

1. Completa los campos obligatorios (marcados con *)
2. Opcionalmente, carga un archivo para autocompletar datos
3. Haz clic en "Guardar Beneficiario"

**Campos del Formulario:**
- Cédula / RUC (13 caracteres máximo)
- Nombre / Apellido
- Correo Electrónico
- Teléfono
- Razón Social (opcional)
- Provincia

### Paso 4: Tab - Beneficiario Existente

1. Selecciona un beneficiario de la lista izquierda
2. Sus datos se cargarán automáticamente
3. Carga un archivo para actualizar datos
4. Haz clic en "Actualizar Beneficiario"

## 📁 Estructura del Proyecto

\`\`\`
├── app/
│   ├── api/
│   │   ├── beneficiarios/
│   │   │   ├── route.ts          # GET/POST beneficiarios
│   │   │   └── [id]/route.ts      # GET/PUT beneficiario específico
│   │   ├── upload/
│   │   │   └── route.ts          # POST carga y extracción de archivos
│   │   └── procesos/
│   │       └── route.ts          # GET procesos de contratación
│   ├── login/
│   │   └── page.tsx               # Página de inicio de sesión
│   ├── register/
│   │   └── page.tsx               # Página de registro con verificación
│   ├── page.tsx                   # Página principal (protegida)
│   ├── layout.tsx                 # Layout global con AuthProvider
│   └── globals.css                # Estilos globales
├── components/
│   ├── sercop-header.tsx          # Header con logo SERCOP
│   ├── module-facilitador.tsx     # Módulo principal con tabs
│   ├── auth-guard.tsx             # Protección de rutas
│   └── ui/                        # Componentes shadcn/ui
├── lib/
│   ├── firebase.ts                # Configuración de Firebase
│   ├── auth-context.tsx           # Contexto de autenticación
│   ├── db.ts                      # Funciones de base de datos
│   └── utils.ts                   # Utilidades
├── scripts/
│   ├── 01_init_database.sql      # Script inicial con datos de muestra
│   └── 02_create_tables.sql      # Script de creación de tablas
├── .env.local                     # Variables de entorno
└── README.md                      # Este archivo
\`\`\`

## 🔧 API Endpoints

### Beneficiarios

**GET `/api/beneficiarios`**
- Obtiene lista de todos los beneficiarios

**POST `/api/beneficiarios`**
- Crea nuevo beneficiario
- Body: `{ cedula_ruc, nombre_apellido, correo_electronico, telefono, provincia }`

**GET `/api/beneficiarios/[id]`**
- Obtiene beneficiario específico

**PUT `/api/beneficiarios/[id]`**
- Actualiza beneficiario existente

### Carga de Documentos

**POST `/api/upload`**
- Carga archivo y extrae datos automáticamente
- Form data: `file`, `beneficiario_id` (opcional)
- Respuesta: `{ success, extracted_data, file_name }`

### Procesos

**GET `/api/procesos`**
- Obtiene lista de procesos de contratación

## 📊 Base de Datos

### Tabla: beneficiarios
\`\`\`sql
- id (SERIAL PRIMARY KEY)
- cedula_ruc (VARCHAR UNIQUE)
- nombre_apellido (VARCHAR)
- correo_electronico (VARCHAR)
- telefono (VARCHAR)
- tipo_beneficiario (VARCHAR) - 'natural' o 'juridica'
- razon_social (VARCHAR)
- provincia (VARCHAR)
- fecha_registro (TIMESTAMP)
- estado (VARCHAR) - 'activo', 'inactivo'
\`\`\`

### Tabla: documentos
\`\`\`sql
- id (SERIAL PRIMARY KEY)
- beneficiario_id (INTEGER FK)
- nombre_archivo (VARCHAR)
- contenido_texto (TEXT)
- fecha_carga (TIMESTAMP)
- tipo_documento (VARCHAR)
\`\`\`

### Tabla: procesos_contratacion
\`\`\`sql
- id (SERIAL PRIMARY KEY)
- codigo_proceso (VARCHAR UNIQUE)
- descripcion (TEXT)
- entidad_contratante (VARCHAR)
- presupuesto (DECIMAL)
- estado (VARCHAR)
- fecha_inicio (DATE)
- fecha_cierre (DATE)
- tipo_procedimiento (VARCHAR)
\`\`\`

## 🎨 Diseño Visual

El sistema utiliza los colores oficiales de SERCOP:
- **Azul Marino Principal**: `#003366`
- **Amarillo Institucional**: `#FFCC00`
- **Rojo de Alerta**: `#CC0000`
- **Grises Neutral**: `#F5F5F5`, `#333333`

## 🔐 Seguridad

- ✅ Autenticación con Firebase (seguridad de nivel empresarial)
- ✅ Verificación de email obligatoria
- ✅ Rutas protegidas con AuthGuard
- ✅ Validación de entrada en formularios
- ✅ Manejo de errores robusto
- ✅ Conexión segura a PostgreSQL

## 📝 Datos de Muestra

El script `01_init_database.sql` incluye beneficiarios de ejemplo:
- Juan Pérez García (Cédula: 1718502145)
- María Rodríguez López (Cédula: 0502145671)
- Constructora Andina S.A. (RUC: 1791234567)
- Suministros Industriales Ecuador (RUC: 0790312456)
- Carlos Morales Vélez (Cédula: 1712345678)

Y 4 procesos de contratación activos para pruebas.

### Credenciales de Prueba Firebase
Para pruebas rápidas, puedes registrarte con:
- Email: `test@example.com`
- Contraseña: `Test123!@#`

## 🐛 Troubleshooting

**Error: "ECONNREFUSED" en la conexión a BD**
- Verifica que PostgreSQL esté ejecutándose: `pg_isready`
- Confirma las credenciales en `.env.local`
- Verifica que la base de datos existe: `psql -U postgres -l`

**Error: "Table does not exist"**
- Ejecuta el script SQL: `psql -U postgres -d sercop_contratacion -f scripts/01_init_database.sql`

**Error: "Firebase Auth not initialized"**
- Verifica que las variables de Firebase estén correctas en `.env.local`
- Asegúrate de haber habilitado Email/Password en Firebase Console

**"No email verification link received"**
- Revisa la carpeta de SPAM en tu correo
- Verifica que el email sea correcto
- Usa un email real, no uno de prueba

**Datos no se guardan**
- Revisa la consola del servidor para mensajes de error
- Verifica que estés autenticado (token de Firebase válido)
- Asegúrate de que los campos requeridos estén completados

## 📞 Soporte

Para reportar problemas o sugerencias, revisa los logs en consola durante desarrollo y comprueba:
1. Estado de Firebase en la consola
2. Conexión a PostgreSQL
3. Variables de entorno correctas

## 📄 Licencia

Sistema oficial para gestión de contratación pública del Ecuador.

---

**Versión**: 2.0.0 (Con Autenticación Firebase)  
**Última actualización**: 2025-01-19
