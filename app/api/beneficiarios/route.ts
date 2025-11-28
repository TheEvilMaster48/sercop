import { getBeneficiarios, createBeneficiario, getBeneficiarioByCedulaRuc } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const beneficiarios = await getBeneficiarios();
    return NextResponse.json(beneficiarios);
  } catch (error) {
    console.error('[v0] Error fetching beneficiarios:', error);
    return NextResponse.json({ error: 'Error fetching beneficiarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const datos = await request.json();
    
    // Validar campos requeridos
    if (!datos.cedula_ruc || !datos.nombre_apellido || !datos.correo_electronico) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe
    const existente = await getBeneficiarioByCedulaRuc(datos.cedula_ruc);
    if (existente) {
      return NextResponse.json(
        { error: 'La cédula/RUC ya está registrada' },
        { status: 400 }
      );
    }

    const beneficiario = await createBeneficiario(datos);
    return NextResponse.json(beneficiario, { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating beneficiario:', error);
    return NextResponse.json({ error: 'Error creating beneficiario' }, { status: 500 });
  }
}
