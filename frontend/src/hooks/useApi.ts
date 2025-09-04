import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import {
  Product,
  Supermarket,
  CategoriesResponse,
  ProductsResponse,
  ApiError,
  ProductFilters,
  SearchResult
} from '../types/api';

// Hook para obtener productos
export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState<ProductsResponse['pagination'] | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ProductsResponse = await apiService.getProducts(filters);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Error al cargar productos',
        details: err
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts
  };
};

// Hook para obtener supermercados
export const useSupermarkets = () => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchSupermarkets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data: Supermarket[] = await apiService.getSupermarkets();
      setSupermarkets(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Error al cargar supermercados',
        details: err
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupermarkets();
  }, [fetchSupermarkets]);

  return {
    supermarkets,
    loading,
    error,
    refetch: fetchSupermarkets
  };
};

// Hook para obtener categorías
export const useCategories = () => {
  const [categories, setCategories] = useState<CategoriesResponse>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data: CategoriesResponse = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Error al cargar categorías',
        details: err
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

// Hook para búsqueda de productos
export const useProductSearch = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const searchProducts = useCallback(async (searchTerm: string, supermarket?: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: SearchResult = await apiService.searchProducts(searchTerm, supermarket);
      setSearchResults(data.products || []);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Error en la búsqueda',
        details: err
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchProducts,
    clearResults: () => setSearchResults([])
  };
};

// Hook para comparación de productos
export const useProductComparison = () => {
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const compareProducts = useCallback(async (productIds: string[]) => {
    if (productIds.length < 2) {
      setError({ message: 'Se necesitan al menos 2 productos para comparar' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiService.compareProducts(productIds);
      setComparisonResults(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Error al comparar productos',
        details: err
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    comparisonResults,
    loading,
    error,
    compareProducts,
    clearComparison: () => setComparisonResults(null)
  };
};
