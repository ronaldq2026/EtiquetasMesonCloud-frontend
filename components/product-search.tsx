'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/product';

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
  selectedProduct: Product | null
  onProductSelect: (p: Product) => void
}

function mapOfertaToProduct(oferta: ProductoPOSDPOFE, excel: ExcelItem): Product {

  console.log("OFERTA RAW", oferta)

  const precioNormal = oferta.precioNormal ?? 0;
  const precioOferta = oferta.precioOferta ?? null;
    
  const fechaFin = oferta.validoHasta ?? '';

  return {

    id: oferta.sku,

    codigo: oferta.sku,
    
	codigoBarras: oferta.ean13 ?? '',

    nombre: excel.descripcion ?? oferta.descripcion ?? '',
    descripcion: excel.descripcion ?? oferta.descripcion ?? '',

    dosage: '',
    batch: '',

    expiryDate: fechaFin,

    manufacturer: '',

    precioUnitario: precioNormal,
    precioOferta: precioOferta,
    precio: precioOferta ?? precioNormal,

    stock: 0,

    categoria: '',
    laboratorio: oferta.marca ?? '',

    oferta: {
      precioOferta: precioOferta ?? precioNormal,
      descuentoPorcentaje: oferta.descuentoPct ?? 0,
      vigenciaInicio: oferta.vigenciaInicio || '',
      vigenciaFin: fechaFin,
      tipoOferta: '1'
    }

  }
}

export function ProductSearch({ onProductSelect, selectedProduct }: ProductSearchProps) {

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<ExcelItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const term = query.trim();

    if (!term) {
      setItems([]);
      return;
    }

    const timeout = setTimeout(async () => {

      try {

        setLoading(true);
        const data = await searchExcel(term);

        setItems(data ?? []);

      } catch (err: any) {

        setError(err?.message || 'Error buscando Excel');

      } finally {
        setLoading(false);
      }

    }, 300);

    return () => clearTimeout(timeout);

  }, [query]);

  async function handleSelectExcelItem(it: ExcelItem) {

    try {

      setLoading(true);

      const resp = await enrichFromDPOFE(it.sku);

      if (!resp?.producto) {
        setError('Producto no encontrado en POSDPOFE');
        return;
      }

      const product = mapOfertaToProduct(resp.producto, it);

      onProductSelect(product);

    } catch (e: any) {

      setError(e?.message || 'Error validando producto');

    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>

      <CardHeader>
        <CardTitle>Seleccionar Producto</CardTitle>
        <CardDescription>
          Busca dentro del Excel cargado
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        <ExcelUploader userName="Ronald Quiroga" />

        <div className="relative">

          {loading
            ? <Loader2 className="absolute left-3 top-3 h-4 w-4 animate-spin" />
            : <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          }

          <Input
            placeholder="Buscar SKU o descripción..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />

        </div>

        {error && (
          <div className="text-red-600 text-sm flex gap-2 items-center">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <div className="max-h-80 overflow-y-auto space-y-2">

          {items.map((it) => (

            <Button
              key={it.sku}
              variant={selectedProduct?.codigo === it.sku ? 'default' : 'outline'}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleSelectExcelItem(it)}
            >

              <div>

                <div className="font-semibold text-sm">
                  {it.descripcion}
                </div>

                <div className="text-xs text-gray-500">
                  SKU: {it.sku}
                </div>

              </div>

            </Button>

          ))}

        </div>

      </CardContent>

    </Card>
  );
}