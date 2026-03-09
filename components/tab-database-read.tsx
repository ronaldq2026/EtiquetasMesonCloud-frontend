'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FileJson } from 'lucide-react'

interface Product {
  codigo: string
  nombre: string
  precioLista: number
  precioOferta?: number | null
  enOferta: boolean
}

interface Props {
  onPrint?: (skus: string[]) => void
}

export function TabDatabaseRead({ onPrint }: Props) {

  const [products, setProducts] = useState<Product[]>([])
  const [selectedWithOffer, setSelectedWithOffer] = useState<Set<string>>(new Set())
  const [selectAllWithOffer, setSelectAllWithOffer] = useState(false)

  useEffect(() => {

    fetch("http://localhost:3000/api/pai/leer-centralizado")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))

  }, [])

  const productsWithOffer = useMemo(
    () => products.filter(p => p.enOferta),
    [products]
  )

  const productsWithoutOffer = useMemo(
    () => products.filter(p => !p.enOferta),
    [products]
  )

  const toggleWithOffer = (codigo: string) => {

    const newSelected = new Set(selectedWithOffer)

    if (newSelected.has(codigo)) {
      newSelected.delete(codigo)
    } else {
      newSelected.add(codigo)
    }

    setSelectedWithOffer(newSelected)
    setSelectAllWithOffer(newSelected.size === productsWithOffer.length)

  }

  const toggleSelectAllWithOffer = () => {

    if (selectAllWithOffer) {

      setSelectedWithOffer(new Set())
      setSelectAllWithOffer(false)

    } else {

      setSelectedWithOffer(new Set(productsWithOffer.map(p => p.codigo)))
      setSelectAllWithOffer(true)

    }
  }

  const handlePrint = () => {

    const skus = Array.from(selectedWithOffer)

    if (skus.length === 0) {
      alert("Selecciona productos")
      return
    }

    onPrint?.(skus)

  }

  return (

    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-blue-600"/>
            Lectura del Archivo Maestro Centralizado
          </CardTitle>

          <CardDescription>
            Productos obtenidos desde DBF + archivo centralizado
          </CardDescription>
        </CardHeader>
      </Card>

      {/* CON OFERTAS */}

      <Card>

        <CardHeader className="border-b">

          <div className="flex justify-between">

            <CardTitle>
              Productos CON Ofertas ({productsWithOffer.length})
            </CardTitle>

            <div className="flex gap-2 items-center">

              <Checkbox
                checked={selectAllWithOffer}
                onCheckedChange={toggleSelectAllWithOffer}
              />

              <span className="text-sm">Seleccionar todo</span>

            </div>

          </div>

        </CardHeader>

        <CardContent className="pt-6">

          <div className="space-y-3">

            {productsWithOffer.map(product => (

              <div key={product.codigo} className="flex gap-3 p-3 border rounded-lg">

                <Checkbox
                  checked={selectedWithOffer.has(product.codigo)}
                  onCheckedChange={() => toggleWithOffer(product.codigo)}
                />

                <div className="flex-1">

                  <p className="font-semibold text-sm">
                    {product.nombre}
                  </p>

                  <p className="text-xs text-gray-600">

                    SKU: {product.codigo}

                  </p>

                </div>

                <div className="text-right">

                  <p className="text-xs line-through text-gray-400">

                    ${product.precioLista.toLocaleString("es-CL")}

                  </p>

                  <p className="font-bold text-green-600">

                    ${product.precioOferta?.toLocaleString("es-CL")}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </CardContent>

      </Card>

      {/* SIN OFERTAS */}

      <Card className="border-red-400 border-2 bg-red-50">

        <CardHeader>

          <CardTitle className="text-red-700">

            Productos SIN Ofertas ({productsWithoutOffer.length})

          </CardTitle>

        </CardHeader>

        <CardContent className="pt-6">

          <div className="space-y-3">

            {productsWithoutOffer.map(product => (

              <div key={product.codigo} className="flex justify-between p-3 border rounded-lg">

                <div>

                  <p className="font-semibold text-red-900">

                    {product.nombre}

                  </p>

                  <p className="text-xs text-red-700">

                    SKU: {product.codigo}

                  </p>

                </div>

                <p className="font-bold text-red-900">

                  ${product.precioLista.toLocaleString("es-CL")}

                </p>

              </div>

            ))}

          </div>

        </CardContent>

      </Card>

      <Button
        onClick={handlePrint}
        disabled={selectedWithOffer.size === 0}
        className="bg-blue-600 hover:bg-blue-700"
      >

        Imprimir Seleccionados ({selectedWithOffer.size})

      </Button>

    </div>
  )
}