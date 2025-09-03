'use client';

import { useState, useEffect } from 'react';
import ComparisonTable from '../../components/ComparisonTable';

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

export default function ProductosComparados() {
  const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([]);

  // Cargar productos del localStorage al montar el componente
  useEffect(() => {
    const savedProducts = localStorage.getItem('comparisonProducts');
    if (savedProducts) {
      try {
        setComparisonProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error loading comparison products:', error);
      }
    }
  }, []);

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('comparisonProducts', JSON.stringify(comparisonProducts));
  }, [comparisonProducts]);

  // Manejar actualización de cantidad
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setComparisonProducts(prev =>
      prev.map(product =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  // Manejar eliminación de producto
  const handleRemoveProduct = (productId: string) => {
    setComparisonProducts(prev => prev.filter(product => product.id !== productId));
  };

  // Manejar eliminación de todos los productos
  const handleRemoveAll = () => {
    setComparisonProducts([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Comparación de Precios
        </h1>
        <p className="text-gray-600">
          Compara precios de productos entre diferentes supermercados y encuentra la mejor oferta.
        </p>
      </div>

      {comparisonProducts.length > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleRemoveAll}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Limpiar Comparación
          </button>
        </div>
      )}

      <ComparisonTable
        comparisonProducts={comparisonProducts}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveProduct={handleRemoveProduct}
      />

      {comparisonProducts.length === 0 && (
        <div className="mt-8 text-center">
          <div className="text-gray-500 text-lg mb-2">No hay productos para comparar</div>
          <div className="text-gray-400 text-sm mb-4">
            Regresa a la página principal y selecciona productos para comparar sus precios.
          </div>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir a la página principal
          </a>
        </div>
      )}
    </div>
  );
}
