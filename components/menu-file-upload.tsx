'use client';

import { useState } from 'react';
import { ApiProduct } from '@/lib/api-client';
import { useProducts } from '@/hooks/useProducts';
import { parseTextFileSKUs, simulatedTextFileSkus } from '@/lib/mock-menu-data';
import { ProductsGrid } from './products-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import type { Product } from '@/lib/product';

export function MenuFileUpload() {

  const { products } = useProducts();

  const [uploadedSkus, setUploadedSkus] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const skus = parseTextFileSKUs(content);
        setUploadedSkus(skus);
      } catch (err) {
        setError('Error al leer el archivo');
      }
    };

    reader.readAsText(file);
  };

  const handleSimulateUpload = () => {
    const skus = parseTextFileSKUs(simulatedTextFileSkus);
    setUploadedSkus(skus);
    setFileName('ejemplo.txt (simulado)');
  };

  const clearUpload = () => {
    setUploadedSkus([]);
    setFileName('');
    setError('');
  };

  // SKUs válidos
  const validSkus = uploadedSkus.filter(sku =>
    products.some(p => p.sku === sku)
  );

  // SKUs inválidos
  const invalidSkus = uploadedSkus.filter(sku =>
    !products.some(p => p.sku === sku)
  );

  // Productos con oferta
	const productsWithOffer = products.filter(p =>
	  validSkus.includes(p.sku) && (p as any).oferta
	);  

  // Productos sin oferta
	const productsWithoutOffer = products.filter(p =>
	  validSkus.includes(p.sku) && !(p as any).oferta
	);
  return (
    <div className="space-y-6">

      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Cargar Archivo TXT
          </CardTitle>
          <CardDescription>
            Carga un archivo de texto con SKUs separados por líneas
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            {!fileName ? (

              <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition">

                <label className="cursor-pointer block">

                  <Input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-purple-400" />
                    <p className="text-sm font-medium text-gray-700">
                      Click para cargar un archivo
                    </p>
                    <p className="text-xs text-gray-500">
                      o arrastra tu archivo aquí
                    </p>
                  </div>

                </label>

              </div>

            ) : (

              <div className="bg-white p-4 rounded-lg border border-green-200 flex items-center justify-between">

                <div>
                  <p className="font-medium text-sm">{fileName}</p>
                  <p className="text-xs text-gray-600">
                    {uploadedSkus.length} SKUs cargados
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearUpload}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>

              </div>

            )}

            <div className="flex gap-2">

              <Button
                onClick={handleSimulateUpload}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Usar Ejemplo Simulado
              </Button>

            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
                {error}
              </div>
            )}

          </div>

        </CardContent>

      </Card>

      {uploadedSkus.length > 0 && (

        <>

          <Card className="border-gray-300">

            <CardHeader>
              <CardTitle className="text-sm">Validación de SKUs</CardTitle>
            </CardHeader>

            <CardContent>

              <div className="grid grid-cols-4 gap-4">

                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{uploadedSkus.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>

                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{validSkus.length}</div>
                  <div className="text-xs text-gray-600">Válidos</div>
                </div>

                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-600">{invalidSkus.length}</div>
                  <div className="text-xs text-gray-600">No encontrados</div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-600">{productsWithOffer.length}</div>
                  <div className="text-xs text-gray-600">Con oferta</div>
                </div>

              </div>

            </CardContent>

          </Card>

          {productsWithOffer.length > 0 && (
			<ProductsGrid
              products={productsWithOffer as unknown as Product[]}
              title="Productos CON Ofertas"
              description={`${productsWithOffer.length} producto(s) encontrado(s) en la tabla de ofertas`}
              showOfferBadge={true}
            />
          )}

          {productsWithoutOffer.length > 0 && (
            <ProductsGrid              
			  products={productsWithoutOffer as unknown as Product[]}
              title="Productos SIN Ofertas"
              description={`${productsWithoutOffer.length} producto(s) sin oferta vigente`}
              showOfferBadge={false}
            />
          )}

          {invalidSkus.length > 0 && (

            <Card className="border-red-200 bg-red-50">

              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-800">
                  SKUs No Encontrados ({invalidSkus.length})
                </CardTitle>
              </CardHeader>

              <CardContent>

                <div className="space-y-2">

                  {invalidSkus.map(sku => (

                    <div
                      key={sku}
                      className="bg-white p-2 rounded text-sm font-mono flex items-center justify-between border border-red-100"
                    >
                      <span className="text-red-600">{sku}</span>
                      <span className="text-xs text-red-500">No existe en sistema</span>
                    </div>

                  ))}

                </div>

              </CardContent>

            </Card>

          )}

        </>

      )}

      {uploadedSkus.length === 0 && !fileName && (

        <Card className="border-dashed border-gray-300">

          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              Carga un archivo TXT para comenzar
            </p>
          </CardContent>

        </Card>

      )}

    </div>
  );
}