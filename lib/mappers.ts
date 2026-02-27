// lib/mappers.ts
import type { Product, Oferta } from "@/lib/mock-data";

/**
 * Helpers
 */
function toISODateOnly(input?: any): string {
  // Normaliza a 'YYYY-MM-DD'. Si no hay fecha válida, usa hoy.
  const d = input ? new Date(input) : new Date();
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function safeNumber(n: any, fallback = 0): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

/**
 * Mapea un registro "raw" desde DBF (row) al tipo Product del mock.
 * Ajusta nombres según tus columnas reales.
 */
export function mapDbfToProduct(row: any): Product {
  // Campos base del DBF (con fallback)
  const codigo =
    row?.CODPROD ?? row?.CODIGO ?? row?.COD ?? row?.MAPCODIN ?? "";
  const codigoBarras =
    row?.CODBARRA ?? row?.CODBAR ?? row?.MAPBARRA ?? row?.BARRA ?? "";
  const nombre =
    row?.DESPROD ?? row?.DESCRIPCION ?? row?.MAPDESCC ?? row?.NOMBRE ?? "";
  const descripcion = row?.DESCRIPCION ?? row?.DESPROD ?? "";
  const laboratorio = row?.LABORATORIO ?? row?.MARCA ?? row?.LAB ?? "";
  const dosage = row?.TALLA ?? row?.PRESENTACION ?? row?.DOSAGE ?? "";
  const batch = row?.LOTE ?? row?.BATCH ?? codigoBarras ?? "";
  const expiryDate = toISODateOnly(row?.FEC_VENCE ?? row?.FEC_VENC ?? row?.EXPIRY ?? "");

  // Precios
  const precioOferta = safeNumber(row?.PRECIO_OFERTA, NaN);
  const precioNormal = safeNumber(
    // precio “normal” de referencia
    !isNaN(precioOferta) ? row?.PRECIO ?? row?.PRECIO1 : (row?.PRECIO ?? row?.PRECIO1),
    0
  );
  const precioBase = !isNaN(precioOferta)
    ? precioOferta
    : safeNumber(row?.PRECIO ?? row?.PRECIO1, 0);

  // Oferta (si existe precio oferta válido)
  let oferta: Oferta | undefined = undefined;

  if (!isNaN(precioOferta)) {
    // Calcula % de descuento si hay precioNormal > 0
    const descuento =
      precioNormal > 0
        ? Math.max(0, Math.round((1 - precioOferta / precioNormal) * 100))
        : 0;

    const vigenciaInicio = toISODateOnly(row?.FEC_INICIO ?? row?.INI_OFERTA);
    const vigenciaFin = toISODateOnly(row?.FEC_TERMINO ?? row?.FIN_OFERTA);

    oferta = {
      precioOferta: precioOferta,
      vigenciaInicio,
      vigenciaFin,
      descuentoPorcentaje: descuento,
      tipoOferta: "1", // '1' = porcentaje; ajusta si manejas otros tipos
    };
  }

  const producto: Product = {
    id: String(codigo || codigoBarras || Date.now()),
    codigo: String(codigo || ""),
    codigoBarras: String(codigoBarras || ""),
    nombre: String(nombre || ""),
    descripcion: String(descripcion || ""),
    dosage: String(dosage || ""),
    batch: String(batch || ""),
    expiryDate,
    manufacturer: laboratorio || "",     // si quieres mantener manufacturer además de laboratorio
    laboratorio: laboratorio || "",      // mantén ambos por compatibilidad con tu UI
    precioNormal,
    precio: precioBase,                  // precio actual (con oferta si aplica)
    stock: safeNumber(row?.STOCK ?? row?.EXISTENCIA, 0),
    categoria: String(row?.CATEGORIA ?? row?.CATEG ?? ""),
    oferta,                              // puede ser undefined si no hay oferta
    meson: undefined,                    // completa si tienes flags/columnas de mesón
  };

  return producto;
}