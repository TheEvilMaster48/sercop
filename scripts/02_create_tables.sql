-- Script adicional para crear las tablas necesarias
-- Ejecuta este script si la tabla beneficiarios no existe

CREATE TABLE IF NOT EXISTS beneficiarios (
  id SERIAL PRIMARY KEY,
  cedula_ruc VARCHAR(13) UNIQUE NOT NULL,
  nombre_apellido VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(100),
  telefono VARCHAR(15),
  tipo_beneficiario VARCHAR(20) DEFAULT 'natural',
  razon_social VARCHAR(255),
  direccion TEXT,
  ciudad VARCHAR(100),
  provincia VARCHAR(100),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS documentos (
  id SERIAL PRIMARY KEY,
  beneficiario_id INTEGER REFERENCES beneficiarios(id) ON DELETE CASCADE,
  nombre_archivo VARCHAR(255) NOT NULL,
  contenido_texto TEXT,
  fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tipo_documento VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS procesos_contratacion (
  id SERIAL PRIMARY KEY,
  codigo_proceso VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  entidad_contratante VARCHAR(255),
  presupuesto DECIMAL(15,2),
  estado VARCHAR(30) DEFAULT 'activo',
  fecha_inicio DATE,
  fecha_cierre DATE,
  tipo_procedimiento VARCHAR(50),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_beneficiarios_cedula ON beneficiarios(cedula_ruc);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_estado ON beneficiarios(estado);
CREATE INDEX IF NOT EXISTS idx_documentos_beneficiario ON documentos(beneficiario_id);
CREATE INDEX IF NOT EXISTS idx_procesos_codigo ON procesos_contratacion(codigo_proceso);
CREATE INDEX IF NOT EXISTS idx_procesos_estado ON procesos_contratacion(estado);
