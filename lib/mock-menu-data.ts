// Simulación de lectura de BD para Menú 2
// En producción, esto vendría del backend

export const simulatedDatabaseProducts = [
  '89997002', // Con oferta
  '89997001', // Sin oferta
  '89996005', // Con oferta
  '89996004', // Con oferta
  '89996003', // Sin oferta
  '89995005', // Con oferta
];

// Simulación de archivo TXT para Menú 3
// Usuario puede cargar un archivo con estos SKUs
export const simulatedTextFileSkus = `89997002
89996005
89996002
89995003
INVALID123
NOTFOUND456`;

// Función simulada que parsea el archivo TXT
export function parseTextFileSKUs(fileContent: string): string[] {
  return fileContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}
