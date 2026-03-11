'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileJson } from 'lucide-react';

// Mock: Lectura del archivo maestro centralizado
const MOCK_DATABASE_PRODUCTS = [
  { codigo: '89997002', nombre: 'BLOODYGREEN TEEN FLUJO INTENSO', talla: '14-15', stock: 8, precio: 16990, laboratorio: 'BLOODYGREEN', enOferta: true },
  { codigo: '89997001', nombre: 'BLOODYGREEN TEEN FLUJO INTENSO', talla: '12-13', stock: 8, precio: 16990, laboratorio: 'BLOODYGREEN', enOferta: false },
  { codigo: '89996005', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO', talla: 'XXL', stock: 14, precio: 19990, laboratorio: 'BLOODYGREEN', enOferta: true },
  { codigo: '89996004', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO', talla: 'XL', stock: 14, precio: 19990, laboratorio: 'BLOODYGREEN', enOferta: false },
  { codigo: '89996003', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO', talla: 'L', stock: 14, precio: 19990, laboratorio: 'BLOODYGREEN', enOferta: false },
  { codigo: '89996002', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO', talla: 'M', stock: 14, precio: 19990, laboratorio: 'BLOODYGREEN', enOferta: true },
];

interface TabDatabaseReadProps {
  onProductSelect?: (product: any) => void;
  onPrint?: (skus: string[]) => void;
}

export function TabDatabaseRead({ onProductSelect, onPrint }: TabDatabaseReadProps) {
  const [selectedWithOffer, setSelectedWithOffer] = useState<Set<string>>(new Set());
  const [selectAllWithOffer, setSelectAllWithOffer] = useState(false);

  // Separar en dos grupos
  const productsWithOffer = useMemo(() => 
    MOCK_DATABASE_PRODUCTS.filter(p => p.enOferta), 
    []
  );
  
  const productsWithoutOffer = useMemo(() => 
    MOCK_DATABASE_PRODUCTS.filter(p => !p.enOferta), 
    []
  );

  // Manejo de selección para productos CON oferta
  const toggleWithOffer = (codigo: string) => {
    const newSelected = new Set(selectedWithOffer);
    if (newSelected.has(codigo)) {
      newSelected.delete(codigo);
    } else {
      newSelected.add(codigo);
    }
    setSelectedWithOffer(newSelected);
    setSelectAllWithOffer(newSelected.size === productsWithOffer.length);
  };

  const toggleSelectAllWithOffer = () => {
    if (selectAllWithOffer) {
      setSelectedWithOffer(new Set());
      setSelectAllWithOffer(false);
    } else {
      setSelectedWithOffer(new Set(productsWithOffer.map(p => p.codigo)));
      setSelectAllWithOffer(true);
    }
  };

  const handlePrint = () => {
    const skus = Array.from(selectedWithOffer);
    if (skus.length === 0) {
      alert('Selecciona al menos un producto con oferta para imprimir');
      return;
    }
    onPrint?.(skus);
    alert(`Imprimiendo ${skus.length} etiqueta(s)...`);
  };

  const handleExport = () => {
    const skus = productsWithoutOffer.map(p => p.codigo);
    console.log('Exportando SKUs sin oferta:', skus);
    alert(`Exportando ${skus.length} producto(s) sin oferta...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-blue-600" />
            Leer Archivo Centralizado
          </CardTitle>
          <CardDescription>
            Lectura del archivo maestro centralizado de productos. Mostrará productos con y sin ofertas vigentes.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{MOCK_DATABASE_PRODUCTS.length}</p>
              <p className="text-xs text-gray-600">Total Productos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">{productsWithOffer.length}</p>
              <p className="text-xs text-gray-600">Con Ofertas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{productsWithoutOffer.length}</p>
              <p className="text-xs text-gray-600">Sin Ofertas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos con Ofertas */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Productos CON Ofertas ({productsWithOffer.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="select-all-offer"
                checked={selectAllWithOffer}
                onCheckedChange={() => toggleSelectAllWithOffer()}
              />
              <label htmlFor="select-all-offer" className="text-sm font-medium cursor-pointer">
                Seleccionar todo
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {productsWithOffer.map(product => (
              <div key={product.codigo} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  checked={selectedWithOffer.has(product.codigo)}
                  onCheckedChange={() => toggleWithOffer(product.codigo)}
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-black">{product.nombre}</p>
                  <p className="text-xs text-gray-700">SKU: {product.codigo} • Talla: {product.talla} • Stock: {product.stock}</p>
                </div>
                <span className="text-sm font-bold text-black">${product.precio.toLocaleString('es-CL')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Productos sin Ofertas */}
      <Card className="border-2 border-red-500 bg-red-50">
        <CardHeader className="border-b border-red-200">
          <CardTitle className="text-red-700">Productos SIN Ofertas ({productsWithoutOffer.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {productsWithoutOffer.map(product => (
              <div key={product.codigo} className="flex items-center gap-3 p-3 border-2 border-red-300 rounded-lg bg-red-100">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-red-900">{product.nombre}</p>
                  <p className="text-xs text-red-700">SKU: {product.codigo} • Talla: {product.talla} • Stock: {product.stock}</p>
                </div>
                <span className="text-sm font-bold text-red-900">${product.precio.toLocaleString('es-CL')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handlePrint}
          disabled={selectedWithOffer.size === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Imprimir Seleccionados ({selectedWithOffer.size})
        </Button>
        <Button
          onClick={handleExport}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
        >
          Exportar Sin Ofertas ({productsWithoutOffer.length})
        </Button>
      </div>
    </div>
  );
}
