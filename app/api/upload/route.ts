import { NextRequest, NextResponse } from 'next/server';
import { createDocumento } from '@/lib/db';

// Smart data extraction function
function extractDataFromFile(fileName: string, content: string): any {
  console.log('[v0] Extracting data from:', fileName);
  
  try {
    // Try to parse as JSON first
    try {
      const json = JSON.parse(content);
      return {
        cedula_ruc: json.cedula || json.cedula_ruc || json.ruc || '',
        nombre_apellido: json.nombre || json.nombre_apellido || json.fullname || '',
        correo_electronico: json.correo || json.email || json.correo_electronico || '',
        telefono: json.telefono || json.phone || json.tel || '',
        razon_social: json.razon_social || json.empresa || json.company || '',
        provincia: json.provincia || json.province || json.estado || '',
      };
    } catch (e) {
      // If not JSON, extract from text content
    }

    // Extract from text using regex patterns
    const extracted: any = {};

    // Try to find cédula/RUC (10-13 digits)
    const cedulaMatch = content.match(/(\d{10,13})/);
    extracted.cedula_ruc = cedulaMatch ? cedulaMatch[1] : '';

    // Try to find email
    const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/);
    extracted.correo_electronico = emailMatch ? emailMatch[0] : '';

    // Try to find phone  (REGEX CORREGIDA)
    const phoneMatch = content.match(/(\+?\d{1,3}[-\s.]?)?\d{2,4}[-\s.]?\d{3}[-\s.]?\d{3,4}/);
    extracted.telefono = phoneMatch ? phoneMatch[0] : '';

    // Try to find name (look for patterns with capital letters)
    const nameMatch = content.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
    extracted.nombre_apellido = nameMatch ? nameMatch[1] : '';

    // Try to find province
    const provincesMatch = content.match(/(Pichincha|Guayas|Azuay|Tungurahua|Imbabura|Manabí|Los Ríos|Santa Elena|Esmeraldas|Cotopaxi|Pastaza|Morona Santiago|Zamora Chinchipe|Napo|Sucumbíos|Orellana)/i);
    extracted.provincia = provincesMatch ? provincesMatch[1] : '';

    console.log('[v0] Extracted data:', extracted);
    return extracted;
  } catch (error) {
    console.error('[v0] Error extracting data:', error);
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const beneficiario_id = formData.get('beneficiario_id') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('[v0] Processing file:', file.name);

    // Read file content
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(buffer);

    // Extract data from file
    const extracted_data = extractDataFromFile(file.name, content);

    // Save document to database if beneficiario_id provided
    if (beneficiario_id && beneficiario_id !== 'undefined') {
      try {
        const documento = await createDocumento(parseInt(beneficiario_id), {
          nombre_archivo: file.name,
          tipo_documento: file.type,
          contenido_texto: content.substring(0, 5000), // Save first 5000 chars
        });
        console.log('[v0] Document saved:', documento);
      } catch (dbError) {
        console.warn('[v0] Could not save document to DB:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      extracted_data,
      file_name: file.name,
    }, { status: 200 });
  } catch (error) {
    console.error('[v0] Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
