'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DatosDelegadoData {
  tiene_delegado: boolean;
  cedula_delegado: string;
  nombre_delegado: string;
  cargo_delegado: string;
  numero_documento_delegacion: string;
  fecha_resolucion: string;
}

export function DatosDelegadoForm() {
  const [formData, setFormData] = useState<DatosDelegadoData>({
    tiene_delegado: false,
    cedula_delegado: '',
    nombre_delegado: '',
    cargo_delegado: '',
    numero_documento_delegacion: '',
    fecha_resolucion: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/datos-delegado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('✓ Datos del delegado guardados exitosamente');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('✗ Error al guardar los datos');
      }
    } catch (error) {
      setMessage('✗ Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white rounded-lg shadow-md border-0">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Datos de Delegación</h2>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('✓') ? 'bg-green-50 border border-green-300 text-green-800' : 'bg-red-50 border border-red-300 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              name="tiene_delegado"
              checked={formData.tiene_delegado}
              onChange={handleChange}
              id="delegado"
              className="w-6 h-6 rounded text-blue-900 cursor-pointer"
            />
            <div>
              <label htmlFor="delegado" className="text-lg font-semibold text-blue-900 cursor-pointer">
                La entidad tiene un Delegado
              </label>
              <p className="text-sm text-blue-700 mt-1">
                El delegado será quien suscriba los documentos relevantes de la contratación
              </p>
            </div>
          </div>
        </div>

        {formData.tiene_delegado && (
          <div className="space-y-6 bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-600 italic">
              Complete los siguientes datos del delegado designado por la máxima autoridad
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cédula del Delegado <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="cedula_delegado"
                value={formData.cedula_delegado}
                onChange={handleChange}
                placeholder="Ej: 1718502145"
                maxLength="10"
                required={formData.tiene_delegado}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombres y Apellidos <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="nombre_delegado"
                value={formData.nombre_delegado}
                onChange={handleChange}
                placeholder="Ej: Carlos Mendoza Rivera"
                maxLength="100"
                required={formData.tiene_delegado}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cargo del Delegado <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="cargo_delegado"
                value={formData.cargo_delegado}
                onChange={handleChange}
                placeholder="Ej: Director Ejecutivo"
                maxLength="100"
                required={formData.tiene_delegado}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Documento de Delegación <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="numero_documento_delegacion"
                value={formData.numero_documento_delegacion}
                onChange={handleChange}
                placeholder="Ej: Resolución No. RES-2024-001"
                maxLength="100"
                required={formData.tiene_delegado}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de la Resolución <span className="text-red-600">*</span>
              </label>
              <Input
                type="date"
                name="fecha_resolucion"
                value={formData.fecha_resolucion}
                onChange={handleChange}
                required={formData.tiene_delegado}
              />
              <p className="text-xs text-gray-600 mt-1">Debe ser anterior o igual a hoy</p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ Importante
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Deberá adjuntar la Resolución de Delegación en la sección de Anexos al momento de elaborar los pliegos
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-6 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 rounded transition-all disabled:opacity-60"
          >
            {loading ? '⏳ Guardando...' : '💾 Guardar Datos de Delegado'}
          </Button>
          <Button
            type="button"
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded"
            onClick={() => {
              setFormData({
                tiene_delegado: false,
                cedula_delegado: '',
                nombre_delegado: '',
                cargo_delegado: '',
                numero_documento_delegacion: '',
                fecha_resolucion: ''
              });
            }}
          >
            🔄 Limpiar
          </Button>
        </div>
      </form>
    </Card>
  );
}
