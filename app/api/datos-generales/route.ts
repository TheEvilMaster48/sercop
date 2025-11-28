//Creando API route para guardar datos generales</CHANGE>

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Aquí conectarías con tu base de datos PostgreSQL
    // Por ahora retornamos un mock
    console.log('Datos Generales recibidos:', body);

    return NextResponse.json({
      success: true,
      message: 'Datos generales guardados correctamente',
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
