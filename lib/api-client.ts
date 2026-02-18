const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiProduct {
  id: number;
  codigo: string;
  codigoBarras: string;
  nombre: string;
  descripcion: string;
  talla: string;
  precioNormal: number;
  precioUnitario: number;
  stock: number;
  categoria: string;
  laboratorio: string;
  precioActual: number;
  oferta_id?: number;
  precioOferta?: number;
  descuentoPorcentaje?: number;
  vigenciaInicio?: string;
  vigenciaFin?: string;
  tipoOferta?: string;
  ofertaActiva?: boolean;
  division?: string;
  categoriaLarga?: string;
  subcategoria?: string;
  marca?: string;
  enMeson?: boolean;
}

export const apiClient = {
  // Productos
  async getAllProducts(): Promise<ApiProduct[]> {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },

  async getProduct(codigo: string): Promise<ApiProduct> {
    const res = await fetch(`${API_BASE_URL}/products/${codigo}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return res.json();
  },

  async searchProducts(query: string): Promise<ApiProduct[]> {
    const res = await fetch(`${API_BASE_URL}/products/search/${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Error en búsqueda');
    return res.json();
  },

  // Ofertas
  async getActiveOffers() {
    const res = await fetch(`${API_BASE_URL}/offers/vigentes`);
    if (!res.ok) throw new Error('Error al obtener ofertas');
    return res.json();
  },

  async getProductOffers(sku: string) {
    const res = await fetch(`${API_BASE_URL}/offers/producto/${sku}`);
    if (!res.ok) throw new Error('Error al obtener ofertas');
    return res.json();
  },

  // Mesón
  async getMesonProducts() {
    const res = await fetch(`${API_BASE_URL}/meson/productos`);
    if (!res.ok) throw new Error('Error al obtener productos de mesón');
    return res.json();
  },

  async getMesonCategories() {
    const res = await fetch(`${API_BASE_URL}/meson/categorias`);
    if (!res.ok) throw new Error('Error al obtener categorías');
    return res.json();
  },

  async getProductsByCategory(categoria: string) {
    const res = await fetch(`${API_BASE_URL}/meson/categoria/${encodeURIComponent(categoria)}`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },
};
