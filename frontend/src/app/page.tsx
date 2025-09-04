'use client';

import { useState, useEffect } from 'react';
import SupermarketSelector from '../components/SupermarketSelector';
import Filters from '../components/Filters';
import IntegratedProductTable from '../components/IntegratedProductTable';
import ComparisonTable from '../components/ComparisonTable';
import FinalResultsTable from '../components/FinalResultsTable';
import { useProducts } from '../hooks/useProducts';

const categories = {
  'Almacén': {
    'Aceites': ['Aceites de girasol', 'Aceites de oliva', 'Aceites mixtos'],
    'Fideos': ['Fideos secos', 'Fideos frescos', 'Fideos integrales'],
    'Salsas': ['Salsas de tomate', 'Salsas blancas', 'Salsas especiales']
  },
  'Bebidas': {
    'Gaseosas': ['Gaseosas de litro', 'Gaseosas de 2.25L', 'Gaseosas de 500ml'],
    'Vinos': ['Vinos tintos', 'Vinos blancos', 'Vinos rosados'],
    'Aguas': ['Aguas sin gas', 'Aguas con gas', 'Aguas saborizadas']
  },
  'Limpieza': {
    'Detergentes': ['Detergente para platos', 'Detergente para ropa', 'Detergente multiuso'],
    'Lavandinas': ['Lavandina común', 'Lavandina concentrada', 'Lavandina perfumada'],
    'Limpia Vidrios': ['Limpia vidrios concentrado', 'Limpia vidrios listo', 'Limpia vidrios antibacterial']
  }
};

interface Product {
  id: string;
  name: string;
  brand: string;
  variety: string;
  package: string;
  size: string;
  price: number;
  supermarket: string;
}

interface ComparisonProduct extends Product {
  quantity: number;
}

export default function Home() {
  // Estado para supermercados seleccionados
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([
    'carrefour', 'disco', 'jumbo', 'dia', 'vea'
  ]);

  // Estado para filtros
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [subfilters, setSubfilters] = useState<{ [key: string]: string }>({});

  // Estado para productos
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([]);

  // Manejar selección/deselección de supermercados
  const handleSupermarketToggle = (supermarketId: string) => {
    setSelectedSupermarkets(prev =>
      prev.includes(supermarketId)
        ? prev.filter(id => id !== supermarketId)
        : [...prev, supermarketId]
    );
  };

  // Manejar cambios en filtros
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Si hay productos en comparación, mantener el estado actual para no perder la tabla
    if (comparisonProducts.length > 0) {
      return;
    }
    // Lógica normal para cuando no hay productos en comparación
    if (selectedSubcategory && category) {
      const categoryData = categories[category as keyof typeof categories];
      if (categoryData && categoryData[selectedSubcategory as keyof typeof categoryData]) {
        // La subcategoría existe en la nueva categoría
        const availableTypes = categoryData[selectedSubcategory as keyof typeof categoryData] as string[];
        if (selectedProductType && Array.isArray(availableTypes) && availableTypes.includes(selectedProductType)) {
          // El tipo de producto también existe, mantener todo
          return;
        } else {
          // El tipo de producto no existe en la nueva subcategoría, solo resetear tipo
          setSelectedProductType('');
        }
      } else {
        // La subcategoría no existe en la nueva categoría, resetear todo
        setSelectedSubcategory('');
        setSelectedProductType('');
      }
    } else {
      // No hay subcategoría seleccionada, resetear
      setSelectedSubcategory('');
      setSelectedProductType('');
    }
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    // Si hay productos en comparación, mantener el tipo de producto seleccionado
    if (comparisonProducts.length > 0) {
      return;
    }
    // Resetear selectedProductType cuando cambia la subcategoría y no hay productos en comparación
    setSelectedProductType('');
  };

  const handleProductTypeChange = (productType: string) => {
    setSelectedProductType(productType);
  };

  const handleSubfilterChange = (filterName: string, value: string) => {
    console.log('Subfilter change:', filterName, '=', value);
    setSubfilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedProductType('');
    setSubfilters({});
    setAvailableProducts([]);
  };

  // Manejar selección de productos
  const handleProductToggle = (productId: string) => {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;

    if (selectedProductIds.includes(productId)) {
      // Remover producto
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
      setComparisonProducts(prev => prev.filter(p => p.id !== productId));
    } else {
      // Agregar producto
      setSelectedProductIds(prev => [...prev, productId]);
      setComparisonProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  // Manejar cambios en cantidad
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setComparisonProducts(prev =>
      prev.map(product =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  // Manejar eliminación de producto
  const handleRemoveProduct = (productId: string) => {
    setSelectedProductIds(prev => prev.filter(id => id !== productId));
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Manejar eliminación de todos los productos
  const handleRemoveAll = () => {
    setSelectedProductIds([]);
    setComparisonProducts([]);
  };

  // Usar el hook personalizado para obtener productos desde la API
  const {
    products: apiProducts,
    loading: productsLoading,
    error: productsError,
    hasAvailableProducts
  } = useProducts(selectedProductType, subfilters, selectedSupermarkets);

  // Sincronizar productos de la API con el estado local
  useEffect(() => {
    setAvailableProducts(apiProducts);
  }, [apiProducts]);

  // Guardar productos de comparación en localStorage
  useEffect(() => {
    localStorage.setItem('comparisonProducts', JSON.stringify(comparisonProducts));
  }, [comparisonProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🛒 Caminando Online
            </h1>
            <nav className="space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                Ingresar
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium">
                Registrarse
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Supermarket Selector */}
        <SupermarketSelector
          selectedSupermarkets={selectedSupermarkets}
          onSupermarketToggle={handleSupermarketToggle}
        />

        {/* Filters */}
        <Filters
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          selectedProductType={selectedProductType}
          subfilters={subfilters}
          availableProducts={availableProducts}
          hasAvailableProducts={hasAvailableProducts}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onProductTypeChange={handleProductTypeChange}
          onSubfilterChange={handleSubfilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Integrated Product Table - Show when product type is selected OR when there are comparison products */}
        {(selectedProductType || comparisonProducts.length > 0) && (
          <div>
            {/* Loading indicator */}
            {productsLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-blue-800">Cargando productos...</p>
                </div>
              </div>
            )}

            {/* Error indicator */}
            {productsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="text-red-600 mr-3">⚠️</div>
                  <div>
                    <p className="text-red-800 font-medium">Error al cargar productos</p>
                    <p className="text-red-600 text-sm">{productsError}</p>
                  </div>
                </div>
              </div>
            )}

            <IntegratedProductTable
              availableProducts={availableProducts}
              comparisonProducts={comparisonProducts}
              onProductToggle={handleProductToggle}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveProduct={handleRemoveProduct}
              onRemoveAll={handleRemoveAll}
            />
          </div>
        )}

        {/* Comparison Table - Show when there are products to compare */}
        {comparisonProducts.length > 0 && (
          <div id="comparacion" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparación de Precios</h2>
              <p className="text-gray-600">Compara precios entre diferentes supermercados y encuentra la mejor oferta.</p>
            </div>
            <ComparisonTable
              comparisonProducts={comparisonProducts}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveProduct={handleRemoveProduct}
              selectedSupermarkets={selectedSupermarkets}
            />

            {/* Final Results Table */}
            <FinalResultsTable
              comparisonProducts={comparisonProducts}
              selectedSupermarkets={selectedSupermarkets}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Caminando Online - MVP Fase 1</p>
            <p className="text-sm mt-2">Plataforma de comparación de precios</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
