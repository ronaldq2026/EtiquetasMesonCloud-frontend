'use client';

import { useState } from 'react';
import { useSearchProducts } from '@/hooks/useProducts';
import { Product } from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Search, Loader2 } from 'lucide-react';

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  selectedProduct?: Product;
}

function mapApiProductToProduct(product: any): Product {
  const sku = product.sku;

  const precioNormal = product.precioUnitario ?? product.precioNormal ?? 0;
  const precioOferta = product.precioOferta ?? null;

  return {
    id: sku,
    codigo: sku,
    codigoBarras: product.ean13 || sku,

    nombre: product.descripcion || '',
    descripcion: product.descripcion || '',

    dosage: '',
    batch: sku,
    expiryDate: product.vigenciaFin || '',
    manufacturer: '',

    precioUnitario: precioNormal,
    precioOferta: precioOferta,
    precio: precioOferta || precioNormal,

    stock: 0,
    categoria: '',
    laboratorio: product.marca || '',

    ...(precioOferta && {
      oferta: {
        precioOferta: precioOferta,
        vigenciaInicio: product.vigenciaInicio || '',
        vigenciaFin: product.vigenciaFin || '',
        descuentoPorcentaje: product.descuentoPct || 0,
        tipoOferta: '1',
      },
    }),
  };
}

export function ProductSearch({ onProductSelect, selectedProduct }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingSku, setLoadingSku] = useState<string | null>(null);

  const { results, isLoading } = useSearchProducts(searchQuery);

  async function handleSelect(product: any) {
    try {
      setLoadingSku(product.sku);

      const resp = await apiClient.enrichProductFromDPOFE(product.sku);

      if (resp?.producto) {
        const enriched = mapApiProductToProduct(resp.producto);
        onProductSelect(enriched);
      } else {
        const fallback = mapApiProductToProduct(product);
        onProductSelect(fallback);
      }

    } catch (err) {
      console.error('Error consultando POSDPOFE', err);

      const fallback = mapApiProductToProduct(product);
      onProductSelect(fallback);

    } finally {
      setLoadingSku(null);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Seleccionar Producto</CardTitle>
        <CardDescription>
          Busca productos del Excel y obtiene precios desde POSDPOFE
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* BUSCADOR */}

        <div className="relative">
          {isLoading ? (
            <Loader2 className="absolute left-3 top-3 h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          )}

          <Input
            placeholder="Buscar producto en Excel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* RESULTADOS */}

        <div className="max-h-80 overflow-y-auto space-y-2">

          {!searchQuery.trim() && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Escribe para buscar en el Excel cargado
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Buscando en Excel...</p>
            </div>
          )}

          {!isLoading && results?.length > 0 && results.map((item: any) => {

            const selected = selectedProduct?.codigo === item.sku;

            return (
              <Button
                key={item.sku}
                variant={selected ? 'default' : 'outline'}
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleSelect(item)}
              >

                <div className="w-full">

                  <div className="font-semibold text-sm">
                    {item.descripcion}
                  </div>

                  <div className="text-xs text-gray-500">
                    SKU: {item.sku}
                  </div>

                  {loadingSku === item.sku && (
                    <div className="text-xs text-blue-600 mt-1">
                      consultando POSDPOFE...
                    </div>
                  )}

                </div>

              </Button>
            );

          })}

          {!isLoading && searchQuery && results?.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No se encontraron productos
            </div>
          )}

        </div>

        {/* PRODUCTO SELECCIONADO */}

        {selectedProduct && (
          <div className="border-t pt-4 mt-4 space-y-2 text-sm">

            <h4 className="font-semibold">Producto Seleccionado</h4>

            <div className="bg-blue-50 p-3 rounded-lg space-y-1">

              <p>
                <strong>SKU:</strong> {selectedProduct.codigo}
              </p>

              <p>
                <strong>Descripción:</strong> {selectedProduct.descripcion}
              </p>

              <p>
                <strong>Precio:</strong>{' '}
                ${selectedProduct.precioUnitario.toLocaleString('es-CL')}
              </p>

              {selectedProduct.precioOferta && (
                <p className="text-red-600 font-semibold">
                  Oferta: ${selectedProduct.precioOferta.toLocaleString('es-CL')}
                </p>
              )}

            </div>

          </div>
        )}

      </CardContent>
    </Card>
  );
}