import { Product, Oferta, MesonInfo } from './mock-data';

/**
 * Parser para archivos TSV delimitados por tabuladores
 * Usualmente de formato DBF exportado
 */

interface PosdpofeRow {
  DP_DESCRIP: string;
  DP_VALOFER: string; // Precio oferta
  DP_DATO: string; // SKU
  DP_FFIN: string; // Fecha fin oferta (MMDDYY)
  DP_DSCTO: string; // Descuento porcentaje
  DP_VALORIG: string; // Precio original
}

interface MesonRow {
  SKU: string;
  DESCRIPCION: string;
  DIVISION: string;
  CATEGORÍA: string;
  SUBCATEGORÍA: string;
  MARCA: string;
}

/**
 * Parsea archivo TSV de posdpofe y crea ofertas
 */
export function parsePosdpofe(tsvContent: string): Map<string, Oferta> {
  const lines = tsvContent.trim().split('\n');
  const offers = new Map<string, Oferta>();

  // Omitir header si existe
  const startIndex = lines[0].includes('DP_DESCRIP') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length < 8) continue;

    const sku = parts[9]?.replace(/^0+/, '') || ''; // DP_DATO
    const precioOferta = parseInt(parts[7]) || 0; // DP_VALOFER
    const descuento = parseInt(parts[19]) || 0; // DP_DSCTO
    const fechaFin = parts[5] || ''; // DP_FFIN (MMDDYY)

    if (!sku) continue;

    // Convertir fecha MMDDYY a YYYY-MM-DD
    const fechaFormatted = convertFechaDBF(fechaFin);

    offers.set(sku, {
      precioOferta,
      vigenciaInicio: new Date().toISOString().split('T')[0],
      vigenciaFin: fechaFormatted,
      descuentoPorcentaje: descuento,
      tipoOferta: '1',
    });
  }

  return offers;
}

/**
 * Parsea archivo TSV de meson y crea info de categorización
 */
export function parseMeson(tsvContent: string): Map<string, MesonInfo> {
  const lines = tsvContent.trim().split('\n');
  const mesonInfo = new Map<string, MesonInfo>();

  // Omitir header si existe
  const startIndex = lines[0].includes('SKU') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length < 6) continue;

    const sku = parts[0]?.trim() || '';
    const descripcion = parts[1]?.trim() || '';
    const division = parts[2]?.trim() || '';
    const categoria = parts[3]?.trim() || '';
    const subcategoria = parts[4]?.trim() || '';
    const marca = parts[5]?.trim() || '';

    if (!sku) continue;

    mesonInfo.set(sku, {
      division,
      categoria,
      subcategoria,
      marca,
      enMeson: true,
    });
  }

  return mesonInfo;
}

/**
 * Convierte fecha en formato DBF (MMDDYY) a ISO (YYYY-MM-DD)
 */
function convertFechaDBF(fechaDBF: string): string {
  if (!fechaDBF || fechaDBF.length !== 6) {
    return new Date().toISOString().split('T')[0];
  }

  const mes = fechaDBF.substring(0, 2);
  const dia = fechaDBF.substring(2, 4);
  let ano = fechaDBF.substring(4, 6);

  // Asumir siglo 20 o 21
  const anoCompleto = parseInt(ano) < 50 ? `20${ano}` : `20${ano}`;

  return `${anoCompleto}-${mes}-${dia}`;
}

/**
 * Fusiona productos con datos de ofertas y mesón
 */
export function mergeProductData(
  products: Product[],
  ofertasMap: Map<string, Oferta>,
  mesonMap: Map<string, MesonInfo>
): Product[] {
  return products.map((product) => {
    const productoActualizado = { ...product };

    // Agregar oferta si existe
    if (ofertasMap.has(product.codigo)) {
      const oferta = ofertasMap.get(product.codigo)!;
      productoActualizado.oferta = oferta;
      // Actualizar precio a precio de oferta
      productoActualizado.precio = oferta.precioOferta;
    }

    // Agregar info de mesón si existe
    if (mesonMap.has(product.codigo)) {
      productoActualizado.meson = mesonMap.get(product.codigo);
    }

    return productoActualizado;
  });
}

/**
 * Calcula ahorro por producto si tiene oferta
 */
export function calcularAhorro(product: Product): number {
  if (!product.oferta) return 0;
  return product.precioNormal - product.precio;
}

/**
 * Calcula porcentaje de descuento real
 */
export function calcularDescuentoReal(product: Product): number {
  if (!product.oferta) return 0;
  return Math.round(((product.precioNormal - product.precio) / product.precioNormal) * 100);
}
