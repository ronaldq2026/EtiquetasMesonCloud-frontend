'use client';

import { useState } from 'react';
import { Product } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Printer, Download } from 'lucide-react';

interface ProductsGridProps {
  products: Product[];
  title: string;
  description?: string;
  showOfferBadge?: boolean;
}

export function ProductsGrid({
  products,
  title,
  description,
  showOfferBadge = true,
}: ProductsGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const toggleSelect = (id: string | number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map(p => p.id || '')));
    }
  };

  const handlePrintSelected = () => {
    if (selectedIds.size === 0) {
      alert('Selecciona al menos un producto');
      return;
    }
    alert(`Imprimiendo ${selectedIds.size} producto(s)...`);
    // TODO: Implementar lógica de impresión
  };

  const handlePrintAll = () => {
    alert(`Imprimiendo ${products.length} producto(s)...`);
    // TODO: Implementar lógica de impresión
  };

  if (products.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No hay productos para mostrar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Acciones */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="text-xs"
              >
                {selectedIds.size === products.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'} ({products.length})
              </Button>
              
              <Button
                size="sm"
                onClick={handlePrintSelected}
                disabled={selectedIds.size === 0}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs"
              >
                <Printer className="h-3 w-3" />
                Imprimir Seleccionados ({selectedIds.size})
              </Button>

              <Button
                size="sm"
                onClick={handlePrintAll}
                variant="default"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-xs"
              >
                <Printer className="h-3 w-3" />
                Imprimir Todo ({products.length})
              </Button>
            </div>

            {/* Grid de productos */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="w-12 px-4 py-2 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === products.length && products.length > 0}
                          onChange={selectAll}
                          className="w-4 h-4 rounded"
                        />
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">SKU</th>
                      <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                      <th className="px-4 py-2 text-left font-semibold">Talla</th>
                      <th className="px-4 py-2 text-right font-semibold">Precio</th>
                      {showOfferBadge && <th className="px-4 py-2 text-left font-semibold">Oferta</th>}
                      <th className="px-4 py-2 text-center font-semibold">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 ${
                          selectedIds.has(product.id || '') ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="w-12 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(product.id || '')}
                            onChange={() => toggleSelect(product.id || '')}
                            className="w-4 h-4 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{product.codigo}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{product.nombre}</div>
                          <div className="text-xs text-gray-500">{product.descripcion}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">{product.dosage}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {product.precioOferta && product.precioOferta > 0 ? (
                            <div className="space-y-0.5">
                              <div className="line-through text-gray-400 text-xs">
                                ${product.precioUnitario.toLocaleString('es-CL')}
                              </div>
                              <div className="text-red-600">
                                ${product.precioOferta.toLocaleString('es-CL')}
                              </div>
                            </div>
                          ) : (
                            `$${product.precioUnitario.toLocaleString('es-CL')}`
                          )}
                        </td>
                        {showOfferBadge && (
                          <td className="px-4 py-3">
                            {product.oferta ? (
                              <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                                -{product.oferta.descuentoPorcentaje}%
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
