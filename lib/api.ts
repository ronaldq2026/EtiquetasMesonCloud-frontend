// lib/api.ts – versión simple para producción en Windows

// 👇 apunta DIRECTO al backend (en tu caso ya corre en :3000)
const API_BASE_URL = 'http://localhost:3000';

// 👇 Debe ser el mismo token configurado en el backend (API_TOKEN)
const API_TOKEN = 'MI_TOKEN_DEMO_123';

function buildHeaders(extra?: Record<string, string>) {
  return {
    ...(API_TOKEN ? { 'X-API-TOKEN': API_TOKEN } : {}),
    ...(extra || {}),
  };
}

async function parseOrText(res: Response) {
  const text = await res.text();
  try {
    return { asJson: JSON.parse(text), asText: text };
  } catch {
    return { asJson: null, asText: text };
  }
}

/* ====== DEMOS EXISTENTES ====== */
export async function fetchDemoProducto() {
  const res = await fetch(`${API_BASE_URL}/api/pos/producto-demo`, {
    method: 'GET',
    headers: buildHeaders(),
  });

  const parsed = await parseOrText(res);
  if (!res.ok) {
    const msg =
      parsed.asJson?.message ||
      parsed.asText ||
      `Error al obtener producto demo (${res.status})`;
    throw new Error(msg);
  }

  return (parsed.asJson?.producto ?? null) as any;
}

export async function printDemoEtiqueta() {
  const res = await fetch(`${API_BASE_URL}/api/pos/print-demo`, {
    method: 'POST',
    headers: buildHeaders({ 'Content-Type': 'application/json' }),
  });

  const parsed = await parseOrText(res);
  if (!res.ok) {
    const msg =
      parsed.asJson?.message ||
      parsed.asText ||
      `Error al imprimir (${res.status})`;
    throw new Error(msg);
  }

  return parsed.asJson ?? { status: 'ok' };
}

/* ====== Tipos compartidos ====== */
export type MesonExcelSummary = {
  count: number;
  lastUpdated: string | null;
  sample: string[];
  source?: {
    fileName?: string;
    sheet?: string;
    col?: string;
    excelRows?: number;
    matchedInDPOFE?: number; // puede no venir en este nuevo flujo, no es requerido
  };
};

export type ProductoPOSDPOFE = {
  sku: string;
  descripcionPromo: string;
  precioNormal: number;
  precioOferta?: number;
  precioUnitario?: number;
  vigenciaInicio?: string | null;
  vigenciaFin?: string | null;
  descuentoPct?: number;
};

export type ExcelItem = {
  sku: string;
  descripcion?: string;
};

/* ====== Excel: subir y estado ====== */
export async function uploadMesonExcel(file: File, user: string) {
  const fd = new FormData();
  fd.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/meson/excel/upload`, {
    method: 'POST',
    headers: buildHeaders({ 'x-user': user }),
    body: fd,
  });

  const parsed = await parseOrText(res);
  if (!res.ok || !parsed.asJson?.ok) {
    const msg =
      parsed.asJson?.message ||
      parsed.asText ||
      `Error subiendo Excel (${res.status})`;
    throw new Error(msg);
  }
  return parsed.asJson.summary as MesonExcelSummary;
}

export async function getExcelStatus() {
  const res = await fetch(`${API_BASE_URL}/api/meson/excel/status`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  const parsed = await parseOrText(res);
  if (!res.ok || !parsed.asJson?.ok) {
    const msg =
      parsed.asJson?.message ||
      parsed.asText ||
      `Error obteniendo estado Excel (${res.status})`;
    throw new Error(msg);
  }
  return parsed.asJson.summary as MesonExcelSummary;
}

/* ====== NUEVO FLUJO ======
   1) Buscar SOLO en Excel (rápido, sin DBF)
   2) Al seleccionar, enriquecer con POSDPOFE (precios/ofertas)
*/
export async function searchExcel(term: string) {
  const url = `${API_BASE_URL}/api/meson/excel/search?term=${encodeURIComponent(term)}`;
  const res = await fetch(url, { method: 'GET', headers: buildHeaders() });
  const parsed = await parseOrText(res);
	if (!res.ok || !parsed.asJson?.ok) {
	  const msgBase =
		parsed.asJson?.message ||
		parsed.asText ||
		`Error buscando en Excel (${res.status})`;
	  const msg = parsed.asJson?.detail ? `${msgBase} · Detalle: ${parsed.asJson.detail}` : msgBase;
	  throw new Error(msg);
	}
  return (parsed.asJson?.items ?? []) as ExcelItem[];
}

export async function enrichFromDPOFE(sku: string) {
  const url = `${API_BASE_URL}/api/meson/excel/enrich/${encodeURIComponent(sku)}`;
  const res = await fetch(url, { method: 'GET', headers: buildHeaders() });
  const parsed = await parseOrText(res);
  if (!res.ok) {
    const msg =
      parsed.asJson?.message ||
      parsed.asText ||
      `Error enriqueciendo SKU (${res.status})`;
    throw new Error(msg);
  }
  return parsed.asJson as {
    ok: true;
    foundInExcel: boolean;
    foundInDPOFE: boolean;
    message?: string;
    producto?: ProductoPOSDPOFE;
  };
}