'use client';

import React from 'react';

export function SercopHeader() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">
            <span className="text-white">SERC</span>
            <span className="text-yellow-400">OP</span>
          </div>
          <p className="text-sm text-blue-100">Sistema Oficial de Contratación Pública del Ecuador</p>
        </div>
      </div>
    </div>
  );
}
