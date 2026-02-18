'use client';

import { useState, useMemo } from 'react';
import { Product, mockProducts } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  selectedProduct?: Product;
}

export function ProductSearch({ onProductSelect, selectedProduct }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return mockProducts;
    
    const query = searchQuery.toLowerCase();
    return mockProducts.filter(
      (product) =>
        product.nombre.toLowerCase().includes(query) ||
        product.descripcion.toLowerCase().includes(query) ||
        product.dosage.toLowerCase().includes(query) ||
        product.codigo.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Seleccionar Producto</CardTitle>
        <CardDescription>Busca por nombre, código, talla o descripción</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Product List */}
        <div className="max-h-80 overflow-y-auto space-y-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Button
                key={product.id}
                variant={selectedProduct?.id === product.id ? 'default' : 'outline'}
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => onProductSelect(product)}
              >
                <div className="w-full">
                  <div className="font-semibold text-sm flex items-center gap-2">
                    {product.nombre}
                    {product.oferta && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                        -{product.oferta.descuentoPorcentaje}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div>Talla: {product.dosage} • Stock: {product.stock}</div>
                    <div className="flex gap-2 items-center">
                      {product.oferta ? (
                        <>
                          <span className="line-through text-gray-400">${product.precioNormal.toLocaleString('es-CL')}</span>
                          <span className="text-red-600 font-semibold">${product.precio.toLocaleString('es-CL')}</span>
                        </>
                      ) : (
                        <span>${product.precio.toLocaleString('es-CL')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </div>

        {/* Selected Product Summary */}
        {selectedProduct && (
          <div className="border-t pt-4 mt-4 space-y-3">
            <h4 className="font-semibold text-sm mb-2">Producto Seleccionado</h4>
            <div className="bg-blue-50 p-3 rounded-lg space-y-2 text-sm">
              <p><span className="font-semibold">SKU:</span> {selectedProduct.codigo}</p>
              <p><span className="font-semibold">Barras:</span> {selectedProduct.codigoBarras}</p>
              <p><span className="font-semibold">Nombre:</span> {selectedProduct.nombre}</p>
              <p><span className="font-semibold">Talla:</span> {selectedProduct.dosage}</p>
              <p><span className="font-semibold">Stock:</span> {selectedProduct.stock} unidades</p>
              
              {/* Pricing Info */}
              <div className="border-t pt-2 mt-2 space-y-1">
                {selectedProduct.oferta ? (
                  <>
                    <p><span className="font-semibold">Precio Normal:</span> <span className="line-through text-gray-500">${selectedProduct.precioNormal.toLocaleString('es-CL')}</span></p>
                    <p><span className="font-semibold text-red-600">Precio Oferta:</span> <span className="text-red-600 font-bold">${selectedProduct.precio.toLocaleString('es-CL')}</span></p>
                    <p><span className="font-semibold">Descuento:</span> {selectedProduct.oferta.descuentoPorcentaje}%</p>
                    <p><span className="text-xs text-gray-600">Válido hasta: {selectedProduct.oferta.vigenciaFin}</span></p>
                  </>
                ) : (
                  <p><span className="font-semibold">Precio:</span> ${selectedProduct.precio.toLocaleString('es-CL')}</p>
                )}
              </div>
            </div>

            {/* Mesón Info */}
            {selectedProduct.meson && (
              <div className="bg-green-50 p-3 rounded-lg space-y-1 text-sm border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Información de Mesón</h5>
                <p><span className="font-semibold">División:</span> {selectedProduct.meson.division}</p>
                <p><span className="font-semibold">Categoría:</span> {selectedProduct.meson.categoria}</p>
                <p><span className="font-semibold">Subcategoría:</span> {selectedProduct.meson.subcategoria}</p>
                <p><span className="font-semibold">Marca:</span> {selectedProduct.meson.marca}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
