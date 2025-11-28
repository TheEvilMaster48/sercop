'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DatosGeneralesData {
  ruc: string;
  ruc_sucursal: string;
  nombre_entidad: string;
  maneja_esigef: boolean;
  logo_url: string;
}

export function DatosGeneralesForm() {
  const [formData, setFormData] = useState<DatosGeneralesData>({
    ruc: '',
    ruc_sucursal: '',
    nombre_entidad: '',
    maneja_esigef: false,
    logo_url: ''
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
      const response = await fetch('/api/datos-generales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('✓ Datos generales guardados exitosamente');
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
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Datos Generales de la Entidad</h2>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('✓') ? 'bg-green-50 border border-green-300 text-green-800' : 'bg-red-50 border border-red-300 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              RUC de la Entidad <span className="text-red-600">*</span>
            </label>
            <Input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              placeholder="Ej: 1768157548001"
              maxLength="13"
              required
              className="px-4 py-2.5 border-2 border-gray-300 rounded focus:border-blue-900"
            />
            <p className="text-xs text-gray-500 mt-1">Máximo 13 caracteres numéricos</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              RUC Sucursal (Opcional)
            </label>
            <Input
              type="text"
              name="ruc_sucursal"
              value={formData.ruc_sucursal}
              onChange={handleChange}
              placeholder="Ej: 1768157548002"
              maxLength="15"
              className="px-4 py-2.5 border-2 border-gray-300 rounded focus:border-blue-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre de la Entidad Contratante <span className="text-red-600">*</span>
          </label>
          <Input
            type="text"
            name="nombre_entidad"
            value={formData.nombre_entidad}
            onChange={handleChange}
            placeholder="Ej: Ministerio de Educación"
            maxLength="100"
            required
            className="px-4 py-2.5 border-2 border-gray-300 rounded focus:border-blue-900"
          />
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
          <input
            type="checkbox"
            name="maneja_esigef"
            checked={formData.maneja_esigef}
            onChange={handleChange}
            id="esigef"
            className="w-5 h-5 rounded text-blue-900 cursor-pointer"
          />
          <label htmlFor="esigef" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
            La entidad maneja ESIGEF
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Logo de la Institución (Opcional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-900 transition">
            <input
              type="text"
              placeholder="URL del logo (máximo 35kb, formato JPG)"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-600 mt-2">O haz clic para cargar</p>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 rounded transition-all disabled:opacity-60"
          >
            {loading ? '⏳ Guardando...' : '💾 Guardar Datos Generales'}
          </Button>
          <Button
            type="button"
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded"
            onClick={() => {
              setFormData({
                ruc: '',
                ruc_sucursal: '',
                nombre_entidad: '',
                maneja_esigef: false,
                logo_url: ''
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
