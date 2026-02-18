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
  precioNormal: number; // Precio antes de oferta
  precio: number; // Precio actual (con oferta si aplica)
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

// Datos reales del archivo DBF
export const mockProducts: Product[] = [
  {
    id: '1',
    codigo: '89997002',
    codigoBarras: '2000000744902',
    nombre: 'BLOODYGREEN TEEN FLUJO INTENSO',
    descripcion: 'BLOODYGREEN TEEN FLUJO INTENSO NEGR, 14-15',
    dosage: '14-15',
    batch: '2000000744902',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 16990,
    precio: 14990,
    stock: 8,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    oferta: {
      precioOferta: 14990,
      vigenciaInicio: '2025-04-22',
      vigenciaFin: '2025-05-26',
      descuentoPorcentaje: 12,
      tipoOferta: '1',
    },
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '2',
    codigo: '89997001',
    codigoBarras: '2000000744889',
    nombre: 'BLOODYGREEN TEEN FLUJO INTENSO',
    descripcion: 'BLOODYGREEN TEEN FLUJO INTENSO NEGR, 12-13',
    dosage: '12-13',
    batch: '2000000744889',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 16990,
    precio: 16990,
    stock: 8,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '3',
    codigo: '89996005',
    codigoBarras: '2000000744865',
    nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',
    descripcion: 'BLOODYGREEN H.W.FLUJO INTENSO NEGRO, XXL',
    dosage: 'XXL',
    batch: '2000000744865',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 19990,
    precio: 19990,
    stock: 14,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '4',
    codigo: '89996004',
    codigoBarras: '2000000744841',
    nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',
    descripcion: 'BLOODYGREEN H.W.FLUJO INTENSO NEGRO, XL',
    dosage: 'XL',
    batch: '2000000744841',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 19990,
    precio: 19990,
    stock: 14,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '5',
    codigo: '89996003',
    codigoBarras: '2000000744803',
    nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',
    descripcion: 'BLOODYGREEN H.W.FLUJO INTENSO NEGRO, L',
    dosage: 'L',
    batch: '2000000744803',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 19990,
    precio: 19990,
    stock: 14,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '6',
    codigo: '89996002',
    codigoBarras: '2000000744780',
    nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',
    descripcion: 'BLOODYGREEN H.W.FLUJO INTENSO NEGRO, M',
    dosage: 'M',
    batch: '2000000744780',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 19990,
    precio: 19990,
    stock: 14,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '7',
    codigo: '89996001',
    codigoBarras: '2000000744766',
    nombre: 'BLOODYGREEN H.W. FLUJO INTENSO',
    descripcion: 'BLOODYGREEN H.W.FLUJO INTENSO NEGRO, S',
    dosage: 'S',
    batch: '2000000744766',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 19990,
    precio: 19990,
    stock: 14,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '8',
    codigo: '89995005',
    codigoBarras: '2000000744742',
    nombre: 'BLOODYGREEN H.W. FLUJO MODERADO',
    descripcion: 'BLOODYGREEN H.W.FLUJO MODERADO NEGR, XXL',
    dosage: 'XXL',
    batch: '2000000744742',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 19990,
    precio: 19990,
    stock: 14,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '9',
    codigo: '89995004',
    codigoBarras: '2000000744728',
    nombre: 'BLOODYGREEN H.W. FLUJO MODERADO',
    descripcion: 'BLOODYGREEN H.W.FLUJO MODERADO NEGRO, XL',
    dosage: 'XL',
    batch: '2000000744728',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 19990,
    precio: 19990,
    stock: 14,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
  {
    id: '10',
    codigo: '89995003',
    codigoBarras: '2000000744704',
    nombre: 'BLOODYGREEN H.W. FLUJO MODERADO',
    descripcion: 'BLOODYGREEN H.W.FLUJO MODERADO NEGRO, L',
    dosage: 'L',
    batch: '2000000744704',
    expiryDate: '2026-12-31',
    manufacturer: 'BLOODYGREEN',
    precioNormal: 19990,
    precio: 19990,
    stock: 14,
    categoria: '20M02A',
    laboratorio: 'BLOODYGREEN',
    meson: {
      division: 'Consumo',
      categoria: 'PROTECCION SANITARIA FEMENINA',
      subcategoria: 'TOALLAS',
      marca: 'BLOODYGREEN',
      enMeson: true,
    },
  },
];

export const defaultLabelConfig: LabelConfig = {
  width: 100,
  height: 60,
  showProductName: true,
  showGenericName: true,
  showDosage: true,
  showBatch: true,
  showExpiry: true,
  showManufacturer: true,
  showPrice: true,
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  fontSize: 11,
};
