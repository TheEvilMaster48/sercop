'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { SercopSidebar } from '@/components/sercop-sidebar';
import { DatosGeneralesForm } from '@/components/datos-generales-form';
import { DireccionForm } from '@/components/direccion-form';
import { DatosDelegadoForm } from '@/components/datos-delegado-form';

export default function Page() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}

function HomeContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('datos-generales');

  const renderContent = () => {
    switch (activeTab) {
      case 'datos-generales':
        return <DatosGeneralesForm />;
      case 'direccion':
        return <DireccionForm />;
      case 'datos-delegado':
        return <DatosDelegadoForm />;
      case 'procesos':
        return (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Procesos de Contratación</h2>
            <p className="text-gray-600">Sección en desarrollo...</p>
          </div>
        );
      case 'reportes':
        return (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Reportes</h2>
            <p className="text-gray-600">Sección en desarrollo...</p>
          </div>
        );
      case 'configuracion':
        return (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Configuración del Sistema</h2>
            <p className="text-gray-600">Sección en desarrollo...</p>
          </div>
        );
      default:
        return <DatosGeneralesForm />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-white border-b-4 border-blue-900 shadow-md">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl font-bold">
              <span className="text-blue-900">SERC</span>
              <span className="text-yellow-400">OP</span>
            </span>
            <div className="border-l-2 border-gray-300 pl-3">
              <p className="text-sm font-bold text-blue-900">Módulo Facilitador</p>
              <p className="text-xs text-gray-600">Contratación Pública</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right text-sm">
              <p className="text-gray-600">Conectado como:</p>
              <p className="font-semibold text-gray-800">{user?.email}</p>
            </div>

            <Button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex gap-6 p-8 max-w-7xl mx-auto">

        <aside className="w-64">
          <SercopSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        <main className="flex-1">
          {renderContent()}
        </main>

      </div>
    </main>
  );
}
