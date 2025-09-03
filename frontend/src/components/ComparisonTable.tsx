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

interface ComparisonTableProps {
  comparisonProducts: ComparisonProduct[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
}

const SUPERMERCADOS = ['Carrefour', 'Jumbo', 'Disco', 'Vea', 'Dia'];

export default function ComparisonTable({
  comparisonProducts,
  onUpdateQuantity,
  onRemoveProduct
}: ComparisonTableProps) {
  // Función para obtener el precio más barato de un producto
  const getLowestPrice = (productName: string, brand: string, variety: string, packageType: string, size: string) => {
    // Aquí iría la lógica para buscar el precio más barato
    // Por ahora retornamos un precio de ejemplo
    return Math.floor(Math.random() * 50) + 50; // Precio entre 50 y 100
  };

  // Función para obtener precios por supermercado
  const getPricesBySupermarket = (productName: string, brand: string, variety: string, packageType: string, size: string) => {
    const prices: { [key: string]: number | null } = {};

    SUPERMERCADOS.forEach(supermarket => {
      // Aquí iría la lógica para buscar el precio específico por supermercado
      // Por ahora generamos precios aleatorios
      prices[supermarket] = Math.floor(Math.random() * 30) + 70; // Precio entre 70 y 100
    });

    return prices;
  };

  // Función para encontrar el precio más barato y el supermercado correspondiente
  const findLowestPriceAndSupermarket = (prices: { [key: string]: number | null }): { price: number | null; supermarket: string | null } => {
    let lowestPrice: number | null = null;
    let lowestSupermarket: string | null = null;

    Object.entries(prices).forEach(([supermarket, price]) => {
      if (price !== null && (lowestPrice === null || price < lowestPrice)) {
        lowestPrice = price;
        lowestSupermarket = supermarket;
      }
    });

    return { price: lowestPrice, supermarket: lowestSupermarket };
  };

  if (comparisonProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500 text-lg mb-2">No hay productos para comparar</div>
        <div className="text-gray-400 text-sm">Selecciona productos de la tabla principal para comenzar la comparación</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Comparación de Precios ({comparisonProducts.length} productos)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              {SUPERMERCADOS.map(supermarket => (
                <th key={supermarket} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {supermarket}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider font-bold bg-blue-50">
                Caminando Online
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisonProducts.map((product) => {
              const prices = getPricesBySupermarket(
                product.name,
                product.brand,
                product.variety,
                product.package,
                product.size
              );
              const lowestPriceInfo = findLowestPriceAndSupermarket(prices);
              const lowestPrice = lowestPriceInfo.price;
              const lowestSupermarket = lowestPriceInfo.supermarket;

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  {/* Nombre del producto */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.brand} • {product.variety} • {product.package} • {product.size}
                    </div>
                  </td>

                  {/* Contador de cantidad */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(product.id, Math.max(1, product.quantity - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-medium transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm font-medium">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-medium transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Precios por supermercado */}
                  {SUPERMERCADOS.map(supermarket => {
                    const price = prices[supermarket];
                    const isLowest = price === lowestPrice;

                    return (
                      <td key={supermarket} className="px-6 py-4 whitespace-nowrap">
                        {price ? (
                          <span className={`text-sm font-medium ${isLowest ? 'text-green-600 font-bold' : 'text-gray-900'}`}>
                            ${price.toFixed(2)}
                            {isLowest && <span className="ml-1 text-xs">★</span>}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Precio Caminando Online */}
                  <td className="px-6 py-4 whitespace-nowrap bg-blue-50">
                    <div className="text-sm">
                      <div className="font-bold text-blue-600">
                        {lowestPrice ? `$${lowestPrice.toFixed(2)}` : '-'}
                      </div>
                      {lowestSupermarket && lowestPrice && (
                        <div className="text-xs text-blue-500">
                          via {lowestSupermarket}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Botón de eliminar */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
