'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Proceso {
  id: number;
  numero_proceso: string;
  titulo: string;
  estado: string;
  presupuesto: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export function ProcesosList() {
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcesos();
  }, []);

  const fetchProcesos = async () => {
    try {
      const res = await fetch('/api/procesos');
      if (res.ok) {
        const data = await res.json();
        setProcesos(data);
      }
    } catch (error) {
      console.error('[v0] Error fetching procesos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estadoMap: Record<string, { label: string; variant: any }> = {
      'en_progreso': { label: 'En Progreso', variant: 'default' },
      'completado': { label: 'Completado', variant: 'secondary' },
      'pendiente': { label: 'Pendiente', variant: 'outline' }
    };
    return estadoMap[estado] || { label: estado, variant: 'default' };
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando procesos...</div>;
  }

  return (
    <Card className="border border-gray-200 shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Procesos de Contratación Activos</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-bold text-gray-700">Proceso</TableHead>
                <TableHead className="font-bold text-gray-700">Título</TableHead>
                <TableHead className="font-bold text-gray-700">Presupuesto</TableHead>
                <TableHead className="font-bold text-gray-700">Estado</TableHead>
                <TableHead className="font-bold text-gray-700">Fechas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procesos.map((proceso) => {
                const { label, variant } = getEstadoBadge(proceso.estado);
                return (
                  <TableRow key={proceso.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-blue-600">{proceso.numero_proceso}</TableCell>
                    <TableCell className="text-gray-900">{proceso.titulo}</TableCell>
                    <TableCell className="text-gray-900">${proceso.presupuesto?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(proceso.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(proceso.fecha_fin).toLocaleDateString('es-ES')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
