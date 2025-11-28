-- Updated schema to match SERCOP design with cedula_ruc, nombre_apellido, etc.

-- Tabla de beneficiarios (Personas Naturales y Jurídicas)
CREATE TABLE IF NOT EXISTS beneficiarios (
  id SERIAL PRIMARY KEY,
  cedula_ruc VARCHAR(13) UNIQUE NOT NULL,
  nombre_apellido VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(100),
  telefono VARCHAR(15),
  tipo_beneficiario VARCHAR(20) DEFAULT 'natural', -- 'natural' o 'juridica'
  razon_social VARCHAR(255),
  direccion TEXT,
  ciudad VARCHAR(100),
  provincia VARCHAR(100),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'activo'
);

-- Tabla de documentos/archivos cargados
CREATE TABLE IF NOT EXISTS documentos (
  id SERIAL PRIMARY KEY,
  beneficiario_id INTEGER REFERENCES beneficiarios(id) ON DELETE CASCADE,
  nombre_archivo VARCHAR(255) NOT NULL,
  contenido_texto TEXT, -- Datos extraídos del archivo
  fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tipo_documento VARCHAR(50) -- 'oferta', 'pliegos', etc.
);

-- Tabla de procesos de contratación
CREATE TABLE IF NOT EXISTS procesos_contratacion (
  id SERIAL PRIMARY KEY,
  codigo_proceso VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  entidad_contratante VARCHAR(255),
  presupuesto DECIMAL(15,2),
  estado VARCHAR(30) DEFAULT 'activo', -- 'activo', 'cerrado', 'desierto'
  fecha_inicio DATE,
  fecha_cierre DATE,
  tipo_procedimiento VARCHAR(50), -- 'licitacion', 'cotizacion', 'menor_cuantia', etc.
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_beneficiarios_cedula ON beneficiarios(cedula_ruc);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_estado ON beneficiarios(estado);
CREATE INDEX IF NOT EXISTS idx_documentos_beneficiario ON documentos(beneficiario_id);
CREATE INDEX IF NOT EXISTS idx_procesos_codigo ON procesos_contratacion(codigo_proceso);
CREATE INDEX IF NOT EXISTS idx_procesos_estado ON procesos_contratacion(estado);

-- Insertar datos de muestra de beneficiarios
INSERT INTO beneficiarios (cedula_ruc, nombre_apellido, correo_electronico, telefono, tipo_beneficiario, razon_social, provincia) 
VALUES 
  ('1718502145', 'Juan Pérez García', 'juan.perez@email.com', '+593987654321', 'natural', NULL, 'Pichincha'),
  ('0502145671', 'María Rodríguez López', 'maria.rodriguez@email.com', '+593998765432', 'natural', NULL, 'Guayas'),
  ('1791234567', 'Constructora Andina S.A.', 'info@constructora.com', '+593212345678', 'juridica', 'Constructora Andina S.A.', 'Pichincha'),
  ('0790312456', 'Suministros Industriales Ecuador', 'ventas@suministros.com', '+593223456789', 'juridica', 'Suministros Industriales Ecuador', 'Azuay'),
  ('1712345678', 'Carlos Morales Vélez', 'carlos.morales@email.com', '+593912345678', 'natural', NULL, 'Tungurahua');

-- Insertar datos de muestra de procesos
INSERT INTO procesos_contratacion (codigo_proceso, descripcion, entidad_contratante, presupuesto, estado, fecha_inicio, fecha_cierre, tipo_procedimiento) 
VALUES 
  ('PROC-2025-001', 'Compra de equipos de cómputo', 'Ministerio de Educación', 45000.00, 'activo', '2025-01-15', '2025-02-15', 'licitacion'),
  ('PROC-2025-002', 'Servicios de consultoría en infraestructura', 'GAD Quito', 75000.00, 'activo', '2025-01-20', '2025-03-01', 'cotizacion'),
  ('PROC-2025-003', 'Suministro de materiales de limpieza', 'Hospital Central', 12000.00, 'activo', '2025-02-01', '2025-02-20', 'menor_cuantia'),
  ('PROC-2025-004', 'Construcción de pabellón educativo', 'Municipalidad de Guayaquil', 250000.00, 'cerrado', '2024-12-01', '2025-01-30', 'licitacion');
