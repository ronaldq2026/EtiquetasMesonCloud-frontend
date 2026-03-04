'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

// Mock: Simulación de lectura de BD (dejamos igual los datos)
const MOCK_DATABASE_PRODUCTS = [
  { codigo: '89997002', nombre: 'BLOODYGREEN TEEN FLUJO INTENSO', talla: '14-15', stock: 8,  precio: 16990, laboratorio: 'BLOODYGREEN', enOferta: true  },
  { codigo: '89997001', nombre: 'BLOODYGREEN TEEN FLUJO INTENSO', talla: '12-13', stock: 8,  precio: 16990, laboratorio: 'BLOODYGREEN', enOferta: false },
  { codigo: '89996005', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',  talla: 'XXL',   stock: 14, precio: 19990, laboratorio: 'BLOODYGREEN', enOferta: true  },
  { codigo: '89996004', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',  talla: 'XL',    stock: 14, precio: 19990, laboratorio: 'BLOODYGREEN', enOferta: false },
  { codigo: '89996003', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',  talla: 'L',     stock: 14, precio: 19990, laboratorio: 'BLOODYGREEN', enOferta: false },
  { codigo: '89996002', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',  talla: 'M',     stock: 14, precio: 19990, laboratorio: 'BLOODYGREEN', enOferta: true  },
];

interface TabDatabaseReadProps {
  onProductSelect?: (product: any) => void;
  onPrint?: (skus: string[]) => void;
}

export function TabDatabaseRead({ onProductSelect, onPrint }: TabDatabaseReadProps) {
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());

  // Separar en dos grupos (igual que ahora)
  const productsWithOffer = useMemo(
    () => MOCK_DATABASE_PRODUCTS.filter(p => p.enOferta),
    []
  );
  const productsWithoutOffer = useMemo(
    () => MOCK_DATABASE_PRODUCTS.filter(p => !p.enOferta),
    []
  );

  const handleSelectAll = (grupo: 'with' | 'without') => {
    const newSelected = new Set(selectedSkus);
    const products = grupo === 'with' ? productsWithOffer : productsWithoutOffer;
    products.forEach(p => {
      if (newSelected.has(p.codigo)) newSelected.delete(p.codigo);
      else newSelected.add(p.codigo);
    });
    setSelectedSkus(newSelected);
  };

  const handleToggleSku = (codigo: string) => {
    const next = new Set(selectedSkus);
    if (next.has(codigo)) next.delete(codigo);
    else next.add(codigo);
    setSelectedSkus(next);
  };

  const handlePrintSelected = () => {
    if (selectedSkus.size === 0) {
      alert('Por favor selecciona al menos un producto');
      return;
    }
    onPrint?.(Array.from(selectedSkus));
    alert(`Imprimiendo ${selectedSkus.size} etiqueta(s)...`);
  };

  const handlePrintAll = () => {
    const allSkus = MOCK_DATABASE_PRODUCTS.map(p => p.codigo);
    onPrint?.(allSkus);
    alert(`Imprimiendo ${allSkus.length} etiqueta(s)...`);
  };

  return (
    <div className="space-y-6">

      {/* Header (renombrado a Archivo Centralizado) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Lectura del Archivo Maestro Centralizado
          </CardTitle>
          <CardDescription>
            Simula lectura de SKUs desde un archivo centralizado (tabla Oracle). Mostrará productos con y sin ofertas vigentes.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Estadísticas (color reforzado en SIN ofertas) */}
      <div className="grid grid-cols-4 gap-4">
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
              {/* CON ofertas -> color normal */}
              <p className="text-3xl font-bold text-gray-900">{productsWithOffer.length}</p>
              <p className="text-xs text-gray-600">Con Ofertas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              {/* SIN ofertas -> rojo */}
              <p className="text-3xl font-bold text-red-600">{productsWithoutOffer.length}</p>
              <p className="text-xs text-gray-600">Sin Ofertas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{selectedSkus.size}</p>
              <p className="text-xs text-gray-600">Seleccionados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos CON Ofertas → normal (sin rojos) */}
      <Card>
        <CardHeader className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Productos CON Ofertas ({productsWithOffer.length})</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll('with')}
              className="text-xs"
            >
              {productsWithOffer.some(p => selectedSkus.has(p.codigo)) ? 'Deseleccionar' : 'Seleccionar'} Todo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {productsWithOffer.map(product => (
              <div key={product.codigo} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedSkus.has(product.codigo)}
                  onChange={() => handleToggleSku(product.codigo)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{product.nombre}</p>
                  <p className="text-xs text-gray-600">
                    SKU: {product.codigo} • Talla: {product.talla} • Stock: {product.stock}
                  </p>
                </div>
                {/* ⬇️ ahora precio en color normal */}
                <span className="text-sm font-semibold text-gray-900">
                  ${product.precio.toLocaleString('es-CL')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Productos SIN Ofertas → resaltados (rojo + negrilla + leve fondo) */}
      <Card>
        <CardHeader className="bg-red-50 border-b border-red-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-700 font-semibold">
              Productos SIN Ofertas ({productsWithoutOffer.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll('without')}
              className="text-xs"
            >
              {productsWithoutOffer.some(p => selectedSkus.has(p.codigo)) ? 'Deseleccionar' : 'Seleccionar'} Todo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {productsWithoutOffer.map(product => (
              <div
                key={product.codigo}
                className="flex items-center gap-3 p-3 border rounded-lg bg-red-50 hover:bg-red-50/80 border-red-200"
              >
                <input
                  type="checkbox"
                  checked={selectedSkus.has(product.codigo)}
                  onChange={() => handleToggleSku(product.codigo)}
                  className="w-4 h-4 rounded border-red-300"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-red-700">{product.nombre}</p>
                  <p className="text-xs text-red-700/90">
                    SKU: {product.codigo} • Talla: {product.talla} • Stock: {product.stock}
                  </p>
                </div>
                <span className="text-sm font-bold text-red-700">
                  ${product.precio.toLocaleString('es-CL')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones (igual) */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          onClick={handlePrintSelected}
          disabled={selectedSkus.size === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Imprimir Seleccionados ({selectedSkus.size})
        </Button>
        <Button onClick={handlePrintAll} variant="outline">
          Imprimir Todos ({MOCK_DATABASE_PRODUCTS.length})
        </Button>
        <Button
          variant="ghost"
          onClick={() => setSelectedSkus(new Set())}
          disabled={selectedSkus.size === 0}
        >
          Limpiar Selección
        </Button>
      </div>
    </div>
  );
}