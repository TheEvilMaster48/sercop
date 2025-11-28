'use client';

export function FacilitadorHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Facilitador de Contratación Pública</h1>
            <p className="text-blue-100 mt-2">Sistema de Gestión Automatizado de SERCOP</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Modulo v1.0</p>
            <p className="text-xs text-blue-200 mt-1">{new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
