'use client';

import { useState } from 'react';
import { Product, defaultLabelConfig } from '@/lib/product';
import { ConfigPanel } from '@/components/config-panel';
import { ProductSearch } from '@/components/product-search';
import { LabelBuilder } from '@/components/label-builder';
import { PrintExport } from '@/components/print-export';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { LabelConfig } from '@/lib/product';

interface MenuManualSearchProps {
  initialProduct: Product;
}

export function MenuManualSearch({ initialProduct }: MenuManualSearchProps) {

  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct);
  const [labelConfig, setLabelConfig] = useState<LabelConfig>(defaultLabelConfig);

  /**
   * El producto ya viene enriquecido desde ProductSearch
   */
  const handleProductSelect = (product: Product) => {
    console.log('[MenuManualSearch] Producto seleccionado:', product);
    setSelectedProduct(product);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">

        <ProductSearch
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
        />

        <Tabs defaultValue="config" className="w-full">

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="builder">Constructor</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-4">
            <ConfigPanel
              config={labelConfig}
              onConfigChange={setLabelConfig}
            />
          </TabsContent>

          <TabsContent value="builder" className="mt-4">
            <LabelBuilder
              product={selectedProduct}
              config={labelConfig}
              onConfigChange={setLabelConfig}
            />
          </TabsContent>

        </Tabs>

      </div>

      {/* Print + Info */}
      <div className="lg:col-span-2 space-y-6">

        <PrintExport
          product={selectedProduct}
          config={labelConfig}
        />

        {/* INFO */}

        <div
          className={`rounded-lg p-6 border ${
            selectedProduct.oferta
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
          }`}
        >

          <h3 className="font-semibold text-gray-900 mb-3">
            Configuración Actual de Etiqueta
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <span className="text-gray-600">Producto:</span>
              <p className="font-semibold">{selectedProduct.nombre}</p>
            </div>

            <div>
              <span className="text-gray-600">Stock:</span>
              <p className="font-semibold">{selectedProduct.stock || 0}</p>
            </div>

            <div>
              <span className="text-gray-600">Precio:</span>

              {selectedProduct.precioOferta ? (
                <p className="font-semibold">
                  <span className="line-through mr-2 text-gray-500">
                    ${selectedProduct.precioUnitario?.toLocaleString('es-CL')}
                  </span>

                  <span className="text-red-600">
                    ${selectedProduct.precioOferta?.toLocaleString('es-CL')}
                  </span>
                </p>
              ) : (
                <p className="font-semibold">
                  ${selectedProduct.precioUnitario?.toLocaleString('es-CL')}
                </p>
              )}

            </div>

            <div>
              <span className="text-gray-600">Campos:</span>
              <p className="font-semibold">
                {[
                  labelConfig.showProductName,
                  labelConfig.showGenericName,
                  labelConfig.showDosage,
                  labelConfig.showBatch,
                  labelConfig.showExpiry,
                  labelConfig.showManufacturer,
                  labelConfig.showPrice,
                ].filter(Boolean).length}/7
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}