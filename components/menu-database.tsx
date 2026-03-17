'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/lib/product';
import { ProductsGrid } from './products-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function MenuDatabase() {

  const { products, isLoading: isProductsLoading } = useProducts();
  const [isLoading, setIsLoading] = useState(false);

  const handleReadDatabase = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };
  
const { productsWithOffer, productsWithoutOffer } = useMemo(() => {

	  const mappedProducts: Product[] = products.map((p: any, index: number) => {

		const precioUnitario = p.precio || 0;
		const precioOferta = null;

		return {
		  id: p.sku || String(index),
		  codigo: p.sku || '',
		  codigoBarras: p.sku || '',
		  nombre: p.descripcion || '',
		  descripcion: p.descripcion || '',
		  dosage: '',
		  batch: '',
		  expiryDate: '',
		  manufacturer: '',

		  precioUnitario: precioUnitario,
		  precioOferta: precioOferta,
		  precio: precioOferta ?? precioUnitario,

		  stock: 0,
		  categoria: '',
		  laboratorio: '',

		  oferta: undefined,
		  meson: undefined
		};

	  });

	  return {
		productsWithOffer: mappedProducts,
		productsWithoutOffer: []
	  };

	}, [products]);
  return (
    <div className="space-y-6">

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Lectura de Base de Datos
          </CardTitle>
          <CardDescription>
            Lectura desde POS
          </CardDescription>
        </CardHeader>

        <CardContent>

          <p className="text-sm text-gray-600 mb-3">
            Se cargaron <strong>{products.length}</strong> productos
          </p>

          <Button
            onClick={handleReadDatabase}
            disabled={isLoading || isProductsLoading}
          >
            {(isLoading || isProductsLoading) ? 'Leyendo...' : 'Actualizar'}
          </Button>

        </CardContent>
      </Card>

      <ProductsGrid
        products={productsWithOffer}
        title="Productos CON Oferta"
        description={`${productsWithOffer.length} productos`}
        showOfferBadge={true}
      />

      {productsWithoutOffer.length > 0 && (
        <ProductsGrid
          products={productsWithoutOffer}
          title="Productos SIN Oferta"
          description={`${productsWithoutOffer.length} productos`}
          showOfferBadge={false}
        />
      )}

    </div>
  );
}