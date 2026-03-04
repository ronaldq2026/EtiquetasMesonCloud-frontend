// components/products-grid.tsx
'use client';
import { useState, useMemo } from 'react';
import { Product } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductsGridProps {
  products: Product[];                 // (existente)
  title: string;
  description?: string;
  showOfferBadge?: boolean;            // (existente)
  // --- NUEVO ---
  selectable?: boolean;                // default: true
  showSelectAll?: boolean;             // default: true
  variant?: 'with-offer' | 'without-offer';
  onExport?: (rows: Product[]) => void;
}

export function ProductsGrid({
  products,
  title,
  description,
  showOfferBadge = true,
  // nuevos:
  selectable = true,
  showSelectAll = true,
  variant = 'with-offer',
  onExport,
}: ProductsGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const allSelected = selectedIds.size === products.length && products.length > 0;

  const toggleSelect = (id: string | number) => {
    if (!selectable) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (!selectable) return;
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(products.map((p) => p.id ?? '')));
  };

  const selectedRows = useMemo(
    () => products.filter((p) => selectedIds.has(p.id ?? '')),
    [products, selectedIds]
  );

  // Estilos por variante
  const rowBg = variant === 'with-offer' ? '' : 'bg-red-50/50';
  const textMain = variant === 'with-offer' ? 'text-gray-900' : 'text-red-700 font-semibold';
  const textSec  = variant === 'with-offer' ? 'text-gray-700' : 'text-red-700 font-semibold';
  const titleCls = variant === 'with-offer' ? 'text-gray-900' : 'text-red-700 font-semibold';

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={titleCls}>{title}</CardTitle>
          {!!description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">No hay productos para mostrar</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className={titleCls}>{title}</CardTitle>
          {!!description && <CardDescription>{description}</CardDescription>}
        </div>

        {/* Toolbar (selección o export) */}
        <div className="flex items-center gap-2">
          {selectable && showSelectAll && (
            <>
              <Button variant="secondary" onClick={selectAll}>
                {allSelected ? 'Deseleccionar Todo' : 'Seleccionar Todo'} ({products.length})
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  if (selectedIds.size === 0) {
                    alert('Selecciona al menos un producto');
                    return;
                  }
                  alert(`Imprimiendo ${selectedIds.size} producto(s)...`);
                  // TODO: lógica real de impresión por selección
                }}
              >
                Imprimir Seleccionados ({selectedIds.size})
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  alert(`Imprimiendo ${products.length} producto(s)...`);
                  // TODO: lógica real de impresión de todos
                }}
              >
                Imprimir Todos ({products.length})
              </Button>
            </>
          )}

          {/* Modo SIN ofertas: sin selección -> botón Exportar CSV si onExport está definido */}
          {!showSelectAll && typeof onExport === 'function' && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onExport(products)}
            >
              Exportar CSV
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="w-8"></th>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Talla</th>
                <th>Precio</th>
                {showOfferBadge && <th>Oferta</th>}
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const id = product.id ?? '';
                return (
                  <tr key={id} className={`border-t ${rowBg}`}>
                    <td className="align-top pt-3">
                      {selectable ? (
                        <Checkbox
                          checked={selectedIds.has(id)}
                          onCheckedChange={() => toggleSelect(id)}
                          className="w-4 h-4 rounded"
                        />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </td>

                    <td className={`font-mono align-top pt-3 ${textMain}`}>{product.codigo}</td>

                    <td className={`max-w-[420px] align-top pt-3 ${textMain}`}>
                      <div className="truncate">{product.nombre}</div>
                      {!!product.descripcion && (
                        <div className="text-xs mt-0.5 line-clamp-2">{product.descripcion}</div>
                      )}
                    </td>

                    <td className={`align-top pt-3 ${textMain}`}>{product.dosage ?? '-'}</td>

                    <td className={`align-top pt-3 ${textSec}`}>
                      {product.oferta ? (
                        <>
                          <s className="text-gray-400">
                            ${product.precioNormal.toLocaleString('es-CL')}
                          </s>{' '}
                          <b className="text-gray-900">
                            ${product.precio.toLocaleString('es-CL')}
                          </b>
                        </>
                      ) : (
                        `$${product.precio.toLocaleString('es-CL')}`
                      )}
                    </td>

                    {showOfferBadge && (
                      <td className={`align-top pt-3 ${textMain}`}>
                        {product.oferta ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            -{product.oferta.descuentoPorcentaje}%
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    )}

                    <td className={`align-top pt-3 ${textMain}`}>
                      {typeof product.stock === 'number' ? product.stock : '—'}
                    </td>

                    <td className="align-top pt-3">
                      {variant === 'with-offer' ? (
                        <button
                          className="text-indigo-600 hover:underline"
                          onClick={() => alert(`Imprimir SKU ${product.codigo}`)}
                        >
                          Imprimir
                        </button>
                      ) : (
                        <span className="text-red-600 text-xs font-semibold">Sin oferta</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pie con info de selección (solo si hay selección) */}
        {selectable && (
          <div className="px-1 pt-2 text-xs text-gray-500">
            Seleccionados: <b>{selectedIds.size}</b> / {products.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
``