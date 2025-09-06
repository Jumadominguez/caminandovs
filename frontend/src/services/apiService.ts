import {
  Product,
  Supermarket,
  CategoriesResponse,
  ProductsResponse,
  SearchResult,
  ComparisonResult,
  ProductFilters
} from '../types/api';

// API service for connecting frontend with backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Products API
  async getProducts(params?: ProductFilters): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;

    return this.request<ProductsResponse>(endpoint);
  }

  async searchProducts(searchTerm: string, supermarket?: string): Promise<SearchResult> {
    const params = new URLSearchParams({ search: searchTerm });
    if (supermarket) {
      params.append('supermarket', supermarket);
    }

    return this.request<SearchResult>(`/api/products/search?${params.toString()}`);
  }

  async getCategories(): Promise<CategoriesResponse> {
    return this.request<CategoriesResponse>('/api/products/categories');
  }

  async compareProducts(productIds: string[]): Promise<ComparisonResult> {
    return this.request<ComparisonResult>('/api/products/compare', {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    });
  }

  // Supermarkets API
  async getSupermarkets(): Promise<Supermarket[]> {
    return this.request<Supermarket[]>('/api/supermarkets');
  }

  async getSupermarket(id: string) {
    return this.request(`/api/supermarkets/${id}`);
  }

  async getSupermarketProducts(
    supermarketId: string,
    params?: {
      category?: string;
      limit?: number;
      skip?: number;
    }
  ) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/supermarkets/${supermarketId}/products${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
