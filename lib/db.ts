import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

// Función genérica para ejecutar queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[DB] Query executed', { duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('[DB] Database error:', error);
    throw error;
  }
}

// Obtener todos los beneficiarios
export async function getBeneficiarios() {
  const res = await query('SELECT * FROM beneficiarios ORDER BY fecha_registro DESC');
  return res.rows;
}

// Obtener beneficiario por ID
export async function getBeneficiarioById(id: number) {
  const res = await query('SELECT * FROM beneficiarios WHERE id = $1', [id]);
  return res.rows[0];
}

// Obtener beneficiario por cédula/RUC
export async function getBeneficiarioByCedulaRuc(cedula_ruc: string) {
  const res = await query('SELECT * FROM beneficiarios WHERE cedula_ruc = $1', [cedula_ruc]);
  return res.rows[0];
}

// Crear beneficiario
export async function createBeneficiario(datos: any) {
  const { cedula_ruc, nombre_apellido, correo_electronico, telefono, tipo_beneficiario, razon_social, provincia } = datos;

  const res = await query(
    `INSERT INTO beneficiarios 
    (cedula_ruc, nombre_apellido, correo_electronico, telefono, tipo_beneficiario, razon_social, provincia) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [cedula_ruc, nombre_apellido, correo_electronico, telefono, tipo_beneficiario, razon_social, provincia]
  );
  return res.rows[0];
}

// Actualizar beneficiario
export async function updateBeneficiario(id: number, datos: any) {
  const { nombre_apellido, correo_electronico, telefono, razon_social, provincia } = datos;

  const res = await query(
    `UPDATE beneficiarios 
    SET nombre_apellido = $1, correo_electronico = $2, telefono = $3, razon_social = $4, provincia = $5 
    WHERE id = $6 RETURNING *`,
    [nombre_apellido, correo_electronico, telefono, razon_social, provincia, id]
  );
  return res.rows[0];
}

// Crear documento
export async function createDocumento(beneficiario_id: number, datos: any) {
  const { nombre_archivo, tipo_documento, contenido_texto } = datos;

  const res = await query(
    `INSERT INTO documentos (beneficiario_id, nombre_archivo, tipo_documento, contenido_texto) 
    VALUES ($1, $2, $3, $4) RETURNING *`,
    [beneficiario_id, nombre_archivo, tipo_documento, contenido_texto]
  );
  return res.rows[0];
}
