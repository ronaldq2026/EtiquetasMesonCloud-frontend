/**
 * Parser básico para convertir datos tabulares (TSV/CSV) a objetos Product
 * Uso: Para cargar datos de archivos DBF exportados a texto
 */

export interface RawProductData {
  MAPCODIN: string;
  MAPBARRA: string;
  MAPDESCC: string;
  MAPDESCL: string;
  MAPPRENT: string;
  MAPIGRAL: string;
  MAPLAB: string;
  MAPPREVT: string;
  MAPSTOCK: string;
  MAPCATEG: string;
}

export function parseDBFLine(line: string, headers: string[]): Partial<RawProductData> {
  const values = line.split('\t');
  const result: any = {};
  
  headers.forEach((header, index) => {
    result[header] = values[index]?.trim() || '';
  });
  
  return result;
}

export function convertRawToProduct(raw: RawProductData, index: number) {
  return {
    id: index.toString(),
    codigo: raw.MAPCODIN,
    codigoBarras: raw.MAPBARRA,
    nombre: raw.MAPDESCC || raw.MAPDESCL,
    descripcion: raw.MAPDESCL,
    dosage: raw.MAPDESCC.split(',').pop()?.trim() || 'Estándar',
    batch: raw.MAPBARRA,
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split('T')[0],
    manufacturer: raw.MAPLAB || 'N/A',
    precio: parseInt(raw.MAPPREVT) || 0,
    stock: parseInt(raw.MAPSTOCK) || 0,
    categoria: raw.MAPCATEG || 'General',
    laboratorio: raw.MAPLAB || 'Desconocido',
  };
}

export function parseDBFFile(fileContent: string) {
  const lines = fileContent.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('Archivo DBF inválido: se requieren encabezados y datos');
  }

  const headers = lines[0].split('\t');
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const rawData = parseDBFLine(lines[i], headers);
      const product = convertRawToProduct(rawData as RawProductData, i);
      products.push(product);
    } catch (error) {
      console.warn(`Error procesando línea ${i}:`, error);
    }
  }

  return products;
}
