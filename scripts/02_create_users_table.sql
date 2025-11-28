-- Tabla de usuarios con username y persistencia de sesión
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  nombre_completo VARCHAR(255),
  email_verificado BOOLEAN DEFAULT FALSE,
  codigo_verificacion VARCHAR(6),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'inactivo', 'bloqueado'
  recordar_sesion BOOLEAN DEFAULT FALSE,
  token_sesion VARCHAR(255) UNIQUE
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_token_sesion ON usuarios(token_sesion);

-- Insertar usuarios de prueba
INSERT INTO usuarios (username, password_hash, email, telefono, nombre_completo, email_verificado) 
VALUES 
  ('admin', '$2b$10$YixZaYV34FFAKotyQe6Z2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUm', 'admin@sercop.gob.ec', '+593987654321', 'Administrador SERCOP', true),
  ('usuario1', '$2b$10$YixZaYV34FFAKotyQe6Z2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUm', 'usuario1@sercop.gob.ec', '+593998765432', 'Usuario Prueba', true);
