import { query, getBeneficiarioById, updateBeneficiario } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beneficiario = await getBeneficiarioById(parseInt(id));
    
    if (!beneficiario) {
      return NextResponse.json({ error: 'Beneficiario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(beneficiario);
  } catch (error) {
    console.error('[v0] Error fetching beneficiario:', error);
    return NextResponse.json({ error: 'Error fetching beneficiario' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const datos = await request.json();

    const beneficiario = await updateBeneficiario(parseInt(id), datos);

    if (!beneficiario) {
      return NextResponse.json({ error: 'Beneficiario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(beneficiario);
  } catch (error) {
    console.error('[v0] Error updating beneficiario:', error);
    return NextResponse.json({ error: 'Error updating beneficiario' }, { status: 500 });
  }
}
