import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../lib/api';

interface Product {
  id: string;
  name: string;
  brand: string;
  variety: string;
  package: string;
  size: string;
  price: number;
  supermarket: string;
  category?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasAvailableProducts: boolean;
  refetch: () => void;
}

export const useProducts = (
  selectedProductType: string,
  subfilters: { [key: string]: string },
  selectedSupermarkets: string[]
): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!selectedProductType) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching products for type:', selectedProductType);
      console.log('Applied subfilters:', subfilters);

      // Preparar parámetros para la API
      const params: any = {
        limit: 100, // Límite inicial razonable
      };

      // Si hay búsqueda por tipo de producto, usarla como filtro de categoría
      if (selectedProductType) {
        params.category = selectedProductType;
      }

      // Aplicar subfiltros como parámetros de búsqueda adicionales
      if (subfilters.marca && subfilters.marca !== 'Todas') {
        params.search = `${params.search || ''} ${subfilters.marca}`.trim();
      }

      if (subfilters.variedad && subfilters.variedad !== 'Todas') {
        params.search = `${params.search || ''} ${subfilters.variedad}`.trim();
      }

      console.log('API call with params:', params);

      const response = await productsAPI.getProducts(params);

      if (response.success) {
        let fetchedProducts = response.data || [];

        console.log('Fetched products count:', fetchedProducts.length);

        // Mapear propiedades del backend al formato esperado por el frontend
        fetchedProducts = fetchedProducts.map((product: any) => ({
          id: product._id || product.id,
          name: product.name,
          brand: product.brand || 'Sin marca',
          variety: product.variety || 'Variedad estándar',
          package: product.package || product.unit || 'Sin especificar',
          size: product.size || product.unit || 'Sin especificar',
          price: product.price,
          supermarket: product.supermarket,
          category: product.category
        }));

        console.log('Mapped products:', fetchedProducts.slice(0, 3)); // Log first 3 for debugging
        if (subfilters.envase && subfilters.envase !== 'Todos') {
          fetchedProducts = fetchedProducts.filter((product: Product) =>
            product.package === subfilters.envase
          );
        }

        if (subfilters.tamaño && subfilters.tamaño !== 'Todos') {
          fetchedProducts = fetchedProducts.filter((product: Product) =>
            product.size === subfilters.tamaño
          );
        }

        console.log('Products after frontend filtering:', fetchedProducts.length);
        setProducts(fetchedProducts);
      } else {
        throw new Error(response.message || 'Error al obtener productos');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedProductType, subfilters]);

  // Efecto para cargar productos cuando cambian los filtros
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const hasAvailableProducts = products.length > 0;

  return {
    products,
    loading,
    error,
    hasAvailableProducts,
    refetch: fetchProducts,
  };
};
