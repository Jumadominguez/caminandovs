// Configuración de API para el frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    products: '/products',
    productsSearch: '/products/search',
    categories: '/products/categories',
    compare: '/products/compare',
    supermarkets: '/supermarkets'
  }
};

// Función helper para hacer requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Funciones específicas para productos
export const productsAPI = {
  // Obtener productos con filtros
  getProducts: async (params: {
    search?: string;
    category?: string;
    supermarket?: string;
    limit?: number;
    skip?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${apiConfig.endpoints.products}?${queryString}` : apiConfig.endpoints.products;

    return apiRequest(endpoint);
  },

  // Buscar productos
  searchProducts: async (query: string, category?: string) => {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);

    return apiRequest(`${apiConfig.endpoints.productsSearch}?${params}`);
  },

  // Obtener categorías
  getCategories: async () => {
    return apiRequest(apiConfig.endpoints.categories);
  },

  // Comparar productos específicos
  compareProducts: async (productIds: string[]) => {
    return apiRequest(apiConfig.endpoints.compare, {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    });
  },
};

// Funciones específicas para supermercados
export const supermarketsAPI = {
  // Obtener lista de supermercados
  getSupermarkets: async () => {
    return apiRequest(apiConfig.endpoints.supermarkets);
  },

  // Obtener productos de un supermercado específico
  getSupermarketProducts: async (supermarketId: string) => {
    return apiRequest(`${apiConfig.endpoints.supermarkets}/${supermarketId}/products`);
  },
};
