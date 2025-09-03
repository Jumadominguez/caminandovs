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
  image?: string;
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

function ProductTooltip({ product, children }: { product: ComparisonProduct; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-80 left-0 top-full mt-2">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <img
                src={product.image || '/placeholder-product.png'}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md border border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/64x64?text=Producto';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h4>
              <div className="mt-1 space-y-1">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Marca:</span> {product.brand}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Variedad:</span> {product.variety}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Empaque:</span> {product.package}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Tamaño:</span> {product.size}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparisonTable({
  comparisonProducts,
  onUpdateQuantity,
  onRemoveProduct
}: ComparisonTableProps) {
  // Estado para almacenar precios base por producto
  const [basePrices, setBasePrices] = useState<{ [key: string]: { [supermarket: string]: number | null } }>({});

  // Función para obtener precios base por supermercado (solo se genera una vez por producto)
  const getBasePricesBySupermarket = (productId: string, productName: string, brand: string, variety: string, packageType: string, size: string) => {
    if (basePrices[productId]) {
      return basePrices[productId];
    }

    const prices: { [key: string]: number | null } = {};

    SUPERMERCADOS.forEach(supermarket => {
      // Aquí iría la lógica para buscar el precio específico por supermercado
      // Por ahora generamos precios aleatorios una sola vez
      prices[supermarket] = Math.floor(Math.random() * 30) + 70; // Precio entre 70 y 100
    });

    // Guardar los precios base
    setBasePrices(prev => ({
      ...prev,
      [productId]: prices
    }));

    return prices;
  };

  // Función para obtener precios finales multiplicados por cantidad
  const getPricesBySupermarket = (productId: string, productName: string, brand: string, variety: string, packageType: string, size: string, quantity: number) => {
    const basePrices = getBasePricesBySupermarket(productId, productName, brand, variety, packageType, size);
    const prices: { [key: string]: number | null } = {};

    Object.entries(basePrices).forEach(([supermarket, basePrice]) => {
      prices[supermarket] = basePrice ? basePrice * quantity : null;
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
                product.id,
                product.name,
                product.brand,
                product.variety,
                product.package,
                product.size,
                product.quantity
              );
              const lowestPriceInfo = findLowestPriceAndSupermarket(prices);
              const lowestPrice = lowestPriceInfo.price;
              const lowestSupermarket = lowestPriceInfo.supermarket;

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  {/* Nombre del producto */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductTooltip product={product}>
                      <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                        {product.name}
                      </div>
                    </ProductTooltip>
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
