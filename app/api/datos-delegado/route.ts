//Creando API route para guardar datos del delegado</CHANGE>

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Aquí conectarías con tu base de datos PostgreSQL
    console.log('Datos del Delegado recibidos:', body);

    return NextResponse.json({
      success: true,
      message: 'Datos del delegado guardados correctamente',
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
