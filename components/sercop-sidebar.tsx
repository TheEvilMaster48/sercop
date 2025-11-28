'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface SercopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SercopSidebar({ activeTab, onTabChange }: SercopSidebarProps) {
  const menuItems: MenuItem[] = [
    {
      id: 'datos-generales',
      label: 'Datos Generales',
      icon: '📋',
      description: 'RUC, Nombre, Logo'
    },
    {
      id: 'direccion',
      label: 'Dirección',
      icon: '📍',
      description: 'Ubicación y autoridades'
    },
    {
      id: 'datos-delegado',
      label: 'Datos Delegado',
      icon: '👤',
      description: 'Delegación de funciones'
    },
    {
      id: 'procesos',
      label: 'Procesos',
      icon: '📊',
      description: 'Contrataciones activas'
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: '📈',
      description: 'Documentos generados'
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: '⚙️',
      description: 'Ajustes del sistema'
    },
  ];

  return (
    <Card className="h-full bg-gradient-to-b from-blue-50 to-gray-50 rounded-lg border-0 shadow-md">
      <div className="p-6">
        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-6">
          Menú Principal
        </h3>
        
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5">{item.icon}</span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${activeTab === item.id ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${activeTab === item.id ? 'text-blue-100' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </div>
                {activeTab === item.id && (
                  <span className="text-lg">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
