'use client';

import { useState } from 'react';
import { Product, defaultLabelConfig } from '@/lib/product';
import type { LabelConfig } from '@/lib/product';

import { ConfigPanel } from '@/components/config-panel';
import { ProductSearch } from '@/components/product-search';
import { LabelBuilder } from '@/components/label-builder';
import { PrintExport } from '@/components/print-export';
import { TabDatabaseRead } from '@/components/tab-database-read';
import { TabFileUpload } from '@/components/tab-file-upload';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {

const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

const [labelConfig, setLabelConfig] =
useState<LabelConfig>(defaultLabelConfig)

const [activeMenu, setActiveMenu] =
useState<'manual' | 'database' | 'file'>('manual')

return (

<main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

{/* HEADER */}

<header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

<div className="flex items-center gap-3">

<div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">

<span className="text-white font-bold text-lg">Fa</span>

</div>

<div>

<h1 className="text-2xl font-bold text-gray-900">
Impresión de Etiquetas
</h1>

<p className="text-sm text-gray-500">
Farmacias Ahumada
</p>

</div>

</div>

</div>

</header>

{/* MENU */}

<div className="border-b border-gray-200 bg-white sticky top-16 z-40">

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<Tabs
value={activeMenu}
onValueChange={(val) =>
setActiveMenu(val as 'manual' | 'database' | 'file')
}
className="w-full"
>

<TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent">

<TabsTrigger value="manual">
Búsqueda Manual
</TabsTrigger>

<TabsTrigger value="database">
Leer Archivo Centralizado
</TabsTrigger>

<TabsTrigger value="file">
Cargar Archivo Etiqueta
</TabsTrigger>

</TabsList>

</Tabs>

</div>

</div>

{/* CONTENIDO */}

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

{/* MENU MANUAL */}

{activeMenu === 'manual' && (

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

{/* SIDEBAR */}

<div className="lg:col-span-1 space-y-6">

<ProductSearch
selectedProduct={selectedProduct}
onProductSelect={setSelectedProduct}
/>

<Tabs defaultValue="config">

<TabsList className="grid w-full grid-cols-2">

<TabsTrigger value="config">
Configuración
</TabsTrigger>

<TabsTrigger value="builder">
Constructor
</TabsTrigger>

</TabsList>

<TabsContent value="config" className="mt-4">

<ConfigPanel
config={labelConfig}
onConfigChange={setLabelConfig}
/>

</TabsContent>

<TabsContent value="builder" className="mt-4">

<LabelBuilder
product={selectedProduct}
config={labelConfig}
onConfigChange={setLabelConfig}
/>

</TabsContent>

</Tabs>

</div>

{/* IMPRESION */}

<div className="lg:col-span-2 space-y-6">

<PrintExport
product={selectedProduct}
config={labelConfig}
/>

{/* INFO PRODUCTO */}

{selectedProduct && (

<div className={`rounded-lg p-6 border ${
selectedProduct.oferta
? 'bg-red-50 border-red-200'
: 'bg-blue-50 border-blue-200'
}`}>

<h3 className="font-semibold text-gray-900 mb-3">
Configuración Actual de Etiqueta
</h3>

<div className="grid grid-cols-2 gap-4 text-sm">

<div>

<span className="text-gray-600">
Producto
</span>

<p className="font-semibold">

{selectedProduct.nombre}

</p>

</div>

<div>

<span className="text-gray-600">
Stock
</span>

<p className="font-semibold">

{selectedProduct.stock} unidades

</p>

</div>

<div>

<span className="text-gray-600">
Precio
</span>

<p className="font-semibold">

{selectedProduct.precioOferta
? `Oferta $${selectedProduct.precioOferta.toLocaleString('es-CL')}`
: `$${selectedProduct.precioUnitario.toLocaleString('es-CL')}`
}

</p>

</div>

</div>

</div>

)}

</div>

</div>

)}

{/* MENU BD */}

{activeMenu === 'database' && (

	<TabDatabaseRead/>

)}

{/* MENU ARCHIVO */}

{activeMenu === 'file' && (

<TabFileUpload
onPrint={(skus) => {

console.log('Imprimiendo desde archivo:', skus)

alert(`Enviando ${skus.length} etiqueta(s)`)

}}
/>

)}

</div>

</main>

)
}