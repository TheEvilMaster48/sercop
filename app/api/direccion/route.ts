//Creando API route para guardar datos de dirección y autoridad</CHANGE>

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Aquí conectarías con tu base de datos PostgreSQL
    console.log('Datos de Dirección recibidos:', body);

    return NextResponse.json({
      success: true,
      message: 'Dirección y datos de autoridad guardados correctamente',
      data: body
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
