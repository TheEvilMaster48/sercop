'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DireccionData {
  provincia: string;
  canton: string;
  parroquia: string;
  calle_principal: string;
  interseccion: string;
  numero: string;
  referencia: string;
  codigo_postal: string;
  autoridad_nombre: string;
  autoridad_cargo: string;
  autoridad_cedula: string;
  representante_nombre: string;
  representante_cedula: string;
}

export function DireccionForm() {
  const [formData, setFormData] = useState<DireccionData>({
    provincia: '',
    canton: '',
    parroquia: '',
    calle_principal: '',
    interseccion: '',
    numero: '',
    referencia: '',
    codigo_postal: '',
    autoridad_nombre: '',
    autoridad_cargo: '',
    autoridad_cedula: '',
    representante_nombre: '',
    representante_cedula: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/direccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('✓ Dirección y datos de autoridad guardados exitosamente');
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
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Dirección y Datos de Autoridad</h2>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('✓') ? 'bg-green-50 border border-green-300 text-green-800' : 'bg-red-50 border border-red-300 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECCIÓN UBICACIÓN */}
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-4 pb-2 border-b-2 border-blue-900">
            📍 Información de Ubicación
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Provincia <span className="text-red-600">*</span>
              </label>
              <select
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded focus:border-blue-900"
              >
                <option value="">Seleccionar</option>
                <option value="Pichincha">Pichincha</option>
                <option value="Guayas">Guayas</option>
                <option value="Azuay">Azuay</option>
                <option value="Tungurahua">Tungurahua</option>
                <option value="Imbabura">Imbabura</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cantón <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="canton"
                value={formData.canton}
                onChange={handleChange}
                placeholder="Ej: Quito"
                maxLength={50}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Parroquia <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="parroquia"
                value={formData.parroquia}
                onChange={handleChange}
                placeholder="Ej: Centro Histórico"
                maxLength={50}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Calle Principal <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="calle_principal"
                value={formData.calle_principal}
                onChange={handleChange}
                placeholder="Ej: Avenida 10 de Agosto"
                maxLength={50}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Intersección <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="interseccion"
                value={formData.interseccion}
                onChange={handleChange}
                placeholder="Ej: Calle Mejía"
                maxLength={50}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Ej: 456"
                maxLength={10}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Referencia
              </label>
              <Input
                type="text"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
                placeholder="Ej: Frente a parque central"
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Código Postal
              </label>
              <Input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
                placeholder="Ej: 170150"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN AUTORIDAD */}
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-4 pb-2 border-b-2 border-blue-900">
            👥 Datos de la Máxima Autoridad
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="autoridad_nombre"
                value={formData.autoridad_nombre}
                onChange={handleChange}
                placeholder="Ej: Juan García Pérez"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cargo <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="autoridad_cargo"
                value={formData.autoridad_cargo}
                onChange={handleChange}
                placeholder="Ej: Ministro"
                maxLength={100}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cédula de Ciudadanía <span className="text-red-600">*</span>
            </label>
            <Input
              type="text"
              name="autoridad_cedula"
              value={formData.autoridad_cedula}
              onChange={handleChange}
              placeholder="Ej: 1718502145"
              maxLength={10}
              required
            />
          </div>
        </div>

        {/* SECCIÓN REPRESENTANTE */}
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-4 pb-2 border-b-2 border-blue-900">
            🏛️ Datos del Representante Legal
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="representante_nombre"
                value={formData.representante_nombre}
                onChange={handleChange}
                placeholder="Ej: María Rodríguez López"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cédula de Ciudadanía <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="representante_cedula"
                value={formData.representante_cedula}
                onChange={handleChange}
                placeholder="Ej: 1725634891"
                maxLength={10}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 rounded transition-all disabled:opacity-60"
          >
            {loading ? '⏳ Guardando...' : '💾 Guardar Dirección y Autoridad'}
          </Button>
          <Button
            type="button"
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded"
            onClick={() => {
              setFormData({
                provincia: '',
                canton: '',
                parroquia: '',
                calle_principal: '',
                interseccion: '',
                numero: '',
                referencia: '',
                codigo_postal: '',
                autoridad_nombre: '',
                autoridad_cargo: '',
                autoridad_cedula: '',
                representante_nombre: '',
                representante_cedula: ''
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
