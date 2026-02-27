// components/product-search.tsx (fragmento principal)
'use client';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Loader2, AlertTriangle } from 'lucide-react';
import {
  searchExcel,
  enrichFromDPOFE,
  type ExcelItem,
  type ProductoPOSDPOFE,
} from '@/lib/api';
import { ExcelUploader } from '@/components/excel-uploader';

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  selectedProduct?: Product;
}

function mapOfertaToProduct(oferta: ProductoPOSDPOFE): Product {
  const tieneOferta = typeof oferta.precioOferta === 'number' && !Number.isNaN(oferta.precioOferta);
  return {
    id: oferta.sku,
    codigo: oferta.sku,
    codigoBarras: '',
    nombre: oferta.descripcionPromo,
    descripcion: oferta.descripcionPromo,
    dosage: '',
    batch: '',
    expiryDate: oferta.vigenciaFin ?? '',
    manufacturer: '',
    precioNormal: oferta.precioNormal ?? 0,
    precio: tieneOferta ? (oferta.precioOferta as number) : (oferta.precioNormal ?? 0),
    stock: 0,
    categoria: '',
    laboratorio: '',
    ...(tieneOferta && {
      oferta: {
        precioOferta: oferta.precioOferta as number,
        descuentoPorcentaje: oferta.descuentoPct ?? 0,
        vigenciaFin: oferta.vigenciaFin ?? '',
        vigenciaInicio: oferta.vigenciaInicio ?? '',
        tipoOferta: '1',
      },
    }),
  };
}

export function ProductSearch({ onProductSelect, selectedProduct }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ExcelItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Buscar SOLO en Excel (debounce)
  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setItems([]);
      setError(null);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchExcel(term);
        setItems(data ?? []);
      } catch (err: any) {
        console.error('[ProductSearch] Error buscando en Excel:', err);
        setError(err?.message || 'Error buscando Excel');
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  async function handleSelectExcelItem(it: ExcelItem) {
    try {
      setLoading(true);
      setError(null);
      const resp = await enrichFromDPOFE(it.sku);
      if (!resp.foundInExcel) {
        setError('El SKU no está en el Excel cargado.');
        return;
      }
      if (!resp.foundInDPOFE || !resp.producto) {
        setError('El SKU no existe en POSDPOFE (no hay precios/ofertas).');
        return;
      }
      const product = mapOfertaToProduct(resp.producto);
      onProductSelect(product);
    } catch (e: any) {
      console.error('[ProductSearch] Enrich error:', e);
      setError(e?.message || 'Error validando en POSDPOFE');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Seleccionar Producto (Excel → POSDPOFE)</CardTitle>
        <CardDescription>
          Busca solo dentro del Excel cargado. Al seleccionar, validamos el producto en POSDPOFE para obtener precios.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Uploader Excel */}
        <div className="flex items-center gap-2">
          <ExcelUploader userName="Ronald Quiroga" />
        </div>

        {/* Buscador */}
        <div className="relative">
          {loading ? (
            <Loader2 className="absolute left-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          )}
          <Input
            placeholder="Buscar (por SKU o Descripción del Excel)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Lista de resultados: SOLO Ítems de Excel */}
        <div className="max-h-80 overflow-y-auto space-y-2">
          {loading && items.length === 0 ? (
            <div className="text-center py-6">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Buscando en Excel…</p>
            </div>
          ) : items.length > 0 ? (
            items.map((it) => (
              <Button
                key={it.sku}
                variant={selectedProduct?.codigo === it.sku ? 'default' : 'outline'}
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleSelectExcelItem(it)}
              >
                <div className="w-full">
                  <div className="font-semibold text-sm">{it.descripcion || '(sin descripción)'}</div>
                  <div className="text-xs text-gray-500">SKU: {it.sku}</div>
                </div>
              </Button>
            ))
          ) : query.trim() ? (
            <div className="text-center py-6 text-sm text-gray-500">
              No se encontraron coincidencias en el Excel para “{query}”.
            </div>
          ) : (
            <div className="text-xs text-gray-400">Escribe para buscar en el Excel cargado…</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}