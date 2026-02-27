"use client";

import { useRef, useState } from "react";
import { Product, LabelConfig } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Download } from "lucide-react";

interface PrintExportProps {
  product: Product;
  config: LabelConfig;
}

export function PrintExport({ product, config }: PrintExportProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [qty, setQty] = useState<number>(1);
  const [exporting, setExporting] = useState(false);

  // Utilidad: mm -> px (aprox. 96dpi)
  const mmToPx = (mm: number) => Math.round((mm * 96) / 25.4);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const w = window.open("", "", "width=900,height=700");
    if (!w) return;

    // Estilos mínimos para respetar tamaño de etiqueta
    const widthPx = mmToPx(config.width);
    const heightPx = mmToPx(config.height);
    const styles = `
      <style>
        @page { size: ${config.width}mm ${config.height}mm; margin: 0; }
        body { margin: 0; }
        .label-root {
          width: ${widthPx}px;
          height: ${heightPx}px;
          background: ${config.backgroundColor};
          color: ${config.textColor};
          font-size: ${config.fontSize}px;
          font-family: Arial, Roboto, "Segoe UI", sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8px;
          box-sizing: border-box;
        }
        .line { margin: 2px 0; text-align: center; }
        .price { font-weight: 700; font-size: ${Math.max(config.fontSize + 4, 14)}px; }
      </style>
    `;

    // Si quieres imprimir múltiples copias, el diálogo de la impresora normalmente lo permite.
    // Aquí imprimimos el contenido una vez.
    w.document.write(
      `<!doctype html><html><head><meta charset="utf-8" />${styles}</head><body>${printContent.innerHTML}</body></html>`
    );
    w.document.close();
    // Espera a que renderice antes de disparar print
    w.focus();
    w.print();
    w.close();
  };

  // Exportar PNG usando html2canvas (copia fiel del HTML)
  const handleExportPNG_Html = async () => {
  try {
    setExporting(true);

    if (typeof window === "undefined") {
      throw new Error("Esta acción requiere entorno de navegador.");
    }

    const element = printRef.current as HTMLElement | null;
    if (!element) throw new Error("No se encontró el contenedor de la etiqueta.");

    // Import dinámico (sólo cliente)
    const { default: html2canvas } = await import("html2canvas");

    // Opciones compatibles con distintos typings
    const opts: any = {
      scale: 2,
      useCORS: true,
    };

    // Si tu runtime soporta backgroundColor (transparencia), úsalo.
    // Si tus typings son antiguos, evita el error usando 'background'.
    try {
      (opts as any).backgroundColor = null; // transparencia
    } catch {
      (opts as any).background = undefined; // equivalente en algunos builds
    }

    const canvas = await html2canvas(element, opts);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `label_${product.id}_${Date.now()}.png`;
    link.click();
  } catch (error) {
    console.error("Error exportando PNG:", error);
  } finally {
    setExporting(false);
  }
}; 
  

  // Exportar PNG “vectorizado simple” (pinta texto a mano sobre un canvas)
  // Útil como alternativa ligera si no necesitas snapshot fiel del HTML.
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
    if (config.showProductName) lines.push(product.nombre);
    if (config.showGenericName) lines.push(product.descripcion);
    if (config.showDosage) lines.push(`Talla: ${product.dosage}`);
    if (config.showBatch) lines.push(`Código: ${product.codigo}`);
    if (config.showExpiry) lines.push(`Venc: ${product.expiryDate}`);
    if (config.showManufacturer) lines.push(product.laboratorio);  
	if (config.showPrice) {
	  const precioStr =
		typeof product.precio === "number"
		  ? `$ ${product.precio.toLocaleString("es-CL")}`
		  : "-";
	  lines.push(precioStr);
	}  
  

    lines.forEach((line) => {
      ctx.font = `${config.fontSize}px Arial`;
      ctx.fillText(line, canvas.width / 2, y);
      y += lineHeight;
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `label_${product.id}_${Date.now()}.png`;
    link.click();
  };

  const widthPx = mmToPx(config.width);
  const heightPx = mmToPx(config.height);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imprimir y Exportar</CardTitle>
        <CardDescription>Imprime etiquetas o expórtalas como imagen</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Contenido a imprimir/exportar */}
        <div
          ref={printRef}
          className="label-root"
          style={{
            width: widthPx,
            height: heightPx,
            background: config.backgroundColor,
            color: config.textColor,
            fontSize: config.fontSize,
            fontFamily: "Arial, Roboto, Segoe UI, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            boxSizing: "border-box",
            border: "1px dashed #ddd",
            marginBottom: 12,
          }}
        >
          {config.showProductName && (
            <div className="line" style={{ fontWeight: 600 }}>
              {product.nombre}
            </div>
          )}
          {config.showGenericName && (
            <div className="line">{product.descripcion}</div>
          )}
          {config.showDosage && (
            <div className="line">Talla: {product.dosage}</div>
          )}
          {config.showManufacturer && (
            <div className="line">Lab: {product.laboratorio}</div>
          )}
          {config.showBatch && (
            <div className="line">Código: {product.codigo}</div>
          )}
          {config.showExpiry && (
            <div className="line">Venc: {product.expiryDate}</div>
          )}		  
		  {config.showPrice && (
			  <div className="line price">
				{typeof product.precio === 'number'
				  ? `$ ${product.precio.toLocaleString("es-CL")}`
				  : "-"}
			  </div>
			)}
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button onClick={handlePrint} variant="default">
            <Printer size={16} style={{ marginRight: 6 }} />
            Imprimir etiqueta
          </Button>

          {/* Export fiel al HTML (html2canvas) */}
          <Button onClick={handleExportPNG_Html} variant="secondary" disabled={exporting}>
            <Download size={16} style={{ marginRight: 6 }} />
            {exporting ? "Generando PNG…" : "Exportar PNG (HTML)"}
          </Button>

          {/* Export “ligero” dibujando texto en canvas */}
          <Button onClick={handleExportPNG_Canvas} variant="outline">
            <Download size={16} style={{ marginRight: 6 }} />
            Exportar PNG (Canvas)
          </Button>
        </div>

        {/* Cantidad (informativo: usa el diálogo de la impresora para copias) */}
        <div style={{ marginTop: 12, maxWidth: 240 }}>
          <Label htmlFor="qty">Cantidad a imprimir</Label>
          <Input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
          />
          <div style={{ color: "#666", fontSize: 12, marginTop: 6 }}>
            Nota: establece el número de copias en el diálogo de tu impresora.
          </div>
        </div>

        {/* Info */}
        <div
          style={{
            background: "#f7f7f7",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
          }}
        >
          <strong>Consejos para imprimir:</strong>
          <ul style={{ marginTop: 6, paddingLeft: 20 }}>
            <li>Ajusta el tamaño de papel a {config.width}×{config.height} mm.</li>
            <li>Usa papel adhesivo/etiquetas del tamaño configurado.</li>
            <li>Prueba primero en papel normal.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}