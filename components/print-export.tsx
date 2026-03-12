'use client'

import { useRef, useState } from 'react'
import { Product, LabelConfig } from '@/lib/mock-data'
import { validateLabelConfig } from '@/lib/validation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Printer, Download, CheckCircle, AlertCircle } from 'lucide-react'

interface PrintExportProps {
  product: Product | null
  config: LabelConfig
}

export function PrintExport({ product, config }: PrintExportProps) {

  const printRef = useRef<HTMLDivElement>(null)

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Imprimir</CardTitle>
          <CardDescription>Selecciona un producto</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const p: Product = product

  const precioFinal = p.precioOferta ?? p.precioUnitario ?? 0

  const tieneOferta =
    p.precioOferta &&
    p.precioUnitario &&
    p.precioOferta < p.precioUnitario

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
  // IMPRIMIR NORMAL
  // -------------------------

  function handlePrint() {

    if (!validate()) return

    const content = printRef.current
    if (!content) return

    const win = window.open('', '', 'width=800,height=600')

    if (!win) return

    win.document.write(`
      <html>
      <head>
      <title>Imprimir Etiqueta</title>
      <style>
      body{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        justify-content:center;
        font-family:Arial;
      }
      </style>
      </head>
      <body>
      ${content.innerHTML.repeat(quantity)}
      </body>
      </html>
    `)

    win.document.close()
    win.print()
  }

  // -------------------------
  // IMPRIMIR ZPL (ZEBRA)
  // -------------------------
	async function handlePrintZPL() {

  if (!product) return

  const sku = (product as any).sku ?? p.codigo
  const codigoBarras = (product as any).ean13 ?? sku

  const payload = {
    precioAntes: p.precioUnitario,
    precioAhora: p.precioOferta ?? p.precioUnitario,
    producto: p.descripcion,
    subtitulo: p.descripcion,
    sku,
    codigoBarras,
    cantidad: quantity
  }

  try {

    const res = await fetch("http://localhost:3000/api/labels/print", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": "MI_TOKEN_DEMO_123"
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

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
  // EXPORTAR PNG
  // -------------------------

  function handleExportPNG() {

    const canvas = document.createElement('canvas')

    const mmToPx = 3.78

    canvas.width = config.width * mmToPx
    canvas.height = config.height * mmToPx

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = config.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = config.textColor
    ctx.textAlign = 'center'

    let y = 40

    const lines: string[] = []

    lines.push(p.descripcion ?? '')
    lines.push(`SKU: ${p.codigo}`)

    if (tieneOferta) {

      lines.push(`Normal: $${p.precioUnitario}`)
      lines.push(`Oferta: $${p.precioOferta}`)

    } else {

      lines.push(`$${precioFinal}`)

    }

    lines.forEach((line, i) => {

      const size = i === 0 ? config.fontSize + 2 : config.fontSize

      ctx.font = `${size}px Arial`

      ctx.fillText(line, canvas.width / 2, y)

      y += config.fontSize + 10

    })

    const link = document.createElement('a')

    link.href = canvas.toDataURL('image/png')
    link.download = `label_${p.codigo}.png`

    link.click()
  }

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
            {validationErrors.join(', ')}
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

        <div className="grid grid-cols-3 gap-2">

          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Printer className="mr-2 h-4 w-4"/>
            Imprimir
          </Button>

          <Button
            onClick={handlePrintZPL}
            variant="outline"
          >
            Imprimir Zebra
          </Button>

          <Button
            onClick={handleExportPNG}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4"/>
            Exportar PNG
          </Button>

        </div>

        {/* TEMPLATE OCULTO */}

        <div ref={printRef} style={{ display: 'none' }}>

          <div
            style={{
              width: `${config.width}mm`,
              height: `${config.height}mm`,
              backgroundColor: config.backgroundColor,
              color: config.textColor,
              fontFamily: 'Arial',
              fontSize: `${config.fontSize}px`,
              textAlign: 'center',
              padding: '8px',
              border: '1px solid #ccc'
            }}
          >

            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {p.descripcion}
            </div>

            <div>
              SKU: {p.codigo}
            </div>

            {tieneOferta ? (

              <>
                <div style={{ textDecoration: 'line-through', color: '#666' }}>
                  ${p.precioUnitario}
                </div>

                <div style={{ color: 'red', fontWeight: 'bold' }}>
                  ${p.precioOferta}
                </div>
              </>

            ) : (

              <div style={{ fontWeight: 'bold' }}>
                ${precioFinal}
              </div>

            )}

          </div>

        </div>

      </CardContent>

    </Card>

  )
}