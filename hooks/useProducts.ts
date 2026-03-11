import useSWR from 'swr';
import { apiClient, ApiProduct } from '@/lib/api-client';

interface UseProductsOptions {
  fallback?: ApiProduct[];
}

export function useProducts(options?: UseProductsOptions) {
  // En el nuevo flujo, los productos NO se cargan automáticamente
  // Se cargan solo cuando el usuario carga el Excel
  return {
    products: options?.fallback || [],
    isLoading: false,
    error: null,
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
