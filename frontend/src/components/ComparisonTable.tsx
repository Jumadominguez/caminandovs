'use client';

import { useState } from 'react';

interface ComparisonProduct {
  id: string;
  name: string;
  brand: string;
  variety: string;
  package: string;
  size: string;
  price: number;
  supermarket: string;
  quantity: number;
}

interface ComparisonTableProps {
  products: ComparisonProduct[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
  onRemoveAll: () => void;
  onCompare: () => void;
}

export default function ComparisonTable({
  products,
  onQuantityChange,
  onRemoveProduct,
  onRemoveAll,
  onCompare
}: ComparisonTableProps) {
  if (products.length === 0) {
    return null;
  }

  const totalProducts = products.length;

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Productos a Comparar ({totalProducts} productos)
        </h2>
        <button
          onClick={onRemoveAll}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Eliminar Todos
        </button>
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
                Cantidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div className="text-xs">
                    <div>Marca: {product.brand}</div>
                    <div>Variedad: {product.variety}</div>
                    <div>Envase: {product.package} - {product.size}</div>
                    <div>Supermercado: {product.supermarket}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onQuantityChange(product.id, Math.max(1, product.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-medium"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-medium">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => onQuantityChange(product.id, product.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total y botón de comparar */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-end">
          <button
            onClick={onCompare}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            🛒 Comparar Productos
          </button>
        </div>
      </div>
    </section>
  );
}
