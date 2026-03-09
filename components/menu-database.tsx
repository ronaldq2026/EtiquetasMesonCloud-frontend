// components/menu-database.tsx
'use client';

import { useState, useMemo } from 'react';
import { mockProducts } from '@/lib/mock-data';
import { simulatedDatabaseProducts } from '@/lib/mock-menu-data';
import { ProductsGrid } from './products-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function MenuDatabase() {
  const [isLoading, setIsLoading] = useState(false);

  // Simula la lectura del “Archivo Centralizado”
  const handleReadCentralFile = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
  };

  // Cruce SKUs del archivo centralizado con mockProducts -> con/sin oferta
  const { productsWithOffer, productsWithoutOffer } = useMemo(() => {
    const setCentral = new Set(simulatedDatabaseProducts);
    const withOffer = mockProducts.filter(p => setCentral.has(p.codigo) && p.oferta);
    const withoutOffer = mockProducts.filter(p => setCentral.has(p.codigo) && !p.oferta);
    return { productsWithOffer: withOffer, productsWithoutOffer: withoutOffer };
  }, []);

  // Exportar CSV para "SIN ofertas"
  const exportCsv = (rows: typeof productsWithoutOffer) => {
    const headers = ['SKU', 'Nombre', 'Talla', 'Precio', 'Stock'];
    const lines = rows.map((r) => [
      r.codigo ?? '',
      (r.nombre ?? '').replace(/\n/g, ' '),
      r.dosage ?? '',
      typeof r.precio === 'number' ? r.precio : '',
      typeof r.stock === 'number' ? r.stock : '',
    ]);

    const csv = [headers, ...lines]
      .map(cols =>
        cols.map(v => {
          const s = String(v ?? '');
          return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        }).join(';')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sin-ofertas-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado: Archivo Centralizado */}
      <Card>
        <CardHeader>
          <CardTitle>Lectura de Archivo Centralizado</CardTitle>
          <CardDescription>
            Simulación de lectura de SKUs desde un archivo centralizado (respaldado por tabla Oracle).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button onClick={handleReadCentralFile} disabled={isLoading}>
              {isLoading ? 'Leyendo…' : 'Leer Archivo Centralizado'}
            </Button>
            <span className="text-sm text-gray-600">
              Se leyeron <b>{simulatedDatabaseProducts.length}</b> productos del archivo centralizado.
            </span>
          </div>
          <div className="mt-3 text-xs bg-gray-50 border rounded p-2 max-h-32 overflow-auto">
            <div className="font-medium mb-1">SKUs leídos:</div>
            <div className="grid grid-cols-3 gap-2">
              {simulatedDatabaseProducts.map((sku) => (
                <code key={sku} className="text-gray-700">
                  {sku}
                </code>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CON Ofertas: imprimibles y seleccionables */}
      <ProductsGrid
        title={`Productos CON Ofertas (${productsWithOffer.length})`}
        products={productsWithOffer}
        selectable        // ← checkboxes ON
        showSelectAll     // ← “Seleccionar Todo” visible
        variant="with-offer"
        onExport={undefined}  // no export aquí
      />

      {/* SIN Ofertas: NO imprimibles → sin checkbox y con botón Exportar CSV */}	  
	  <ProductsGrid
		title={`Productos SIN Ofertas (${productsWithoutOffer.length})`}
		products={productsWithoutOffer}
		selectable={false}
		showSelectAll={false}
		variant="no-offer"          // ✅ CORRECTO
		onExport={(rows) => exportCsv(rows)}
	  />
	  
    </div>
  );
}
``