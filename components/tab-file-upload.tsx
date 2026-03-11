'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedWithOffer, setSelectedWithOffer] = useState<Set<string>>(new Set());
  const [selectAllWithOffer, setSelectAllWithOffer] = useState(false);

  useEffect(() => {
    // Cargar automáticamente cuando se monta el componente
    const loadEtiquetaFile = async () => {
      try {
        const content = EXAMPLE_TXT;
        setFileContent(content);
        parseAndMatch(content);
      } catch (error) {
        console.error('Error al cargar archivo:', error);
      }
    };
    loadEtiquetaFile();
  }, []);

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
    setSelectedWithOffer(new Set());
    setSelectAllWithOffer(false);
  };

  const toggleWithOffer = (codigo: string) => {
    const newSelected = new Set(selectedWithOffer);
    if (newSelected.has(codigo)) {
      newSelected.delete(codigo);
    } else {
      newSelected.add(codigo);
    }
    setSelectedWithOffer(newSelected);
    setSelectAllWithOffer(newSelected.size === parseResult?.conOferta.length);
  };

  const toggleSelectAllWithOffer = () => {
    if (selectAllWithOffer) {
      setSelectedWithOffer(new Set());
      setSelectAllWithOffer(false);
    } else {
      setSelectedWithOffer(new Set(parseResult?.conOferta.map(p => p.codigo) || []));
      setSelectAllWithOffer(true);
    }
  };

  const handleUseExample = () => {
    setFileContent(EXAMPLE_TXT);
    parseAndMatch(EXAMPLE_TXT);
  };

  const handlePrintSelected = () => {
    if (selectedWithOffer.size === 0) {
      alert('Por favor selecciona al menos un producto con oferta para imprimir');
      return;
    }
    onPrint?.(Array.from(selectedWithOffer));
    alert(`Imprimiendo ${selectedWithOffer.size} etiqueta(s)...`);
  };

  const handleExport = () => {
    const skus = parseResult?.sinOferta.map(p => p.codigo) || [];
    console.log('Exportando SKUs sin oferta:', skus);
    alert(`Exportando ${skus.length} producto(s) sin oferta...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Cargar Archivo Etiqueta
          </CardTitle>
          <CardDescription>
            Carga automáticamente los datos desde el archivo etiqueta. Se validarán contra productos en BD.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="pt-6">
          <p className="text-xs text-gray-600 text-center">
            Leyendo automáticamente desde: /etiquetas/productos.txt
          </p>

          {fileContent && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-600 font-semibold mb-2">Contenido del archivo:</p>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {fileContent}
              </pre>
            </div>
          )}
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-red-700">Productos CON Ofertas ({parseResult.conOferta.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="select-all-offer-file"
                      checked={selectAllWithOffer}
                      onCheckedChange={() => toggleSelectAllWithOffer()}
                    />
                    <label htmlFor="select-all-offer-file" className="text-sm font-medium cursor-pointer">
                      Seleccionar todo
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {parseResult.conOferta.map(product => (
                    <div key={product.codigo} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox 
                        checked={selectedWithOffer.has(product.codigo)}
                        onCheckedChange={() => toggleWithOffer(product.codigo)}
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
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handlePrintSelected}
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
              Exportar Sin Ofertas ({parseResult.sinOferta.length})
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
