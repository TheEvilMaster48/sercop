'use client';

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BeneficiarioData {
  cedula_ruc: string;
  nombre_apellido: string;
  correo_electronico: string;
  telefono: string;
  razon_social: string;
  provincia: string;
}

interface ExistingBeneficiario extends BeneficiarioData {
  id: number;
}

export function ModuleFacilitador() {
  const [beneficiarios, setBeneficiarios] = useState<ExistingBeneficiario[]>([]);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<ExistingBeneficiario | null>(null);
  const [formData, setFormData] = useState<BeneficiarioData>({
    cedula_ruc: '',
    nombre_apellido: '',
    correo_electronico: '',
    telefono: '',
    razon_social: '',
    provincia: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load beneficiarios on mount
  React.useEffect(() => {
    loadBeneficiarios();
  }, []);

  const loadBeneficiarios = async () => {
    try {
      const response = await fetch('/api/beneficiarios');
      if (response.ok) {
        const data = await response.json();
        setBeneficiarios(data);
      }
    } catch (error) {
      console.error('Error loading beneficiarios:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      
      if (selectedBeneficiario) {
        formDataToSend.append('beneficiario_id', selectedBeneficiario.id.toString());
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Autocomplete form fields with extracted data
        if (data.extracted_data) {
          setFormData(prev => ({
            ...prev,
            ...data.extracted_data,
          }));
        }

        setMessage('✓ Archivo procesado exitosamente. Campos completados automáticamente.');
      } else {
        setMessage('✗ Error al procesar el archivo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('✗ Error al cargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const method = selectedBeneficiario ? 'PUT' : 'POST';
      const url = selectedBeneficiario 
        ? `/api/beneficiarios/${selectedBeneficiario.id}`
        : '/api/beneficiarios';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('✓ Datos guardados exitosamente');
        setFormData({
          cedula_ruc: '',
          nombre_apellido: '',
          correo_electronico: '',
          telefono: '',
          razon_social: '',
          provincia: '',
        });
        setSelectedBeneficiario(null);
        await loadBeneficiarios();
      } else {
        setMessage('✗ Error al guardar los datos');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('✗ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBeneficiario = (ben: ExistingBeneficiario) => {
    setSelectedBeneficiario(ben);
    setFormData({
      cedula_ruc: ben.cedula_ruc,
      nombre_apellido: ben.nombre_apellido,
      correo_electronico: ben.correo_electronico,
      telefono: ben.telefono,
      razon_social: ben.razon_social,
      provincia: ben.provincia,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Module Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#003366]">Módulo Facilitador de la Contratación Pública</h1>
          <p className="text-gray-600 mt-2">Registro y carga de datos de beneficiarios</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('✓') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="nuevo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border-b border-gray-200 rounded-none">
            <TabsTrigger value="nuevo" className="data-[state=active]:bg-[#003366] data-[state=active]:text-white rounded-none">
              Nuevo Beneficiario
            </TabsTrigger>
            <TabsTrigger value="existente" className="data-[state=active]:bg-[#003366] data-[state=active]:text-white rounded-none">
              Beneficiario Existente
            </TabsTrigger>
          </TabsList>

          {/* NUEVO BENEFICIARIO TAB */}
          <TabsContent value="nuevo" className="mt-6">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Cedula/RUC */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cédula / RUC <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="cedula_ruc"
                      value={formData.cedula_ruc}
                      onChange={handleInputChange}
                      placeholder="Ej: 1718502145"
                      maxLength="13"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                    />
                  </div>

                  {/* Nombre/Apellido */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre / Apellido <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre_apellido"
                      value={formData.nombre_apellido}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez García"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                    />
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo Electrónico <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="correo_electronico"
                      value={formData.correo_electronico}
                      onChange={handleInputChange}
                      placeholder="Ej: correo@email.com"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Ej: +593987654321"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                    />
                  </div>

                  {/* Razón Social */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Razón Social (Opcional)
                    </label>
                    <input
                      type="text"
                      name="razon_social"
                      value={formData.razon_social}
                      onChange={handleInputChange}
                      placeholder="Ej: Constructora Andina S.A."
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                    />
                  </div>

                  {/* Provincia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Provincia <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                    >
                      <option value="">Seleccionar provincia</option>
                      <option value="Pichincha">Pichincha</option>
                      <option value="Guayas">Guayas</option>
                      <option value="Azuay">Azuay</option>
                      <option value="Tungurahua">Tungurahua</option>
                      <option value="Imbabura">Imbabura</option>
                    </select>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.xlsx,.xls,.txt,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="px-6 py-2 bg-[#FFCC00] text-[#003366] rounded font-semibold hover:bg-yellow-400 disabled:opacity-50"
                  >
                    📎 {loading ? 'Cargando...' : 'Subir Archivo (PDF, Excel, Txt)'}
                  </button>
                  <p className="text-gray-500 text-sm mt-2">Los datos se completarán automáticamente</p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#003366] text-white py-3 rounded font-semibold hover:bg-[#002244] disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : '💾 Guardar Beneficiario'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setFormData({
                        cedula_ruc: '',
                        nombre_apellido: '',
                        correo_electronico: '',
                        telefono: '',
                        razon_social: '',
                        provincia: '',
                      });
                      setMessage('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-800 py-3 rounded font-semibold hover:bg-gray-400"
                  >
                    🔄 Limpiar Formulario
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* BENEFICIARIO EXISTENTE TAB */}
          <TabsContent value="existente" className="mt-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Beneficiarios List */}
              <Card className="col-span-1 p-6">
                <h3 className="font-semibold text-[#003366] mb-4">Beneficiarios Registrados</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {beneficiarios.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay beneficiarios registrados</p>
                  ) : (
                    beneficiarios.map(ben => (
                      <button
                        key={ben.id}
                        onClick={() => handleSelectBeneficiario(ben)}
                        className={`w-full text-left p-3 rounded transition ${
                          selectedBeneficiario?.id === ben.id
                            ? 'bg-[#003366] text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-sm font-semibold">{ben.nombre_apellido}</div>
                        <div className="text-xs opacity-75">{ben.cedula_ruc}</div>
                      </button>
                    ))
                  )}
                </div>
              </Card>

              {/* Edit Form */}
              <Card className="col-span-2 p-8">
                {selectedBeneficiario ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#003366]">Editar Beneficiario</h3>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cédula / RUC</label>
                        <input
                          type="text"
                          value={formData.cedula_ruc}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre / Apellido</label>
                        <input
                          type="text"
                          name="nombre_apellido"
                          value={formData.nombre_apellido}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Correo</label>
                        <input
                          type="email"
                          name="correo_electronico"
                          value={formData.correo_electronico}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#003366]"
                        />
                      </div>
                    </div>

                    {/* File Upload for Existing */}
                    <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.xlsx,.xls,.txt,.doc,.docx"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="px-6 py-2 bg-[#FFCC00] text-[#003366] rounded font-semibold hover:bg-yellow-400 disabled:opacity-50"
                      >
                        📎 {loading ? 'Cargando...' : 'Subir Archivo'}
                      </button>
                      <p className="text-gray-500 text-sm mt-2">Actualizar datos con nuevo documento</p>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[#003366] text-white py-3 rounded font-semibold hover:bg-[#002244] disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : '💾 Actualizar Beneficiario'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">Seleccione un beneficiario para editar</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Procesos de Contratación Section */}
        <div className="mt-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-6">Procesos de Contratación Activos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#003366] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Código</th>
                    <th className="px-4 py-3 text-left">Descripción</th>
                    <th className="px-4 py-3 text-left">Entidad</th>
                    <th className="px-4 py-3 text-right">Presupuesto</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">PROC-2025-001</td>
                    <td className="px-4 py-3">Compra de equipos de cómputo</td>
                    <td className="px-4 py-3">Ministerio de Educación</td>
                    <td className="px-4 py-3 text-right font-semibold">$45,000.00</td>
                    <td className="px-4 py-3"><span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Activo</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">PROC-2025-002</td>
                    <td className="px-4 py-3">Servicios de consultoría en infraestructura</td>
                    <td className="px-4 py-3">GAD Quito</td>
                    <td className="px-4 py-3 text-right font-semibold">$75,000.00</td>
                    <td className="px-4 py-3"><span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Activo</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">PROC-2025-003</td>
                    <td className="px-4 py-3">Suministro de materiales de limpieza</td>
                    <td className="px-4 py-3">Hospital Central</td>
                    <td className="px-4 py-3 text-right font-semibold">$12,000.00</td>
                    <td className="px-4 py-3"><span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Activo</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
