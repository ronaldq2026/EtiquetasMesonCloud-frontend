'use client';

import { useRef } from 'react';
import { Product, LabelConfig } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, Download } from 'lucide-react';

interface PrintExportProps {
  product: Product;
  config: LabelConfig;
}

export function PrintExport({ product, config }: PrintExportProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    `;

    printWindow.document.write(
      '<html><head>' +
      '<title>Imprimir Etiqueta</title>' +
      styles +
      '</head><body>' +
      printContent.innerHTML +
      '</body></html>'
    );
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = async () => {
    try {
      // Using html2pdf library approach or canvas-based approach
      const element = printRef.current;
      if (!element) return;

      // Create canvas from HTML
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `label_${product.id}_${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Error downloading label:', error);
      // Fallback: just trigger print dialog
      handlePrint();
    }
  };

  // Simple PNG export using Canvas API
  const handleExportPNG = () => {
    const canvas = document.createElement('canvas');
    const mmToPx = 3.78; // Approximate conversion
    canvas.width = config.width * mmToPx;
    canvas.height = config.height * mmToPx;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.fillStyle = config.textColor;
    ctx.font = `${config.fontSize}px Arial`;
    ctx.textAlign = 'center';

    const padding = 10;
    const lineHeight = config.fontSize + 4;
    let y = padding + config.fontSize;

    const lines: string[] = [];
    if (config.showProductName) lines.push(product.nombre);
    if (config.showGenericName) lines.push(product.descripcion);
    if (config.showDosage) lines.push(`Talla: ${product.dosage}`);
    if (config.showBatch) lines.push(`Código: ${product.codigo}`);
    if (config.showExpiry) lines.push(`Venc: ${product.expiryDate}`);
    if (config.showManufacturer) lines.push(product.laboratorio);
    if (config.showPrice) lines.push(`$${product.precio.toLocaleString('es-CL')}`);

    lines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, y);
      y += lineHeight;
    });

    // Download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `label_${product.id}_${Date.now()}.png`;
    link.click();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Imprimir y Exportar</CardTitle>
        <CardDescription>Imprime etiquetas o exporta como imagen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden print content */}
        <div ref={printRef} style={{ display: 'none' }}>
          <div
            style={{
              width: `${config.width}mm`,
              height: `${config.height}mm`,
              backgroundColor: config.backgroundColor,
              color: config.textColor,
              padding: '12px',
              fontFamily: 'Arial',
              fontSize: `${config.fontSize}px`,
              textAlign: 'center',
              border: '1px solid #ccc',
            }}
          >
            {config.showProductName && <div style={{ fontWeight: 'bold' }}>{product.nombre}</div>}
            {config.showGenericName && <div style={{ fontSize: '0.8em', fontStyle: 'italic' }}>{product.descripcion}</div>}
            {config.showDosage && <div style={{ fontWeight: 'bold' }}>Talla: {product.dosage}</div>}
            {config.showManufacturer && <div style={{ fontSize: '0.8em' }}>Lab: {product.laboratorio}</div>}
            {config.showBatch && <div style={{ fontSize: '0.8em' }}>Código: {product.codigo}</div>}
            {config.showExpiry && <div style={{ fontSize: '0.8em' }}>Venc: {product.expiryDate}</div>}
            {config.showPrice && <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>$ {product.precio.toLocaleString('es-CL')}</div>}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Print Button */}
        <Button
          onClick={handlePrint}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Etiqueta
        </Button>

        {/* Export Button */}
        <Button
          onClick={handleExportPNG}
          variant="outline"
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar como PNG
        </Button>

        {/* Quantity Input */}
        <div className="space-y-2 border-t pt-4">
          <Label htmlFor="quantity" className="text-sm">
            Cantidad a Imprimir
          </Label>
          <Input
            id="quantity"
            type="number"
            defaultValue="1"
            min="1"
            max="100"
            className="text-sm"
          />
          <p className="text-xs text-gray-500">
            Nota: Imprime múltiples copias desde la configuración de tu impresora
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700 space-y-1">
          <p><strong>Consejos para imprimir:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ajusta la configuración para papel adhesivo o etiquetas</li>
            <li>Prueba primero en papel normal</li>
            <li>Usa plantilla de etiqueta que coincida con tu tamaño</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
