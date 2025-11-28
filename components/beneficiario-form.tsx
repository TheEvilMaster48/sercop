'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  empresa: string;
  cargo: string;
  departamento: string;
}

export function BeneficiarioForm() {
  const [tab, setTab] = useState('nuevo');
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    correo: '',
    telefono: '',
    empresa: '',
    cargo: '',
    departamento: ''
  });

  const [datosExtraidos, setDatosExtraidos] = useState<any>(null);

  useEffect(() => {
    fetchBeneficiarios();
  }, []);

  const fetchBeneficiarios = async () => {
    try {
      const res = await fetch('/api/beneficiarios');
      const data = await res.json();
      setBeneficiarios(data);
    } catch (error) {
      console.error('[v0] Error fetching beneficiarios:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file || !selectedBeneficiario) {
      alert('Selecciona un archivo y un beneficiario');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('beneficiario_id', selectedBeneficiario.id.toString());

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await res.json();
      
      if (result.success) {
        setDatosExtraidos(result.datosExtraidos);
        // Autocompletar formulario con datos extraídos
        setFormData(prev => ({
          ...prev,
          nombre: result.datosExtraidos.nombre || prev.nombre,
          apellido: result.datosExtraidos.apellido || prev.apellido,
          cedula: result.datosExtraidos.cedula || prev.cedula,
          correo: result.datosExtraidos.correo || prev.correo,
          telefono: result.datosExtraidos.telefono || prev.telefono,
          empresa: result.datosExtraidos.empresa || prev.empresa,
          cargo: result.datosExtraidos.cargo || prev.cargo,
          departamento: result.datosExtraidos.departamento || prev.departamento,
        }));
        console.log('[v0] Datos extraídos y formulario actualizado');
      }
    } catch (error) {
      console.error('[v0] Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNuevo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/beneficiarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newBeneficiario = await res.json();
        setBeneficiarios([newBeneficiario, ...beneficiarios]);
        setFormData({
          nombre: '',
          apellido: '',
          cedula: '',
          correo: '',
          telefono: '',
          empresa: '',
          cargo: '',
          departamento: ''
        });
        setShowDialog(true);
        console.log('[v0] Beneficiario creado:', newBeneficiario);
      } else {
        alert('Error al crear beneficiario');
      }
    } catch (error) {
      console.error('[v0] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBeneficiario = (ben: Beneficiario) => {
    setSelectedBeneficiario(ben);
    setFormData({
      nombre: ben.nombre,
      apellido: ben.apellido,
      cedula: ben.cedula,
      correo: ben.correo,
      telefono: ben.telefono,
      empresa: ben.empresa,
      cargo: ben.cargo,
      departamento: ben.departamento
    });
    console.log('[v0] Beneficiario seleccionado:', ben);
  };

  return (
    <>
      <Card className="border border-gray-200 shadow-md">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full rounded-none border-b bg-gray-50 grid w-full grid-cols-2">
            <TabsTrigger value="nuevo" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              Nuevo Beneficiario
            </TabsTrigger>
            <TabsTrigger value="existente" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              Beneficiario Existente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nuevo" className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">Ingresa los datos del nuevo beneficiario. Los campos se pueden actualizar automáticamente al cargar un documento.</p>
            </div>

            <form onSubmit={handleSubmitNuevo} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre" className="text-gray-700 font-medium">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan"
                    required
                    className="mt-1 border border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="apellido" className="text-gray-700 font-medium">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Ej: Pérez"
                    required
                    className="mt-1 border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cedula" className="text-gray-700 font-medium">Cédula</Label>
                  <Input
                    id="cedula"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleInputChange}
                    placeholder="Ej: 1234567890"
                    required
                    className="mt-1 border border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="correo" className="text-gray-700 font-medium">Correo Electrónico</Label>
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleInputChange}
                    placeholder="ej@example.com"
                    required
                    className="mt-1 border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono" className="text-gray-700 font-medium">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+593987654321"
                    className="mt-1 border border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="empresa" className="text-gray-700 font-medium">Empresa</Label>
                  <Input
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    placeholder="Nombre empresa"
                    className="mt-1 border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo" className="text-gray-700 font-medium">Cargo</Label>
                  <Input
                    id="cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    placeholder="Ej: Director"
                    className="mt-1 border border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="departamento" className="text-gray-700 font-medium">Departamento</Label>
                  <Input
                    id="departamento"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    placeholder="Ej: Administrativo"
                    className="mt-1 border border-gray-300"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
              >
                {loading ? 'Guardando...' : 'Guardar Beneficiario'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="existente" className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">Selecciona un beneficiario existente. Al cargar un documento, los datos se actualizarán automáticamente.</p>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-700 font-medium">Seleccionar Beneficiario</Label>
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {beneficiarios.map((ben) => (
                  <div
                    key={ben.id}
                    onClick={() => handleSelectBeneficiario(ben)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedBeneficiario?.id === ben.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{ben.nombre} {ben.apellido}</p>
                    <p className="text-sm text-gray-600">Cédula: {ben.cedula}</p>
                    <p className="text-sm text-gray-600">{ben.correo}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedBeneficiario && (
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-gray-700 font-medium block">Cargar Documento</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full"
                    accept=".pdf,.xlsx,.xls,.txt,.csv"
                  />
                  <p className="text-sm text-gray-600 mt-2">PDF, Excel o TXT</p>
                </div>

                {file && (
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Archivo seleccionado: {file.name}</p>
                  </div>
                )}

                <Button
                  onClick={handleFileUpload}
                  disabled={loading || !file}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium h-10"
                >
                  {loading ? 'Procesando...' : 'Procesar y Cargar'}
                </Button>

                {datosExtraidos && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-green-900 mb-3">Datos Extraídos del Documento:</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-600">Nombre:</span> <span className="font-medium">{datosExtraidos.nombre}</span></div>
                      <div><span className="text-gray-600">Apellido:</span> <span className="font-medium">{datosExtraidos.apellido}</span></div>
                      <div><span className="text-gray-600">Cédula:</span> <span className="font-medium">{datosExtraidos.cedula}</span></div>
                      <div><span className="text-gray-600">Correo:</span> <span className="font-medium">{datosExtraidos.correo}</span></div>
                      <div><span className="text-gray-600">Teléfono:</span> <span className="font-medium">{datosExtraidos.telefono}</span></div>
                      <div><span className="text-gray-600">Empresa:</span> <span className="font-medium">{datosExtraidos.empresa}</span></div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-gray-700 font-medium">Datos del Beneficiario</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Nombre</Label>
                      <Input value={formData.nombre} disabled className="mt-1 bg-gray-100" />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Apellido</Label>
                      <Input value={formData.apellido} disabled className="mt-1 bg-gray-100" />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Cédula</Label>
                      <Input value={formData.cedula} disabled className="mt-1 bg-gray-100" />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Correo</Label>
                      <Input value={formData.correo} disabled className="mt-1 bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Beneficiario Registrado</AlertDialogTitle>
          <AlertDialogDescription>
            El beneficiario ha sido registrado exitosamente en el sistema.
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => setShowDialog(false)}>
            Continuar
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
