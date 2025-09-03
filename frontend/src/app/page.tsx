'use client';

import { useState, useEffect } from 'react';
import SupermarketSelector from '../components/SupermarketSelector';
import Filters from '../components/Filters';
import IntegratedProductTable from '../components/IntegratedProductTable';
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
    console.log('Filtering products for:', selectedProductType);
    console.log('Current subfilters:', subfilters);
    console.log('Selected supermarkets:', selectedSupermarkets);

    if (selectedProductType && sampleProducts[selectedProductType as keyof typeof sampleProducts]) {
      let products = sampleProducts[selectedProductType as keyof typeof sampleProducts];
      console.log('Initial products count:', products.length);

      // Filtrar por supermercados seleccionados
      console.log('Filtering by supermarkets:', selectedSupermarkets);
      const beforeSupermarketFilter = products.length;
      products = products.filter(product => {
        const productSupermarket = product.supermarket.toLowerCase();
        const matches = selectedSupermarkets.some(sm => {
          const selectedSm = sm.toLowerCase();
          const match = selectedSm === productSupermarket;
          if (!match) {
            console.log('Supermarket filter: product supermarket:', productSupermarket, 'does not match selected:', selectedSm);
          }
          return match;
        });
        if (!matches) {
          console.log('Product', product.name, 'supermarket:', product.supermarket, 'not in selected supermarkets');
        }
        return matches;
      });
      console.log('After supermarket filter:', products.length, '(filtered out:', beforeSupermarketFilter - products.length, ')');

      // Aplicar subfiltros
      if (subfilters.marca) {
        if (subfilters.marca === 'Otra') {
          console.log('Skipping marca filter for "Otra"');
        } else {
          console.log('Applying marca filter:', subfilters.marca);
          const beforeCount = products.length;
          products = products.filter(product => {
            const matches = product.brand === subfilters.marca;
            if (!matches) {
              console.log('Product', product.name, 'brand:', product.brand, 'does not match filter:', subfilters.marca);
            }
            return matches;
          });
          console.log('After marca filter:', products.length, '(filtered out:', beforeCount - products.length, ')');
        }
      }
      if (subfilters.variedad) {
        console.log('Applying variedad filter:', subfilters.variedad);
        const beforeCount = products.length;
        products = products.filter(product => {
          const matches = product.variety === subfilters.variedad;
          if (!matches) {
            console.log('Product', product.name, 'variety:', product.variety, 'does not match filter:', subfilters.variedad);
          }
          return matches;
        });
        console.log('After variedad filter:', products.length, '(filtered out:', beforeCount - products.length, ')');
      }
      if (subfilters.envase) {
        console.log('Applying envase filter:', subfilters.envase);
        const beforeCount = products.length;
        products = products.filter(product => {
          const matches = product.package === subfilters.envase;
          if (!matches) {
            console.log('Product', product.name, 'package:', product.package, 'does not match filter:', subfilters.envase);
          }
          return matches;
        });
        console.log('After envase filter:', products.length, '(filtered out:', beforeCount - products.length, ')');
      }
      if (subfilters.tamaño) {
        console.log('Applying tamaño filter:', subfilters.tamaño);
        const beforeCount = products.length;
        products = products.filter(product => {
          const matches = product.size === subfilters.tamaño;
          if (!matches) {
            console.log('Product', product.name, 'size:', product.size, 'does not match filter:', subfilters.tamaño);
          }
          return matches;
        });
        console.log('After tamaño filter:', products.length, '(filtered out:', beforeCount - products.length, ')');
      }

      console.log('Final products count:', products.length);
      setAvailableProducts(products);
    } else {
      console.log('No products found for type:', selectedProductType);
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

        {/* Integrated Product Table - Only show when product type is selected */}
        {selectedProductType && (
          <IntegratedProductTable
            availableProducts={availableProducts}
            comparisonProducts={comparisonProducts}
            onProductToggle={handleProductToggle}
            onQuantityChange={handleQuantityChange}
            onRemoveProduct={handleRemoveProduct}
            onRemoveAll={handleRemoveAll}
            onCompare={handleCompare}
          />
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
