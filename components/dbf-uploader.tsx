'use client';

import { useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parseDBFFile } from '@/lib/dbf-parser';
import { Upload } from 'lucide-react';

interface DBFUploaderProps {
  onDataLoaded: (data: any[]) => void;
}

export function DBFUploader({ onDataLoaded }: DBFUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const products = parseDBFFile(text);
      onDataLoaded(products);
      alert(`Se cargaron exitosamente ${products.length} productos`);
    } catch (error) {
      alert(`Error al cargar archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Cargar Datos DBF</CardTitle>
        <CardDescription>Importa productos desde tu archivo DBF exportado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <Input
            ref={fileInputRef}
            type="file"
            accept=".txt,.dbf,.csv,.tsv"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Seleccionar Archivo DBF
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Formatos soportados: TXT (tabulado), CSV, DBF
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
