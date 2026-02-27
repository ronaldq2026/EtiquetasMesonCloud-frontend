// app/page.tsx
'use client';

import { useState } from 'react';
import { Product, defaultLabelConfig, mockProducts } from '@/lib/mock-data';
import { LabelPreview } from '@/components/label-preview';
import { ConfigPanel } from '@/components/config-panel';
import { ProductSearch } from '@/components/product-search';
import { LabelBuilder } from '@/components/label-builder';
import { PrintExport } from '@/components/print-export';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { LabelConfig } from '@/lib/mock-data';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(mockProducts[0]);
  const [labelConfig, setLabelConfig] = useState<LabelConfig>(defaultLabelConfig);
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Fa</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Impresión de Etiquetas</h1>
                <p className="text-sm text-gray-500">Farmacias Ahumada</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Product Search & Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <ProductSearch
              selectedProduct={selectedProduct}
              onProductSelect={setSelectedProduct}
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

          {/* Right Content - Preview & Print */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa de Etiqueta</h2>
              <div className="flex justify-center bg-gray-50 rounded-lg p-8 min-h-96">
                <LabelPreview
                  product={selectedProduct}
                  config={labelConfig}
                />
              </div>
            </div>

            {/* Print & Export Section */}
            <PrintExport
              product={selectedProduct}
              config={labelConfig}
            />

            {/* Quick Info */}
            <div className={`rounded-lg p-6 border ${selectedProduct.oferta ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
              <h3 className="font-semibold text-gray-900 mb-3">Configuración Actual de Etiqueta</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Producto:</span>
                  <p className="font-semibold text-gray-900">{selectedProduct.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <p className="font-semibold text-gray-900">{selectedProduct.stock} unidades</p>
                </div>
                <div>
                  <span className="text-gray-600">Precio:</span>
                  <p className="font-semibold text-gray-900">
                    {selectedProduct.oferta ? (
                      <span>
                        <span className="line-through text-gray-500 mr-2">${selectedProduct.precioNormal.toLocaleString('es-CL')}</span>
                        <span className="text-red-600">${selectedProduct.precio.toLocaleString('es-CL')}</span>
                      </span>
                    ) : (
                      `$${selectedProduct.precio.toLocaleString('es-CL')}`
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Campos:</span>
                  <p className="font-semibold text-gray-900">
                    {[
                      labelConfig.showProductName,
                      labelConfig.showGenericName,
                      labelConfig.showDosage,
                      labelConfig.showBatch,
                      labelConfig.showExpiry,
                      labelConfig.showManufacturer,
                      labelConfig.showPrice,
                    ].filter(Boolean).length}
                    /7
                  </p>
                </div>
              </div>
              {selectedProduct.oferta && (
                <div className="mt-4 pt-4 border-t border-red-200">
                  <p className="text-xs text-red-700 font-semibold mb-2">OFERTA VIGENTE</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p><span className="font-semibold">Descuento:</span> {selectedProduct.oferta.descuentoPorcentaje}%</p>
                    <p><span className="font-semibold">Válido hasta:</span> {selectedProduct.oferta.vigenciaFin}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
