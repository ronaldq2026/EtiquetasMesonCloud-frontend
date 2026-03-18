//print-export.tsx
'use client'

import { useState } from "react"
import { Product, LabelConfig } from "@/lib/product"
import { validateLabelConfig } from "@/lib/validation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Printer, CheckCircle, AlertCircle } from "lucide-react"

interface PrintExportProps {
product: Product | null
config: LabelConfig
}

export function PrintExport({ product, config }: PrintExportProps) {

const [validationErrors, setValidationErrors] = useState<string[]>([])
const [quantity, setQuantity] = useState(1)
const [previewUrl, setPreviewUrl] = useState<string | null>(null)

if (!product) {
return ( <Card> <CardHeader> <CardTitle>Imprimir</CardTitle> <CardDescription>Selecciona un producto</CardDescription> </CardHeader> </Card>
)
}

const p: Product = product

function validate() {
const errors = validateLabelConfig(config)

if (errors.length > 0) {
  setValidationErrors(errors.map(e => e.message))
  return false
}

setValidationErrors([])
return true
}

// -------------------------
// GENERAR PDF (PRINT BROWSER)
// -------------------------

function handlePrintPDF() {
if (!validate()) return

const html =
  "<html>" +
  "<head>" +
  "<title>Etiqueta</title>" +
  "<style>" +
  "body{margin:0;padding:20px;font-family:Arial;text-align:center}" +
  ".label{border:1px solid #ccc;padding:10px;margin:10px;display:inline-block;width:200px}" +
  ".price{font-size:20px;font-weight:bold}" +
  "</style>" +
  "</head>" +
  "<body>" +
  Array(quantity).fill(
    "<div class='label'>" +
    "<div>" + (p.descripcion ?? "") + "</div>" +
    "<div>SKU: " + p.codigo + "</div>" +
    "<div class='price'>$" + (p.precioOferta ?? p.precioUnitario ?? 0) + "</div>" +
    "</div>"
  ).join("") +
  "</body></html>"

const win = window.open("", "_blank")

if (!win) return

win.document.open()
win.document.write(html)
win.document.close()

win.focus()
win.print()
}

// -------------------------
// IMPRIMIR ZEBRA
// -------------------------

async function handlePrintZPL() {
		
const payload = {

  producto: p.descripcion,

  sku: p.codigo,
  ean13: p.codigoBarras,
  
  precioNormal: p.precioNormal,
  precioUnitario: p.precioUnitario,  
  precioOferta: p.precioOferta,

  validoHasta: p.expiryDate,

  cantidad: quantity
}

try {

console.log("PRINT PAYLOAD", payload)

const res = await fetch("http://localhost:3000/api/labels/print", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-token": "MI_TOKEN_DEMO_123"
  },
  body: JSON.stringify(payload)
})

const data = await res.json()

if (data.ok) {
  alert("Etiqueta enviada a Zebra 🖨️")
} else {
  alert("Error imprimiendo etiqueta")
}

} catch (err) {

console.error(err)
alert("No se pudo conectar con el servidor de impresión")
}
}

// -------------------------
// PREVIEW ZEBRA
// -------------------------

async function handlePreviewZPL() {

const payload = {

  producto: p.descripcion,

  sku: p.codigo,
  ean13: p.codigoBarras,
  
  precioNormal: p.precioNormal,
  precioUnitario: p.precioUnitario,  
  precioOferta: p.precioOferta,

  validoHasta: p.expiryDate,

  cantidad: quantity
}

try {

const res = await fetch("http://localhost:3000/api/labels/preview", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-token": "MI_TOKEN_DEMO_123"
  },
  body: JSON.stringify(payload)
})

const blob = await res.blob()

const url = URL.createObjectURL(blob)

setPreviewUrl(url)

} catch (err) {

console.error(err)
alert("No se pudo generar preview")
}
}

console.log("PRODUCT EN PRINTEXPORT", product)

return (

<Card>

  <CardHeader>
    <CardTitle>Imprimir y Exportar</CardTitle>
    <CardDescription>
      Genera etiquetas del producto seleccionado
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">

    {validationErrors.length > 0 ? (

      <div className="p-3 bg-red-50 border border-red-200 rounded flex gap-2 text-red-700">
        <AlertCircle size={16}/>
        {validationErrors.join(", ")}
      </div>

    ) : (

      <div className="p-3 bg-green-50 border border-green-200 rounded flex gap-2 text-green-700">
        <CheckCircle size={16}/>
        Configuración válida
      </div>

    )}

    <div className="space-y-2">

      <Label>Cantidad de etiquetas</Label>

      <Input
        type="number"
        min="1"
        max="200"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

    </div>

    {/* BOTONES */}
	
	<div className="flex gap-2">
	  <Button variant="default" onClick={handlePreviewZPL}>
		Vista Zebra
	  </Button>

	  <Button variant="outline" onClick={handlePrintZPL}>
		Zebra
	  </Button>

	  <Button variant="outline" onClick={handlePrintPDF}>
		<Printer className="mr-2 h-4 w-4" />
		PDF
	  </Button>
	</div>

    {/* PREVIEW ZEBRA */}

    {previewUrl && (

      <div className="border rounded p-4 flex justify-center">

        <img
          src={previewUrl}
          alt="Zebra Preview"
          style={{
            width: "300px",
            background: "white"
          }}
        />

      </div>

    )}

  </CardContent>

</Card>

)
}
