// lib/query.ts
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

// ------------------------------
// FUNCION BASE
// ------------------------------
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("[DB] Query executed", { duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("[DB] Error:", error);
    throw error;
  }
}

// ------------------------------
// AUTH – LOGIN / TOKEN
// ------------------------------
export async function getUser(username: string) {
  const res = await query(
    `SELECT * FROM usuarios 
     WHERE username = $1 AND estado = 'activo'`,
    [username]
  );
  return res.rows[0];
}

export async function getUserByToken(token: string) {
  const res = await query(
    `SELECT id, username, email 
     FROM usuarios 
     WHERE token_sesion = $1`,
    [token]
  );
  return res.rows[0];
}

export async function updateUserToken(
  userId: number,
  token: string,
  rememberMe = false
) {
  const res = await query(
    `UPDATE usuarios
     SET token_sesion = $1, recordar_sesion = $2, ultimo_acceso = NOW()
     WHERE id = $3
     RETURNING id`,
    [token, rememberMe, userId]
  );
  return res.rows[0];
}

// ⚠️ CREA TOKEN SOLO SI NO EXISTE (para login infinito)
export async function saveTokenIfMissing(userId: number, currentToken: string | null) {
  if (currentToken) return currentToken;

  const crypto = await import("crypto");
  const newToken = crypto.randomBytes(32).toString("hex");

  await query(
    `UPDATE usuarios 
     SET token_sesion = $1, recordar_sesion = true
     WHERE id = $2`,
    [newToken, userId]
  );

  return newToken;
}

// CERRAR SESIÓN
export async function clearUserToken(token: string) {
  const res = await query(
    `UPDATE usuarios 
     SET token_sesion = NULL, recordar_sesion = false
     WHERE token_sesion = $1
     RETURNING id`,
    [token]
  );
  return res.rows[0];
}

// ------------------------------
// REGISTRO / VERIFICACIÓN EMAIL
// ------------------------------

export async function getUserByEmail(email: string) {
  const res = await query(
    `SELECT * FROM usuarios WHERE email = $1`,
    [email]
  );
  return res.rows[0];
}

export async function createUser(
  username: string,
  email: string,
  passwordHash: string,
  telefono: string,
  verificationCode: string
) {
  const res = await query(
    `INSERT INTO usuarios 
     (username, email, password_hash, telefono, codigo_verificacion, estado, email_verificado)
     VALUES ($1, $2, $3, $4, $5, 'activo', false)
     RETURNING id, email`,
    [username, email, passwordHash, telefono, verificationCode]
  );
  return res.rows[0];
}

export async function updateVerificationCode(email: string, code: string) {
  const res = await query(
    `UPDATE usuarios
     SET codigo_verificacion = $1
     WHERE email = $2
     RETURNING id`,
    [code, email]
  );
  return res.rows[0];
}

export async function verifyEmailCode(email: string, code: string) {
  const res = await query(
    `UPDATE usuarios
     SET email_verificado = true, codigo_verificacion = NULL
     WHERE email = $1 AND codigo_verificacion = $2
     RETURNING id`,
    [email, code]
  );
  return res.rows[0];
}
