'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { parsePosdpofe, parseMeson, mergeProductData } from '@/lib/data-merger';
import { mockProducts } from '@/lib/mock-data';

interface DataImporterProps {
  onDataMerged?: (products: any[]) => void;
}

export function DataImporter({ onDataMerged }: DataImporterProps) {
  const [mesonFile, setMesonFile] = useState<File | null>(null);
  const [posdpofeFile, setPosdpofeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMergeData = async () => {
    try {
      setLoading(true);
      setMessage('');

      let mesonMap = new Map();
      let ofertasMap = new Map();

      // Procesar archivo meson
      if (mesonFile) {
        const mesonContent = await mesonFile.text();
        mesonMap = parseMeson(mesonContent);
        setMessage(`✓ Mesón: ${mesonMap.size} productos cargados`);
      }

      // Procesar archivo posdpofe
      if (posdpofeFile) {
        const posdpofeContent = await posdpofeFile.text();
        ofertasMap = parsePosdpofe(posdpofeContent);
        setMessage((prev) => `${prev}\n✓ Ofertas: ${ofertasMap.size} ofertas cargadas`);
      }

      // Fusionar datos
      if (mesonFile || posdpofeFile) {
        const mergedProducts = mergeProductData(mockProducts, ofertasMap, mesonMap);
        onDataMerged?.(mergedProducts);
        setMessage((prev) => `${prev}\n✓ Datos fusionados exitosamente`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importar Datos DBF</CardTitle>
        <CardDescription>Carga archivos meson y posdpofe para fusionar con productos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Meson Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Archivo Mesón</label>
            <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
              <div className="flex flex-col items-center justify-center space-y-1">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {mesonFile ? mesonFile.name : 'Seleccionar archivo'}
                </span>
              </div>
              <input
                type="file"
                accept=".txt,.csv,.tsv"
                onChange={(e) => setMesonFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {/* Posdpofe Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Archivo Posdpofe</label>
            <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
              <div className="flex flex-col items-center justify-center space-y-1">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {posdpofeFile ? posdpofeFile.name : 'Seleccionar archivo'}
                </span>
              </div>
              <input
                type="file"
                accept=".txt,.csv,.tsv"
                onChange={(e) => setPosdpofeFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Merge Button */}
        <Button
          onClick={handleMergeData}
          disabled={!mesonFile && !posdpofeFile}
          className="w-full"
        >
          {loading ? 'Procesando...' : 'Fusionar Datos'}
        </Button>

        {/* Message */}
        {message && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm whitespace-pre-line font-mono text-gray-700">{message}</p>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-700 space-y-1">
          <p className="font-semibold">Formato esperado:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Archivos TSV (Tab-Separated Values) o TXT</li>
            <li>Primera fila puede ser encabezados o datos</li>
            <li>Meson: SKU, DESCRIPCION, DIVISION, CATEGORÍA, SUBCATEGORÍA, MARCA</li>
            <li>Posdpofe: DP_DATO (SKU), DP_VALOFER (precio), DP_DSCTO (descuento), DP_FFIN (fecha fin)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
