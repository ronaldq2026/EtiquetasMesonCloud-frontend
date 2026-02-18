# Integración de Datos DBF - Sistema de Etiquetas Farmacéuticas

## Descripción General

Tu aplicación integra datos de tres fuentes principales:

### 1. **posmapre** (Productos Base)
- SKU / Código de producto
- Descripción
- Precio Normal
- Precio Unitario
- Código de Barras
- Stock

### 2. **posdpofe** (Ofertas y Promociones)
- Precio de Oferta (DP_VALOFER)
- Vigencia Inicio (DP_FINICIO)
- Vigencia Fin (DP_FFIN)
- Descuento Porcentaje (DP_DSCTO)
- SKU del producto (DP_DATO)

### 3. **meson** (Categorización - Productos en Mostrador)
- SKU
- Descripción
- División
- Categoría
- Subcategoría
- Marca

## Flujo de Datos Actual

```
posmapre (Base) → Carga inicial de productos
    ↓
posdpofe → Fusiona ofertas activas
    ↓
meson → Añade categorización y ubicación en mostrador
    ↓
App → Muestra etiquetas con precio actual + oferta + categoría
```

## Estructura de Producto (Product Interface)

```typescript
interface Product {
  id: string;
  codigo: string;                    // SKU de posmapre
  codigoBarras: string;             // Código de barras
  nombre: string;                    // Descripción
  descripcion: string;               // Descripción detallada
  dosage: string;                    // Talla/Tamaño
  batch: string;                     // Lote
  expiryDate: string;               // Fecha de vencimiento
  manufacturer: string;              // Fabricante/Laboratorio
  
  // Precios
  precioNormal: number;             // Precio sin oferta (de posmapre)
  precio: number;                    // Precio actual (con oferta si aplica)
  
  stock: number;                     // Stock disponible
  categoria: string;                 // Categoría interna
  laboratorio: string;               // Laboratorio
  
  // Datos de oferta (opcional - de posdpofe)
  oferta?: {
    precioOferta: number;           // Precio en oferta
    vigenciaInicio: string;         // Fecha inicio (YYYY-MM-DD)
    vigenciaFin: string;            // Fecha fin (YYYY-MM-DD)
    descuentoPorcentaje: number;    // % de descuento
    tipoOferta: string;             // '1' = porcentaje, '3' = cantidad x precio
  };
  
  // Datos de mesón (opcional - de meson)
  meson?: {
    division: string;                // División (ej: "Consumo")
    categoria: string;               // Categoría (ej: "PROTECCION SANITARIA FEMENINA")
    subcategoria: string;            // Subcategoría (ej: "TOALLAS")
    marca: string;                   // Marca
    enMeson: boolean;               // Si está en mostrador
  };
}
```

## Implementación

### Componentes Principales

#### 1. **ProductSearch** (`components/product-search.tsx`)
- Busca por nombre, código, talla, descripción
- Muestra oferta vigente con descuento y precio tachado
- Displays información completa del producto incluyendo:
  - Precio normal vs. oferta
  - Vigencia de oferta
  - Datos del mesón (si disponible)

#### 2. **LabelPreview** (`components/label-preview.tsx`)
- Muestra vista previa de etiqueta
- Visualiza badge de descuento si hay oferta vigente
- Renderiza precio actual (con oferta aplicada)

#### 3. **Page.tsx** (`app/page.tsx`)
- Panel de información rápida
- Cambia color de fondo si hay oferta vigente (rojo vs. azul)
- Muestra precio tachado y precio de oferta

#### 4. **DataImporter** (`components/data-importer.tsx`)
- Carga archivos TSV de meson y posdpofe
- Fusiona datos dinámicamente
- Actualiza productos en tiempo real

### Utilidades

#### `lib/data-merger.ts`
- `parsePosdpofe()` - Parsea ofertas desde archivo TSV
- `parseMeson()` - Parsea categorización desde archivo TSV
- `mergeProductData()` - Fusiona todos los datos
- `calcularAhorro()` - Calcula monto ahorrado
- `calcularDescuentoReal()` - Calcula % de descuento real

