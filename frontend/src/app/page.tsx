'use client';

import { useState, useEffect } from 'react';
import SupermarketSelector from '../components/SupermarketSelector';
import Filters from '../components/Filters';
import ProductTable from '../components/ProductTable';
import ComparisonTable from '../components/ComparisonTable';
import { sampleProducts } from '../data/sampleData';

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
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleProductTypeChange = (productType: string) => {
    setSelectedProductType(productType);
  };

  const handleSubfilterChange = (filterName: string, value: string) => {
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
  const handleQuantityChange = (productId: string, quantity: number) => {
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

  // Manejar comparación de productos
  const handleCompare = () => {
    // Aquí iría la lógica para navegar a la página de comparación
    console.log('Comparando productos:', comparisonProducts);
    // Por ahora, solo mostramos en consola
    alert('Funcionalidad de comparación próximamente disponible');
  };

  // Actualizar productos disponibles cuando cambia el tipo de producto
  useEffect(() => {
    if (selectedProductType && sampleProducts[selectedProductType as keyof typeof sampleProducts]) {
      let products = sampleProducts[selectedProductType as keyof typeof sampleProducts];

      // Filtrar por supermercados seleccionados
      products = products.filter(product =>
        selectedSupermarkets.includes(product.supermarket.toLowerCase())
      );

      // Aplicar subfiltros
      if (subfilters.marca && subfilters.marca !== 'Otra') {
        products = products.filter(product => product.brand === subfilters.marca);
      }
      if (subfilters.variedad) {
        products = products.filter(product => product.variety === subfilters.variedad);
      }
      if (subfilters.envase) {
        products = products.filter(product => product.package === subfilters.envase);
      }
      if (subfilters.tamaño) {
        products = products.filter(product => product.size === subfilters.tamaño);
      }

      setAvailableProducts(products);
    } else {
      setAvailableProducts([]);
    }
  }, [selectedProductType, selectedSupermarkets, subfilters]);

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
              <a href="/" className="text-blue-600 font-medium">Inicio</a>
              <a href="/productos-comparados" className="text-gray-600 hover:text-gray-900">Comparar</a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
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
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onProductTypeChange={handleProductTypeChange}
          onSubfilterChange={handleSubfilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Product Table */}
        <ProductTable
          products={availableProducts}
          selectedProducts={selectedProductIds}
          onProductToggle={handleProductToggle}
        />

        {/* Comparison Table */}
        <ComparisonTable
          products={comparisonProducts}
          onQuantityChange={handleQuantityChange}
          onRemoveProduct={handleRemoveProduct}
          onRemoveAll={handleRemoveAll}
          onCompare={handleCompare}
        />
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
