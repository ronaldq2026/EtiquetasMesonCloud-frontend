# Guía de Integración de Datos DBF

## Descripción
Esta aplicación de etiquetas farmacéuticas ahora está configurada para trabajar con datos reales del archivo DBF proporcionado.

## Datos Actuales Cargados
La aplicación actualmente carga los 10 productos del archivo `posmapre_top10.txt`:
- BLOODYGREEN TEEN FLUJO INTENSO (tallas 12-13 y 14-15)
- BLOODYGREEN H.W. FLUJO INTENSO (tallas S, M, L, XL, XXL)
- BLOODYGREEN H.W. FLUJO MODERADO (tallas L, XL, XXL)

## Mapeo de Campos

Los campos del archivo DBF se han mapeado de la siguiente manera:

| Campo DBF | Campo de Aplicación | Descripción |
|-----------|-------------------|-------------|
| MAPCODIN | codigo | Código único del producto |
| MAPBARRA | codigoBarras | Código de barras |
| MAPDESCC | nombre | Nombre corto del producto |
| MAPDESCL | descripcion | Descripción completa |
| MAPPREVT | precio | Precio de venta |
| MAPSTOCK | stock | Cantidad en stock |
| MAPLAB | laboratorio | Laboratorio/Fabricante |
| MAPCATEG | categoria | Categoría del producto |

## Características de la Aplicación

### 1. Búsqueda de Productos
- Busca por código, nombre, descripción o talla
- Vista rápida de stock y precio
- Selección instantánea

### 2. Configuración de Etiqueta
- Dimensiones personalizables (mm)
- Selección de campos a mostrar
- Colores personalizables
- Tamaño de fuente ajustable
- Presets rápidos (pequeña, mediana)

### 3. Constructor Visual
- Arrastra campos para reordenar
- Vista previa de la etiqueta en tiempo real
- Alternar visibilidad de campos

### 4. Impresión y Exportación
- Impresión directa desde navegador
- Exportación a PNG
- Cantidad de copias configurable

## Cómo Cargar Más Productos

Si tienes un archivo DBF más grande con más productos:

### Opción 1: Reemplazar los Datos Mock
1. Abre el archivo `/lib/mock-data.ts`
2. Reemplaza el array `mockProducts` con tus datos
3. Asegúrate de que cada producto tenga los campos requeridos

### Opción 2: Usar el Componente de Carga (Próximamente)
Pronto habrá un componente que permitirá cargar archivos DBF directamente desde la interfaz.

## Campos Requeridos por Producto

```typescript
interface Product {
  id: string;           // Identificador único
  codigo: string;       // Código del producto
  codigoBarras: string; // Código de barras
  nombre: string;       // Nombre del producto
  descripcion: string;  // Descripción completa
  dosage: string;       // Dosis/Talla
  batch: string;        // Lote (usar código de barras)
  expiryDate: string;   // Fecha de vencimiento (YYYY-MM-DD)
  manufacturer: string; // Fabricante
  precio: number;       // Precio en moneda local
  stock: number;        // Stock disponible
  categoria: string;    // Categoría
  laboratorio: string;  // Laboratorio
}
```

## Cambios Realizados

✅ Integración de datos reales del archivo DBF
✅ Mapeo de campos específicos de BLOODYGREEN
✅ Mostrar stock en búsqueda y configuración
✅ Mostrar código de producto en etiqueta
✅ Formateo de precio en moneda local (CLP)
✅ Campos dinámicos según los datos

## Próximas Mejoras

- [ ] Cargador de archivos DBF en la interfaz
- [ ] Caché de productos para mejor rendimiento
- [ ] Exportación de datos en diferentes formatos
- [ ] Historial de etiquetas impresas
- [ ] Configuración de múltiples laboratorios

## Soporte

Si encuentras problemas al integrar tus datos DBF, verifica:
1. El archivo esté en formato tabulado (TSV) o CSV
2. Los encabezados coincidan con los campos esperados
3. Los datos no tengan caracteres especiales problemáticos
