export function buildZPL(product: any) {

const descripcion = product.descripcion ?? product.nombre ?? ''

const precioNormal = product.precioUnitario ?? 0
const precioAhora = product.precioOferta ?? precioNormal

const sku = product.codigo ?? product.sku ?? ''
const barcode = product.ean13 ?? sku ?? '2000000000000'

const vigencia = product.vigenciaFin
? new Date(product.vigenciaFin).toLocaleDateString('es-CL')
: ''

function formatPrice(n:number){
return n.toLocaleString('es-CL')
}

// dividir descripción en dos líneas
const words = descripcion.split(" ")
const line1 = words.slice(0,4).join(" ")
const line2 = words.slice(4).join(" ")

return `
^XA
^CI28
^PW400
^LL300
^PR2
^MD5

^FO20,10^A0N,24,24^FD${line1}^FS
^FO20,35^A0N,24,24^FD${line2}^FS

^FO20,65^A0N,22,22^FDPRECIO NORMAL: $ ${formatPrice(precioNormal)}^FS

^FO70,95^A0N,70,70^FD$ ${formatPrice(precioAhora)}^FS

^BY2,3,60
^FO90,165^BCN,60,Y,N,N
^FD${barcode}^FS

^FO20,245^A0N,22,22^FDSKU:${sku}^FS
^FO210,245^A0N,22,22^FDVALIDO HASTA:${vigencia}^FS

^PQ1
^XZ
`
}