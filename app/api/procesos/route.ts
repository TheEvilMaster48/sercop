import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await query(`
      SELECT p.*, b.nombre, b.apellido 
      FROM procesos_contratacion p
      JOIN beneficiarios b ON p.beneficiario_id = b.id
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('[v0] Error fetching procesos:', error);
    return NextResponse.json({ error: 'Error fetching procesos' }, { status: 500 });
  }
}
