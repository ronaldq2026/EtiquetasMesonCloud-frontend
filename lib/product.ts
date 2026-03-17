 //lib/products.ts
export interface Oferta {
  precioOferta: number;
  vigenciaInicio: string; // YYYY-MM-DD
  vigenciaFin: string; // YYYY-MM-DD
  descuentoPorcentaje: number;
  tipoOferta: string; // '1' = porcentaje, '3' = cantidad x precio
}

export interface MesonInfo {
  division: string;
  categoria: string;
  subcategoria: string;
  marca: string;
  enMeson: boolean;
}

export interface Product {
  id: string;
  codigo: string;
  codigoBarras: string;
  nombre: string;
  descripcion: string;
  dosage: string;
  batch: string;
  expiryDate: string;
  manufacturer: string;
  precioUnitario: number; // Precio base de POSMAPRE (mapprevt)
  precioOferta: number | null; // Precio con descuento de POSDPOFE (dp_valofer)
  precio: number; // Precio vigente (si hay oferta, usa precioOferta; si no, usa precioUnitario)
  stock: number;
  categoria: string;
  laboratorio: string;
  oferta?: Oferta; // Datos de oferta de posdpofe
  meson?: MesonInfo; // Datos del mesón
}

export interface LabelConfig {
  width: number; // in mm
  height: number; // in mm
  showProductName: boolean;
  showGenericName: boolean;
  showDosage: boolean;
  showBatch: boolean;
  showExpiry: boolean;
  showManufacturer: boolean;
  showPrice: boolean;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

export const defaultLabelConfig: LabelConfig = {
  width: 100,
  height: 60,
  showProductName: true,
  showGenericName: true,
  showDosage: false,
  showBatch: true,
  showExpiry: false,
  showManufacturer: false,
  showPrice: true,
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  fontSize: 11,
};
