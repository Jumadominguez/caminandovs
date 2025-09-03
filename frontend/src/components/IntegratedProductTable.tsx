'use client';

import { useState } from 'react';

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

interface IntegratedProductTableProps {
  availableProducts: Product[];
  comparisonProducts: ComparisonProduct[];
  onProductToggle: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
  onRemoveAll: () => void;
  onCompare: () => void;
}

export default function IntegratedProductTable({
  availableProducts,
  comparisonProducts,
  onProductToggle,
  onQuantityChange,
  onRemoveProduct,
  onRemoveAll,
  onCompare
}: IntegratedProductTableProps) {
  const [viewMode, setViewMode] = useState<'available' | 'comparison'>('available');

  const totalProducts = comparisonProducts.length;
  const totalPrice = comparisonProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  // Combinar productos disponibles y de comparación para vista unificada
  const allProducts = availableProducts.map(product => ({
    ...product,
    isInComparison: comparisonProducts.some(cp => cp.id === product.id),
    comparisonQuantity: comparisonProducts.find(cp => cp.id === product.id)?.quantity || 0
  }));

  if (availableProducts.length === 0 && comparisonProducts.length === 0) {
    return (
      <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos Disponibles</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Selecciona una categoría, subcategoría y tipo de producto para ver los productos disponibles.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {viewMode === 'available' ? 'Productos Disponibles' : 'Productos a Comparar'} ({viewMode === 'available' ? availableProducts.length : totalProducts} productos)
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('available')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'available'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ver Disponibles
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'comparison'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ver Comparación ({totalProducts})
          </button>
          {comparisonProducts.length > 0 && (
            <button
              onClick={onRemoveAll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Limpiar Todo
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supermercado
              </th>
              {viewMode === 'comparison' && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(viewMode === 'available' ? allProducts : comparisonProducts.map(cp => ({ ...cp, isInComparison: true, comparisonQuantity: cp.quantity }))).map((product) => {
              const isInComparison = product.isInComparison;
              const quantity = product.comparisonQuantity || 0;

              return (
                <tr
                  key={product.id}
                  className={`transition-all duration-200 hover:bg-gray-50 ${
                    isInComparison ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="text-xs">
                      <div>Marca: {product.brand}</div>
                      <div>Variedad: {product.variety}</div>
                      <div>Envase: {product.package} - {product.size}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.supermarket}
                  </td>
                  {viewMode === 'comparison' && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onQuantityChange(product.id, Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-medium"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onQuantityChange(product.id, quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-medium"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {viewMode === 'available' ? (
                      <button
                        onClick={() => onProductToggle(product.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          isInComparison
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {isInComparison ? '✓ Agregado' : '+ Agregar'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewMode === 'comparison' && comparisonProducts.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">
              Total estimado: ${totalPrice.toFixed(2)}
            </div>
            <button
              onClick={onCompare}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              🛒 Comparar Productos
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
