import useSWR from 'swr';
import { apiClient, ApiProduct } from '@/lib/api-client';

interface UseProductsOptions {
  fallback?: ApiProduct[];
}

export function useProducts(options?: UseProductsOptions) {
  const { data, error, isLoading } = useSWR(
    'all-products',
    () => apiClient.getAllProducts(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      fallback: options?.fallback || [],
    }
  );

  return {
    products: data || [],
    isLoading,
    error,
  };
}

export function useSearchProducts(query: string) {
  const { data, error, isLoading } = useSWR(
    query ? `search-${query}` : null,
    () => query ? apiClient.searchProducts(query) : Promise.resolve([]),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    results: data || [],
    isLoading,
    error,
  };
}

export function useProduct(codigo: string) {
  const { data, error, isLoading } = useSWR(
    codigo ? `product-${codigo}` : null,
    () => codigo ? apiClient.getProduct(codigo) : Promise.resolve(null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    product: data || null,
    isLoading,
    error,
  };
}

export function useMesonProducts() {
  const { data, error, isLoading } = useSWR(
    'meson-products',
    () => apiClient.getMesonProducts(),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    products: data || [],
    isLoading,
    error,
  };
}
