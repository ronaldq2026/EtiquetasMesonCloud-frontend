'use client';

import * as React from 'react';
import { Product } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export interface ProductsGridProps {
  title: string;
  products: Product[];
  description?: string;
  showOfferBadge?: boolean;

  /** NUEVO: habilita checkboxes por fila */
  selectable?: boolean;

  /** NUEVO: muestra “Seleccionar todo” en el header (solo si selectable=true) */
  showSelectAll?: boolean;

  /** NUEVO: callback opcional para exportar/accionar con la selección */
  onExport?: (selected: Product[]) => void;

  /** Opcional: define variantes de vista */
  variant?: 'with-offer' | 'no-offer' | 'default';
}

export function ProductsGrid({
  title,
  products,
  description,
  showOfferBadge = true,
  selectable = false,
  showSelectAll = false,
  onExport,
  variant = 'default',
}: ProductsGridProps) {
  // Manejamos selección solo si selectable === true
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const allSelected = selectable && products.length > 0 && selectedIds.length === products.length;

  const toggleAll = () => {
    if (!selectable) return;
    setSelectedIds((prev) =>
      prev.length === products.length
        ? []
        : products.map((p) => String((p as any).id ?? (p as any).codigo ?? (p as any).sku ?? '')),
    );
  };

  const toggleOne = (id: string) => {
    if (!selectable) return;
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleExport = () => {
    if (!onExport || !selectable) return;
    const selected = products.filter((p) =>
      selectedIds.includes(String((p as any).id ?? (p as any).codigo ?? (p as any).sku ?? '')),
    );
    onExport(selected);
  };

  const handlePrintSelected = () => {
    if (!selectable) return;
    if (selectedIds.length === 0) {
      alert('Selecciona al menos un producto');
      return;
    }
    alert(`Imprimiendo ${selectedIds.length} producto(s)...`);
    // TODO: integrar con tu flujo /api/labels/print (en lote)
  };

  const handlePrintAll = () => {
    alert(`Imprimiendo ${products.length} producto(s)...`);
    // TODO: integrar con tu flujo /api/labels/print (en lote)
  };

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No hay productos para mostrar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>

          {/* Acciones de cabecera */}
          <div className="flex items-center gap-2">
            {onExport ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                disabled={!selectable || selectedIds.length === 0}
                title={selectable ? `Exportar selección (${selectedIds.length})` : 'Exportar (deshabilitado)'}
              >
                Exportar{selectable ? ` (${selectedIds.length})` : ''}
              </Button>
            ) : null}

            <Button variant="outline" size="sm" onClick={handlePrintAll}>
              Imprimir Todo ({products.length})
            </Button>
          </div>
        </div>

        {/* Controles de selección (solo si selectable) */}
        {selectable && (
          <div className="flex items-center gap-3 text-sm">
            {showSelectAll && (
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                {allSelected ? 'Deseleccionar Todo' : 'Seleccionar Todo'} ({products.length})
              </label>
            )}
            <span className="text-gray-500">Seleccionados: {selectedIds.length}</span>
            <Button size="sm" onClick={handlePrintSelected} disabled={selectedIds.length === 0}>
              Imprimir Seleccionados
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead className="text-left text-gray-600">
            <tr>
              {selectable && <th className="w-10 px-2">Sel</th>}
              <th>SKU</th>
              <th>Nombre</th>
              <th>Talla</th>
              <th>Precio</th>
              {showOfferBadge && <th>Oferta</th>}
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const id = String((p as any).id ?? (p as any).codigo ?? (p as any).sku ?? '');
              const checked = selectable && selectedIds.includes(id);
              const precioNormal = (p as any).precioNormal ?? (p as any).precio;
              const precio = (p as any).precio ?? 0;
              const hasOffer = !!(p as any).oferta || (precioNormal && precio && precio < precioNormal);
              const descuentoPct = (p as any).oferta?.descuentoPorcentaje ?? null;

              return (
                <tr key={id} className="bg-white hover:bg-gray-50">
                  {selectable && (
                    <td className="px-2 align-top">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleOne(id)}
                        aria-label={`Seleccionar ${id}`}
                      />
                    </td>
                  )}

                  <td className="align-top">{(p as any).codigo ?? (p as any).sku ?? '-'}</td>

                  <td className="align-top">
                    {(p as any).nombre ?? '-'}
                    {p?.descripcion ? (
                      <div className="text-xs text-gray-500">{(p as any).descripcion}</div>
                    ) : null}
                  </td>

                  <td className="align-top">{(p as any).dosage ?? '-'}</td>

                  <td className="align-top">
                    {hasOffer ? (
                      <div className="space-y-0.5">
                        <div className="line-through text-gray-400 text-xs">
                          ${Number(precioNormal).toLocaleString('es-CL')}
                        </div>
                        <div className="font-semibold">
                          ${Number(precio).toLocaleString('es-CL')}
                        </div>
                      </div>
                    ) : (
                      <div className="font-semibold">
                        ${Number(precio).toLocaleString('es-CL')}
                      </div>
                    )}
                  </td>

                  {showOfferBadge && (
                    <td className="align-top">
                      {hasOffer ? (
                        <span className="inline-block rounded bg-red-100 text-red-700 px-2 py-0.5 text-xs">
                          -{descuentoPct ?? Math.max(0, Math.round((1 - precio / precioNormal) * 100))}%
                        </span>
                      ) : (
                        <span className="inline-block rounded bg-gray-100 text-gray-500 px-2 py-0.5 text-xs">
                          -
                        </span>
                      )}
                    </td>
                  )}

                  <td className="align-top">
                    <span className={Number((p as any).stock ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}>
                      {Number((p as any).stock ?? 0)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}