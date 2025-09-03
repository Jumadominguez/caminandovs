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
  selectedSupermarkets?: string[];
}

const SUPERMERCADOS = ['Carrefour', 'Jumbo', 'Disco', 'Vea', 'Dia'];

// Mapeo entre IDs del selector y nombres de supermercados
const SUPERMERCADO_MAPPING: { [key: string]: string } = {
  'carrefour': 'Carrefour',
  'jumbo': 'Jumbo',
  'disco': 'Disco',
  'vea': 'Vea',
  'dia': 'Dia'
};

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
        <div className="absolute z-[2147483647] p-4 bg-white border border-gray-200 rounded-lg shadow-2xl w-80 left-0 top-full mt-2">
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
  onRemoveProduct,
  selectedSupermarkets = ['carrefour', 'jumbo', 'disco', 'vea', 'dia']
}: ComparisonTableProps) {
  // Si no hay supermercados seleccionados, no mostrar la tabla
  if (selectedSupermarkets.length === 0) {
    return null;
  }

  // Estado para almacenar precios base por producto
  const [basePrices, setBasePrices] = useState<{ [key: string]: { [supermarket: string]: number | null } }>({});

  // Convertir IDs de supermercados seleccionados a nombres para mostrar (manteniendo orden fijo)
  const selectedSupermarketNames = selectedSupermarkets
    .map(id => SUPERMERCADO_MAPPING[id])
    .filter(Boolean)
    .sort((a, b) => {
      // Mantener orden fijo: Carrefour, Jumbo, Disco, Vea, Dia
      const order = ['Carrefour', 'Jumbo', 'Disco', 'Vea', 'Dia'];
      return order.indexOf(a) - order.indexOf(b);
    });

  // Función para obtener precios base por supermercado (solo se genera una vez por producto)
  const getBasePricesBySupermarket = (productId: string, productName: string, brand: string, variety: string, packageType: string, size: string) => {
    if (basePrices[productId]) {
      return basePrices[productId];
    }

    const prices: { [key: string]: number | null } = {};

    selectedSupermarketNames.forEach(supermarket => {
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

  // Función para calcular la frecuencia de precios bajos por supermercado
  const calculateSupermarketFrequency = () => {
    const frequency: { [supermarket: string]: number } = {};

    // Inicializar frecuencia en 0
    selectedSupermarketNames.forEach(supermarket => {
      frequency[supermarket] = 0;
    });

    // Calcular frecuencia de precios bajos para todos los productos
    comparisonProducts.forEach(product => {
      const basePrices = getBasePricesBySupermarket(
        product.id,
        product.name,
        product.brand,
        product.variety,
        product.package,
        product.size
      );

      // Encontrar el precio más bajo para este producto
      let lowestPrice = Infinity;
      Object.values(basePrices).forEach(price => {
        if (price !== null && price < lowestPrice) {
          lowestPrice = price;
        }
      });

      // Incrementar frecuencia para supermercados que tienen el precio más bajo
      Object.entries(basePrices).forEach(([supermarket, price]) => {
        if (price === lowestPrice) {
          frequency[supermarket]++;
        }
      });
    });

    return frequency;
  };

  const supermarketFrequency = calculateSupermarketFrequency();

  // Función para encontrar el precio más barato y el supermercado correspondiente (solo de supermercados seleccionados)
  const findLowestPriceAndSupermarket = (prices: { [key: string]: number | null }): { price: number | null; supermarket: string | null } => {
    let lowestPrice: number | null = null;
    let lowestSupermarket: string | null = null;
    let candidates: Array<{ supermarket: string; price: number }> = [];

    // Primero encontrar todos los supermercados con el precio más bajo
    Object.entries(prices).forEach(([supermarket, price]) => {
      if (price !== null) {
        if (lowestPrice === null || price < lowestPrice) {
          lowestPrice = price;
          candidates = [{ supermarket, price }];
        } else if (price === lowestPrice) {
          candidates.push({ supermarket, price });
        }
      }
    });

    // Si hay múltiples candidatos con el mismo precio, elegir el que tiene más frecuencia histórica
    if (candidates.length > 1) {
      let bestCandidate = candidates[0];
      let highestFrequency = supermarketFrequency[bestCandidate.supermarket] || 0;

      candidates.forEach(candidate => {
        const frequency = supermarketFrequency[candidate.supermarket] || 0;
        if (frequency > highestFrequency) {
          highestFrequency = frequency;
          bestCandidate = candidate;
        }
      });

      lowestSupermarket = bestCandidate.supermarket;
    } else if (candidates.length === 1) {
      lowestSupermarket = candidates[0].supermarket;
    }

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
    <div className="bg-white rounded-lg shadow-md overflow-visible">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Comparación de Precios ({comparisonProducts.length} productos)
        </h2>
      </div>

      <div className="overflow-visible">
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
              {selectedSupermarketNames.map(supermarket => (
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
                  {selectedSupermarketNames.map(supermarket => {
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
