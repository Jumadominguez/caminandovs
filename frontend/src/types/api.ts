// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  brand: string;
  variety?: string;
  package?: string;
  size?: string;
  price: number;
  supermarket: string;
  category: string;
  subcategory?: string;
  productType?: string;
  imageUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  supermarket?: string;
  limit?: number;
  skip?: number;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

export interface ProductsResponse {
  data: Product[];
  pagination: PaginationInfo;
}

// Supermarket Types
export interface Supermarket {
  id: string;
  name: string;
  logo?: string;
  logoTransparent?: string;
  active?: boolean;
}

export interface SupermarketDetail extends Supermarket {
  baseUrl?: string;
  description?: string;
  website?: string;
  contactInfo?: {
    customerService?: string;
    whatsapp?: string;
  };
}

// Category Types
export interface Category {
  name: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  name: string;
  productTypes?: string[];
}

export interface CategoriesResponse {
  [categoryName: string]: {
    [subcategoryName: string]: string[];
  };
}

// Comparison Types
export interface ComparisonRequest {
  productIds: string[];
}

export interface ComparisonResult {
  products: Product[];
  bestPrice?: Product;
  priceDifference?: number;
  savings?: number;
}

// Search Types
export interface SearchResult {
  products: Product[];
  totalFound: number;
  searchTerm: string;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}