## Cómo Usar

### Opción 1: Datos Hardcodeados (Actual)
Los datos de ejemplo ya están en `lib/mock-data.ts` con un producto que tiene oferta. Puedes editar este archivo para agregar más productos o modificar ofertas.

### Opción 2: Cargar Archivos DBF (Dinámico)
1. En la aplicación, busca el componente DataImporter
2. Sube archivos:
   - `meson.txt` - Archivo con productos en mostrador
   - `posdpofe.txt` - Archivo con ofertas vigentes
3. Haz clic en "Fusionar Datos"
4. La aplicación actualizará automáticamente

### Formato de Archivos Esperados

#### Formato Meson (TSV)
```
SKU	DESCRIPCION	DIVISION	CATEGORÍA	SUBCATEGORÍA	MARCA
94397	SET TRABAS BACK TO SCHOOL 2 UN	Consumo	ACCESORIOS COSMETICOS	CAPILAR	FARMACIAS AHUMADA
...
```

#### Formato Posdpofe (TSV)
```
DP_DESCRIP	...	DP_VALOFER	...	DP_DATO	...	DP_FFIN	...	DP_DSCTO
VITAMINA E + SELENIO 90 CAPSULAS	...	7072	...	0000091683	...	05/26/25	...	50
...
```

## Campos Mapeados

### De posmapre → Product
- SKU → `codigo`
- Barras → `codigoBarras`
- Descripción → `nombre` y `descripcion`
- Talla → `dosage`
- Precio → `precioNormal` y `precio`
- Stock → `stock`

### De posdpofe → Product.oferta
- DP_VALOFER → `precioOferta`
- DP_FINICIO → `vigenciaInicio`
- DP_FFIN → `vigenciaFin` (se convierte MMDDYY → YYYY-MM-DD)
- DP_DSCTO → `descuentoPorcentaje`
- DP_DATO → Usado como clave para emparejar con producto

### De meson → Product.meson
- SKU → Usado como clave para emparejar
- División → `division`
- Categoría → `categoria`
- Subcategoría → `subcategoria`
- Marca → `marca`

## Validación de Ofertas Vigentes

```typescript
const ofertaVigente = product.oferta && new Date() <= new Date(product.oferta.vigenciaFin);
```

- Solo muestra oferta si la fecha actual está dentro del rango
- La fecha fin se compara en tiempo real
- Si no hay oferta vigente, muestra precio normal

## Ejemplo de Uso en Componente

```typescript
// Mostrar precio con oferta si aplica
{selectedProduct.oferta ? (
  <>
    <span className="line-through">${selectedProduct.precioNormal}</span>
    <span className="text-red-600">${selectedProduct.precio}</span>
  </>
) : (
  <span>${selectedProduct.precio}</span>
)}
```

## Próximas Mejoras Sugeridas

1. **Importación automática**: Conectar a servidor que proporcione datos en tiempo real
2. **Base de datos**: Almacenar en Supabase o similar en lugar de mock-data
3. **Sincronización**: Actualizar datos automáticamente cada hora
4. **Validación**: Validar consistencia de datos entre archivos
5. **Historial**: Guardar histórico de cambios de precios
6. **Reportes**: Exportar etiquetas impresas con información de oferta

## Troubleshooting

### Los datos no se cargan
- Verifica que el archivo esté en formato TSV (Tab-Separated)
- Confirma que los códigos SKU coincidan entre archivos

### Las ofertas no aparecen
- Verifica que la fecha fin (DP_FFIN) sea posterior a la fecha actual
- Asegúrate que el campo DP_DATO contenga el SKU correcto

### Los precios no se actualizan
- Comprueba que DP_VALOFER tenga valor numérico correcto
- Verifica que el mapping de campos sea correcto

