"use client";
import { useRef, useState } from "react";
import { Product, LabelConfig } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Download } from "lucide-react";

// 👇 nuevo import centralizado
import { exportHtmlLabel } from "@/lib/api";

interface PrintExportProps {
  product: Product;
  config: LabelConfig;
}

export function PrintExport({ product, config }: PrintExportProps) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [exporting, setExporting] = useState<boolean>(false);

  // Utilidad: mm -> px (aprox. 96dpi)
  const mmToPx = (mm: number) => Math.round((mm * 96) / 25.4);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const w = window.open("", "", "width=900,height=700");
    if (!w) return;

    const widthPx = mmToPx(config.width);
    const heightPx = mmToPx(config.height);
    const styles = `
      <style>
        @page { size: ${widthPx}px ${heightPx}px; margin: 0; }
        body, html { margin:0; padding:0; }
      </style>
    `;

    w.document.write(`${styles}${printContent.innerHTML}`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  // 🔁 NUEVO: Exportar “HTML” -> llama a API centralizada (descarga o imprime según backend)
  const handleExportPNG_Html = async () => {
    try {
      setExporting(true);

      const result = await exportHtmlLabel(product, config);

      if (result.type === "blob") {
        // Laptop (DEV): descargar .epl
        const { blob } = result;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `etiqueta-${Date.now()}.epl`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Server (PROD): impresión directa confirmada por backend
        alert("Impresión enviada a Zebra.");
      }
    } catch (err: any) {
      console.error("[ExportHtml] error:", err);
      alert(err?.message || "No se pudo exportar/imprimir la etiqueta");
    } finally {
      setExporting(false);
    }
  };

  // Exportar PNG “ligero” dibujando texto en canvas (tu versión existente)
  const handleExportPNG_Canvas = () => {
    const widthPx = mmToPx(config.width);
    const heightPx = mmToPx(config.height);
    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fondo
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto
    ctx.fillStyle = config.textColor;
    ctx.textAlign = "center";
    const padding = 10;
    const lineHeight = config.fontSize + 4;
    let y = padding + config.fontSize;

    const lines: string[] = [];
    if (config.showProductName) lines.push((product as any).nombre as string);
    if (config.showGenericName) lines.push((product as any).descripcion as string);
    if (config.showDosage) lines.push(`Talla: ${(product as any).dosage}`);
    if (config.showBatch) lines.push(`Código: ${(product as any).codigo}`);
    if (config.showExpiry) lines.push(`Venc: ${(product as any).expiryDate}`);
    if (config.showManufacturer) lines.push((product as any).laboratorio as string);
    if (config.showPrice) {
      const precio = (product as any).precio as number | undefined;
      const precioStr = typeof precio === "number" ? `$ ${precio.toLocaleString("es-CL")}` : "-";
      lines.push(precioStr);
    }

    lines.forEach((line) => {
      ctx.font = `${config.fontSize}px Arial`;
      ctx.fillText(line, canvas.width / 2, y);
      y += lineHeight;
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `label_${(product as any).id}_${Date.now()}.png`;
    link.click();
  };

  const widthPx = mmToPx(config.width);
  const heightPx = mmToPx(config.height);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imprimir y Exportar</CardTitle>
        <CardDescription>Imprime etiquetas o expórtalas como imagen / EPL</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Contenedor a imprimir/exportar */}
        <div
          ref={printRef}
          style={{
            width: `${widthPx}px`,
            height: `${heightPx}px`,
            background: config.backgroundColor,
            color: config.textColor,
            padding: 12,
            border: '1px dashed #e5e7eb',
            borderRadius: 6,
          }}
        >
          {config.showProductName && <div style={{ fontWeight: 700 }}>{(product as any).nombre}</div>}
          {config.showGenericName && <div>{(product as any).descripcion}</div>}
          {config.showDosage && <div>Talla: {(product as any).dosage}</div>}
          {config.showManufacturer && <div>Lab: {(product as any).laboratorio}</div>}
          {config.showBatch && <div>Código: {(product as any).codigo}</div>}
          {config.showExpiry && <div>Venc: {(product as any).expiryDate}</div>}
          {config.showPrice && (
            <div style={{ fontSize: config.fontSize + 2 }}>
              {typeof (product as any).precio === "number"
                ? `$ ${(product as any).precio.toLocaleString("es-CL")}`
                : "-"}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-4 flex gap-2">
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir etiqueta
          </Button>

          {/* Exportar ZPL/EPL desde el backend */}
          <Button variant="secondary" onClick={handleExportPNG_Html} disabled={exporting}>
            {exporting ? "Procesando…" : "Exportar ZPL (HTML)"}
          </Button>

          {/* Export ligero a PNG por canvas */}
          <Button variant="outline" onClick={handleExportPNG_Canvas}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PNG (Canvas)
          </Button>
        </div>

        {/* Cantidad informativa */}
        <div className="mt-3">
          <Label htmlFor="qty">Cantidad a imprimir</Label>
          <Input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
          />
          <p className="text-xs text-gray-500 mt-1">
            Nota: establece el número de copias en el diálogo de tu impresora.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}