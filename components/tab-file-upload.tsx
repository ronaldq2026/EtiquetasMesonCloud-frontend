'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

// Mock: Todos los SKUs disponibles en BD
const ALL_AVAILABLE_SKUS = [
  { codigo: '89997002', nombre: 'BLOODYGREEN TEEN FLUJO INTENSO 14-15', enOferta: true, precio: 16990 },
  { codigo: '89997001', nombre: 'BLOODYGREEN TEEN FLUJO INTENSO 12-13', enOferta: false, precio: 16990 },
  { codigo: '89996005', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO XXL', enOferta: true, precio: 19990 },
  { codigo: '89996004', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO XL', enOferta: false, precio: 19990 },
  { codigo: '89996003', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO L', enOferta: false, precio: 19990 },
  { codigo: '89996002', nombre: 'BLOODYGREEN H.W. FLUJO INTENSO M', enOferta: true, precio: 19990 },
];

// Mock: Ejemplo de archivo TXT
const EXAMPLE_TXT = `89997002
89996005
INVALID123
89996004
NOTFOUND456
89996002`;

interface ParsedResult {
  conOferta: any[];
  sinOferta: any[];
  noEncontrados: string[];
}

export function TabFileUpload({ onPrint }: { onPrint?: (skus: string[]) => void }) {
  const [fileContent, setFileContent] = useState<string>('');
  const [parseResult, setParseResult] = useState<ParsedResult | null>(null);
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      parseAndMatch(content);
    };
    reader.readAsText(file);
  };

  const parseAndMatch = (content: string) => {
    const skus = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const conOferta: any[] = [];
    const sinOferta: any[] = [];
    const noEncontrados: string[] = [];

    skus.forEach(sku => {
      const found = ALL_AVAILABLE_SKUS.find(p => p.codigo === sku);
      if (found) {
        if (found.enOferta) {
          conOferta.push(found);
        } else {
          sinOferta.push(found);
        }
      } else {
        noEncontrados.push(sku);
      }
    });

    setParseResult({ conOferta, sinOferta, noEncontrados });
    setSelectedSkus(new Set());
  };

  const handleUseExample = () => {
    setFileContent(EXAMPLE_TXT);
    parseAndMatch(EXAMPLE_TXT);
  };

  const handleToggleSku = (codigo: string) => {
    const newSelected = new Set(selectedSkus);
    if (newSelected.has(codigo)) {
      newSelected.delete(codigo);
    } else {
      newSelected.add(codigo);
    }
    setSelectedSkus(newSelected);
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
    const allSkus = [
      ...(parseResult?.conOferta || []),
      ...(parseResult?.sinOferta || [])
    ].map(p => p.codigo);
    
    if (allSkus.length === 0) {
      alert('No hay productos válidos para imprimir');
      return;
    }
    
    onPrint?.(allSkus);
    alert(`Imprimiendo ${allSkus.length} etiqueta(s)...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Cargar Archivo TXT
          </CardTitle>
          <CardDescription>
            Sube un archivo .txt con SKUs separados por línea. Se validarán contra productos en BD.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-green-500 transition">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <label className="cursor-pointer w-full">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">Selecciona o arrastra un archivo TXT</p>
                <p className="text-xs text-gray-600 mt-1">Solo archivos .txt, máximo 1MB</p>
              </div>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {fileContent && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-600 font-semibold mb-2">Contenido del archivo:</p>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {fileContent}
              </pre>
            </div>
          )}

          <div className="mt-4">
            <Button
              onClick={handleUseExample}
              variant="outline"
              className="w-full text-sm"
            >
              Usar Ejemplo Simulado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {parseResult && (
        <>
          {/* Estadísticas */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {parseResult.conOferta.length + parseResult.sinOferta.length}
                  </p>
                  <p className="text-xs text-gray-600">Válidos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{parseResult.conOferta.length}</p>
                  <p className="text-xs text-gray-600">Con Oferta</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-400">{parseResult.sinOferta.length}</p>
                  <p className="text-xs text-gray-600">Sin Oferta</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{parseResult.noEncontrados.length}</p>
                  <p className="text-xs text-gray-600">No Encontrados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Con Ofertas */}
          {parseResult.conOferta.length > 0 && (
            <Card>
              <CardHeader className="bg-red-50 border-b border-red-200">
                <CardTitle className="text-red-700">Productos CON Ofertas ({parseResult.conOferta.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {parseResult.conOferta.map(product => (
                    <div key={product.codigo} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedSkus.has(product.codigo)}
                        onChange={() => handleToggleSku(product.codigo)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{product.nombre}</p>
                        <p className="text-xs text-gray-600">SKU: {product.codigo}</p>
                      </div>
                      <span className="text-sm font-bold text-red-600">${product.precio.toLocaleString('es-CL')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sin Ofertas */}
          {parseResult.sinOferta.length > 0 && (
            <Card>
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-700">Productos SIN Ofertas ({parseResult.sinOferta.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {parseResult.sinOferta.map(product => (
                    <div key={product.codigo} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedSkus.has(product.codigo)}
                        onChange={() => handleToggleSku(product.codigo)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{product.nombre}</p>
                        <p className="text-xs text-gray-600">SKU: {product.codigo}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">${product.precio.toLocaleString('es-CL')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Encontrados */}
          {parseResult.noEncontrados.length > 0 && (
            <Card className="border-orange-300 bg-orange-50">
              <CardHeader className="border-b border-orange-200">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="h-5 w-5" />
                  SKUs No Encontrados ({parseResult.noEncontrados.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-2">
                  {parseResult.noEncontrados.map(sku => (
                    <div key={sku} className="p-3 bg-white border border-orange-200 rounded-lg">
                      <p className="text-sm font-mono text-orange-700">{sku}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={handlePrintSelected}
              disabled={selectedSkus.size === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Imprimir Seleccionados ({selectedSkus.size})
            </Button>
            <Button
              onClick={handlePrintAll}
              variant="outline"
              disabled={parseResult.conOferta.length + parseResult.sinOferta.length === 0}
            >
              Imprimir Todos ({parseResult.conOferta.length + parseResult.sinOferta.length})
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedSkus(new Set())}
              disabled={selectedSkus.size === 0}
            >
              Limpiar Selección
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
