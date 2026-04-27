'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { FileJson, Database, UploadCloud } from 'lucide-react';

export function TabDatabaseRead() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedWithOffer, setSelectedWithOffer] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const ITEMS_PER_PAGE = 10;

  // =============================
  // DATA DERIVADA (⬅️ MOVIDA ARRIBA)
  // =============================
  const productosConOferta = data?.conOferta?.items ?? [];
  const productosSinOferta = data?.sinOferta?.items ?? [];
  const filteredProductosConOferta = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return productosConOferta;

    return productosConOferta.filter((p: any) =>
      [p.descripcion, p.sku, p.ean13]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [productosConOferta, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProductosConOferta.length / ITEMS_PER_PAGE));
  const paginatedProductosConOferta = filteredProductosConOferta.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const selectedProducts = productosConOferta.filter((p: any) =>
    selectedWithOffer.has(String(p.sku))
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, productosConOferta.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =============================
  // 🔵 LEER CENTRALIZADO
  // =============================
  const handleLeerCentralizado = async () => {
    try {
      setLoading(true);

      const res = await fetch('http://localhost:3000/api/pai/leer-centralizado', {
        headers: {
          'x-api-token': 'MI_TOKEN_DEMO_123'
        }
      });

      const json = await res.json();
      console.log('CENTRALIZADO:', json);
      setData(json);
      setSelectedWithOffer(new Set());
      setSearchTerm('');
      setCurrentPage(1);

    } catch (err) {
      console.error(err);
      alert('Error leyendo centralizado');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🟢 CARGAR A ORACLE
  // =============================
  const handleCargarOracle = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (file: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:3000/api/pai/cargar-excel', {
        method: 'POST',
        headers: {
          'x-api-token': 'MI_TOKEN_DEMO_123',
          'x-user': 'frontend-user'
        },
        body: formData
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message);
        return;
      }

      alert(`✔ ${json.insertados} SKUs cargados a Oracle`);
    } catch (err) {
      console.error(err);
      alert('Error subiendo archivo');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🖨️ IMPRIMIR MASIVO
  // =============================
const handlePrintSelected = async () => {
  if (loading) return;

  try {
    const seleccionados = productosConOferta.filter((p: any) =>
      selectedWithOffer.has(String(p.sku))
    );

    if (seleccionados.length === 0) {
      alert('Selecciona al menos un producto');
      return;
    }

    setLoading(true);

	const payload = seleccionados.map((p: any) => ({
	  producto: p.descripcion,
	  sku: p.sku,
	  ean13: p.ean13,                 // ✅ nombre real
	  unidadMedida: p.unidadMedida,   // ✅ nombre real
	  precioNormal: p.precioNormal,
	  precioUnitario: p.precioUnitario,
	  precioOferta: p.precioOferta,
	  validoHasta: p.vigenciaFin,     // ✅ nombre real
	  cantidad: 1
	}));

    console.log('TabDatabaseRead PAYLOAD', payload);

    const res = await fetch('http://localhost:3000/api/labels/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': 'MI_TOKEN_DEMO_123'
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!result.ok) {
      throw new Error('Error imprimiendo');
    }

    alert(`✔ ${payload.length} etiquetas enviadas`);
    setSelectedWithOffer(new Set());

  } catch (err) {
    console.error(err);
    alert('Error imprimiendo');
  } finally {
    setLoading(false);
  }
};

const handlePrintAll = async () => {
  if (loading) return;

  if (productosConOferta.length === 0) {
    alert('No hay productos para imprimir');
    return;
  }

  try {
    setLoading(true);

    const payload = productosConOferta.map((p: any) => ({
      producto: p.descripcion,
      sku: p.sku,
      ean13: p.ean13,
      unidadMedida: p.unidadMedida,
      precioNormal: p.precioNormal,
      precioUnitario: p.precioUnitario,
      precioOferta: p.precioOferta,
      validoHasta: p.vigenciaFin,
      cantidad: 1
    }));

    const res = await fetch('http://localhost:3000/api/labels/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': 'MI_TOKEN_DEMO_123'
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!result.ok) {
      throw new Error('Error imprimiendo todo');
    }

    alert(`✔ ${payload.length} etiquetas enviadas`);
  } catch (err) {
    console.error(err);
    alert('Error imprimiendo');
  } finally {
    setLoading(false);
  }
};

	
	const selectAll = () => {	  
      const all = new Set<string>(selectedWithOffer);
      filteredProductosConOferta.forEach((p: any) => all.add(String(p.sku)));
	  setSelectedWithOffer(all);
	};

	const clearAll = () => {
	  setSelectedWithOffer(new Set());
	};

  // =============================
  // SELECCIÓN
  // =============================
  const toggle = (sku: string) => {
    const next = new Set(selectedWithOffer);
    next.has(sku) ? next.delete(sku) : next.add(sku);
    setSelectedWithOffer(next);
  };

	// =============================
	// EXPORTAR SIN OFERTA (CSV)
	// =============================
	const handleExportSinOferta = () => {
	  if (productosSinOferta.length === 0) {
		alert('No hay productos para exportar');
		return;
	  }

	  const headers = ['sku', 'descripcion'];

	  const rows = productosSinOferta.map((p: any) => [
		p.sku,
		p.descripcion
	  ]);

	  const csvContent = [
		headers.join(','),		
		...rows.map((row: string[]) =>
		  row.map((value: string) =>
			`"${value.replace(/"/g, '""')}"`
		   ).join(',')
		)
	  ].join('\n');

	  const blob = new Blob([csvContent], {
		type: 'text/csv;charset=utf-8;'
	  });

	  const url = URL.createObjectURL(blob);
	  const link = document.createElement('a');

	  link.href = url;
	  link.download = 'productos_sin_oferta.csv';
	  link.click();

	  URL.revokeObjectURL(url);
	};
	
  // =============================
  // UI
  // =============================
  return (
    <div className="space-y-6">
      
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        ref={fileRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
      />

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-blue-600" />
            Leer Archivo Centralizado
          </CardTitle>
          <CardDescription>
            Flujo: Excel → Oracle → POS (DBF)
          </CardDescription>
        </CardHeader>

        <CardContent className="flex gap-3 flex-wrap">

          <Button onClick={handleLeerCentralizado} disabled={loading}>
            <Database className="h-4 w-4 mr-2" />
            {loading ? 'Cargando...' : 'Leer Centralizado'}
          </Button>

          <Button
            onClick={handleCargarOracle}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Cargar a Oracle
          </Button>
		  <Button onClick={selectAll}>Seleccionar filtrados</Button>
			<Button onClick={clearAll}>Limpiar</Button>
          <Button
            onClick={handlePrintAll}
            disabled={loading || productosConOferta.length === 0}
            className="bg-slate-700 hover:bg-slate-800"
          >
            Imprimir todos ({productosConOferta.length})
          </Button>

        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold">{data?.total || 0}</p>
          <p className="text-xs">Total</p>
        </CardContent></Card>

        <Card><CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold">{productosConOferta.length}</p>
          <p className="text-xs">Con Oferta</p>
        </CardContent></Card>

        <Card><CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold text-red-600">{productosSinOferta.length}</p>
          <p className="text-xs">Sin Oferta</p>
        </CardContent></Card>
      </div>
	  

      {/* CON OFERTA */}
      <Card>
        <CardHeader>
          <CardTitle>Productos CON Oferta ({productosConOferta.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descripcion, SKU o EAN13"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando {paginatedProductosConOferta.length} de {filteredProductosConOferta.length} productos filtrados
              </span>
              <span>
                Seleccionados: {selectedWithOffer.size}
              </span>
            </div>
          </div>

          {paginatedProductosConOferta.map((p: any) => (
            <div key={p.sku} className="flex items-center gap-3 border p-2 rounded">
              <Checkbox
                checked={selectedWithOffer.has(String(p.sku))}
                onCheckedChange={() => toggle(String(p.sku))}
              />
              <div className="flex-1">
                <p className="font-semibold">{p.descripcion}</p>
                <p className="text-xs">SKU: {p.sku}</p>
              </div>              
				<div className="text-right">
				  <p className="text-xs text-gray-500 line-through">
					Normal: ${p.precioNormal}
				  </p>

				  <p className="text-xs text-gray-600">
					Unitario: ${p.precioUnitario}
				  </p>

				  <p className="text-lg font-bold text-green-600">
					Oferta: ${p.precioOferta}
				  </p>
				</div>
            </div>
          ))}

          {filteredProductosConOferta.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
              No se encontraron productos con ese criterio de búsqueda.
            </div>
          )}

          {filteredProductosConOferta.length > 0 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedProducts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">
              Productos listos para imprimir ({selectedProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {selectedProducts.map((p: any) => (
              <div
                key={p.sku}
                className="rounded-full border border-blue-200 bg-white px-3 py-1 text-sm text-blue-900"
              >
                {p.descripcion} ({p.sku})
              </div>
            ))}
          </CardContent>
        </Card>
      )}
	  <div className="flex justify-end mt-4">
        <div className="flex gap-3">
		  <Button
            variant="outline"
			disabled={loading || productosConOferta.length === 0}
			onClick={handlePrintAll}
		  >
			Imprimir todos ({productosConOferta.length})
		  </Button>
          <Button
            disabled={selectedWithOffer.size === 0 || loading}
            onClick={handlePrintSelected}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Imprimir seleccionados ({selectedWithOffer.size})
          </Button>
        </div>
		</div>
	  

      {/* SIN OFERTA */}
      <Card className="border-red-500 border-2 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">
            Productos SIN Oferta ({productosSinOferta.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productosSinOferta.map((p: any) => (
			<div key={p.sku} className="border p-2 rounded bg-red-100 flex justify-between items-center">
			  <div>
				<p className="font-semibold text-red-900">{p.descripcion}</p>
				<p className="text-xs text-red-700">SKU: {p.sku}</p>
			  </div>

			  <div className="text-right">
				<p className="text-sm font-bold text-red-700">
				  ${p.precioNormal}
				</p>

				<p className="text-xs text-red-600">
				  Unitario: ${p.precioUnitario}
				</p>
			  </div>
			</div>
          ))}
        </CardContent>
      </Card>
	  <div className="flex justify-end mb-3">
		  <Button
			onClick={handleExportSinOferta}
			className="bg-red-600 hover:bg-red-700"
		  >
			Exportar CSV Sin Oferta
		  </Button>
		</div>

    </div>
  );
}
