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

  // Simular lectura de BD
  const handleReadDatabase = async () => {
    setIsLoading(true);
    // Simular delay de lectura
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  // Parear BD con ofertas
  const { productsWithOffer, productsWithoutOffer } = useMemo(() => {
    const withOffer = mockProducts.filter(p => 
      simulatedDatabaseProducts.includes(p.codigo) && p.oferta
    );
    const withoutOffer = mockProducts.filter(p => 
      simulatedDatabaseProducts.includes(p.codigo) && !p.oferta
    );
    return { productsWithOffer: withOffer, productsWithoutOffer: withoutOffer };
  }, []);

  return (
    <div className="space-y-6">
      {/* Sección de simulación de BD */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Lectura de Base de Datos
          </CardTitle>
          <CardDescription>
            Simulación de lectura desde tabla de base de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Se leyeron <strong>{simulatedDatabaseProducts.length} productos</strong> de la tabla de base de datos.
            </p>
            <Button
              onClick={handleReadDatabase}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Leyendo BD...' : 'Leer Base de Datos'}
            </Button>
            <div className="bg-white p-3 rounded text-xs font-mono space-y-1">
              <p className="text-gray-600">SKUs leídos de la tabla:</p>
              {simulatedDatabaseProducts.map(sku => (
                <div key={sku} className="text-blue-600">{sku}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de productos CON ofertas */}
      <ProductsGrid
        products={productsWithOffer}
        title="Productos CON Ofertas"
        description={`${productsWithOffer.length} producto(s) encontrado(s) en la tabla de ofertas`}
        showOfferBadge={true}
      />

      {/* Grid de productos SIN ofertas */}
      {productsWithoutOffer.length > 0 && (
        <ProductsGrid
          products={productsWithoutOffer}
          title="Productos SIN Ofertas"
          description={`${productsWithoutOffer.length} producto(s) sin oferta vigente`}
          showOfferBadge={false}
        />
      )}

      {/* Resumen */}
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle className="text-sm">Resumen de Lectura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{simulatedDatabaseProducts.length}</div>
              <div className="text-xs text-gray-600">Productos leídos</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{productsWithOffer.length}</div>
              <div className="text-xs text-gray-600">Con oferta</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">{productsWithoutOffer.length}</div>
              <div className="text-xs text-gray-600">Sin oferta</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
