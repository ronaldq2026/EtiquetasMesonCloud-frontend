'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { FileText, AlertCircle } from 'lucide-react';

interface ParsedResult {
  conOferta: any[];
  sinOferta: any[];
  noEncontrados: string[];
  total: number;
}

export function TabFileUpload() {
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState<string>('');
  const [parseResult, setParseResult] = useState<ParsedResult | null>(null);

  const [selectedWithOffer, setSelectedWithOffer] = useState<Set<string>>(new Set());
  const [selectAllWithOffer, setSelectAllWithOffer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // =============================
  // DATA DERIVADA ✅
  // =============================
  const productosConOferta = parseResult?.conOferta ?? [];
  const productosSinOferta = parseResult?.sinOferta ?? [];
  const noEncontrados = parseResult?.noEncontrados ?? [];
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

  // ============================================
  // 🔵 LEER ETIQUERF
  // ============================================
  const handleLeerEtiqRF = async () => {
    try {
      setLoading(true);

      const res = await fetch('http://localhost:3000/api/pai/leer-etiquetarf', {
        headers: { 'x-api-token': 'MI_TOKEN_DEMO_123' }
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || 'Error leyendo ETIQUERF');
        return;
      }

      console.log('ETIQUERF:', json);

      // 👇 texto plano del archivo (opcional backend)
      if (json.raw) {
        setFileContent(json.raw);
      }

      setParseResult({
        conOferta: json.conOferta.items,
        sinOferta: json.sinOferta.items,
        noEncontrados: json.noEncontrados.items,
        total: json.total
      });

      setSelectedWithOffer(new Set());
      setSelectAllWithOffer(false);
      setSearchTerm('');
      setCurrentPage(1);

    } catch (err) {
      console.error(err);
      alert('Error leyendo ETIQUERF');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SELECCIÓN
  // ============================================
  const toggleWithOffer = (sku: string) => {
    const next = new Set(selectedWithOffer);
    next.has(sku) ? next.delete(sku) : next.add(sku);

    setSelectedWithOffer(next);
    setSelectAllWithOffer(next.size === filteredProductosConOferta.length && filteredProductosConOferta.length > 0);
  };

  const toggleSelectAllWithOffer = () => {
    if (selectAllWithOffer) {
      const next = new Set(selectedWithOffer);
      filteredProductosConOferta.forEach((p: any) => next.delete(String(p.sku)));
      setSelectedWithOffer(next);
      setSelectAllWithOffer(false);
    } else {
      const next = new Set(selectedWithOffer);
      filteredProductosConOferta.forEach((p: any) => next.add(String(p.sku)));
      setSelectedWithOffer(next);
      setSelectAllWithOffer(true);
    }
  };

  useEffect(() => {
    setSelectAllWithOffer(
      filteredProductosConOferta.length > 0 &&
      filteredProductosConOferta.every((p: any) => selectedWithOffer.has(String(p.sku)))
    );
  }, [filteredProductosConOferta, selectedWithOffer]);

  // ============================================
  // 🖨️ IMPRIMIR MASIVO
  // ============================================
  const handlePrintSelected = async () => {
    if (loading) return;

    try {
      const seleccionados = productosConOferta.filter(p =>
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
      
		console.log("tabfileupload PAYLOAD", payload)
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
        throw new Error('Error en impresión masiva');
      }

      alert(`✔ ${payload.length} etiquetas enviadas correctamente`);
      setSelectedWithOffer(new Set());
      setSelectAllWithOffer(false);

    } catch (err) {
      console.error(err);
      alert('Error en impresión masiva');
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
        throw new Error('Error en impresión masiva');
      }

      alert(`✔ ${payload.length} etiquetas enviadas correctamente`);
    } catch (err) {
      console.error(err);
      alert('Error en impresión masiva');
    } finally {
      setLoading(false);
    }
  };

// ============================================
// EXPORTAR SIN OFERTA (CSV)
// ============================================
const handleExport = () => {
  if (productosSinOferta.length === 0) {
    alert('No hay productos para exportar');
    return;
  }

  // Cabecera requerida
  const headers = ['sku', 'descripcion'];

  // Filas requeridas
  const rows = productosSinOferta.map((p: any) => [
    p.sku,
    p.descripcion
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(value =>
        `"${String(value ?? '').replace(/"/g, '""')}"`
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
	
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Lectura Archivo ETIQUERF
          </CardTitle>
          <CardDescription>
            Lee archivo generado por pistola RF desde servidor
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleLeerEtiqRF}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Leyendo...' : 'Leer ETIQUERF'}
            </Button>
            <Button
              onClick={handlePrintAll}
              disabled={loading || productosConOferta.length === 0}
              className="bg-slate-700 hover:bg-slate-800"
            >
              Imprimir todos ({productosConOferta.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CONTENIDO ARCHIVO */}
      {fileContent && (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6">
            <p className="text-xs text-gray-600 text-center">
              Archivo leído desde servidor
            </p>

            <pre className="mt-4 text-xs bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
              {fileContent}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* RESULTADOS */}
      {parseResult && (
        <>
          {/* STATS */}
          <div className="grid grid-cols-4 gap-4">
            <Card><CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{parseResult.total}</p>
              <p className="text-xs">Total</p>
            </CardContent></Card>

            <Card><CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-red-600">{parseResult.conOferta.length}</p>
              <p className="text-xs">Con Oferta</p>
            </CardContent></Card>

            <Card><CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{parseResult.sinOferta.length}</p>
              <p className="text-xs">Sin Oferta</p>
            </CardContent></Card>

            <Card><CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-orange-600">{parseResult.noEncontrados.length}</p>
              <p className="text-xs">No Encontrados</p>
            </CardContent></Card>
          </div>

          {/* CON OFERTA */}
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Productos CON Oferta ({parseResult.conOferta.length})</CardTitle>

              <div className="flex items-center gap-2">
                <Checkbox checked={selectAllWithOffer} onCheckedChange={toggleSelectAllWithOffer}/>
                <span className="text-sm">Seleccionar filtrados</span>
              </div>
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
				  <div
					key={p.sku}
					className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm"
				  >
					{/* IZQUIERDA */}
					<div className="flex items-start gap-3">
					  <Checkbox
						  checked={selectedWithOffer.has(String(p.sku))}
						  onCheckedChange={() => toggleWithOffer(String(p.sku))}
					  />
					  <div>
						<p className="font-semibold text-base">
						  {p.descripcion}
						</p>
						<p className="text-sm text-gray-500">
						  SKU: {p.sku}
						</p>
					  </div>
					</div>

					{/* DERECHA */}
					<div className="text-right">
					  <p className="text-sm text-gray-400 line-through">
						Normal: ${p.precioNormal}
					  </p>

					  <p className="text-sm text-gray-500">
						Unitario: ${p.precioUnitario}
					  </p>

					  <p className="text-xl font-bold text-green-600">
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

          {/* SIN OFERTA */}
          <Card>
            <CardHeader>
              <CardTitle>Productos SIN Oferta ({parseResult.sinOferta.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {parseResult.sinOferta.map((p: any) => (
				  <div
					key={p.sku}
					className="border border-red-300 rounded-lg p-4 flex justify-between items-center bg-red-50"
				  >
					{/* IZQUIERDA */}
					<div>
					  <p className="font-semibold text-base text-red-900">
						{p.descripcion}
					  </p>
					  <p className="text-sm text-red-500">
						SKU: {p.sku}
					  </p>
					</div>

					{/* DERECHA */}
					<div className="text-right">
					  <p className="text-lg font-bold text-red-600">
						${p.precioNormal}
					  </p>
					  <p className="text-sm text-red-500">
						Unitario: ${p.precioUnitario}
					  </p>
					</div>
				  </div>
              ))}
            </CardContent>
          </Card>

          {/* NO ENCONTRADOS */}
          {parseResult.noEncontrados.length > 0 && (
            <Card className="border-orange-400 border-2 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5"/>
                  SKUs No Encontrados ({parseResult.noEncontrados.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {parseResult.noEncontrados.map((sku) => (
                  <div key={sku} className="px-3 py-1 bg-orange-200 rounded text-sm">
                    {sku}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ACCIONES */}
          <div className="grid grid-cols-2 gap-4">
			<Button
			  onClick={handlePrintSelected}
			  disabled={selectedWithOffer.size === 0 || loading}
			  className="bg-blue-600 hover:bg-blue-700"
			>
			  {loading
				? "Imprimiendo..."
				: `🖨️ Imprimir (${selectedWithOffer.size})`
			  }
			</Button>			

            <Button
              onClick={handlePrintAll}
              disabled={loading || productosConOferta.length === 0}
              className="bg-slate-700 hover:bg-slate-800"
            >
              Imprimir todos ({productosConOferta.length})
            </Button>

            <Button
              onClick={handleExport}
              className="bg-red-600 hover:bg-red-700 col-span-2"
            >
              Exportar Sin Oferta ({parseResult.sinOferta.length})
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
