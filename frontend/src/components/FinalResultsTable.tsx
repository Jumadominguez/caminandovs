'use client';

import { useState, useEffect } from 'react';

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

interface FinalResultsTableProps {
  comparisonProducts: ComparisonProduct[];
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

export default function FinalResultsTable({
  comparisonProducts,
  selectedSupermarkets = ['carrefour', 'jumbo', 'disco', 'vea', 'dia']
}: FinalResultsTableProps) {
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

  // Función para encontrar el mejor precio considerando frecuencia histórica
  const findBestPriceForCaminandoOnline = (basePrices: { [supermarket: string]: number | null }): number => {
    const validPrices = selectedSupermarketNames
      .map(supermarket => ({ supermarket, price: basePrices[supermarket] }))
      .filter(item => item.price !== null)
      .sort((a, b) => a.price! - b.price!);

    if (validPrices.length === 0) return 0;

    // Si solo hay un precio, devolverlo
    if (validPrices.length === 1) return validPrices[0].price!;

    // Encontrar todos los precios más bajos
    const lowestPrice = validPrices[0].price!;
    const candidates = validPrices.filter(item => item.price === lowestPrice);

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

      return bestCandidate.price!;
    }

    return lowestPrice;
  };

  // Calcular totales por supermercado
  const calculateTotals = () => {
    const totals: { [supermarket: string]: number } = {};
    let caminandoOnlineTotal = 0;

    // Inicializar totales en 0
    selectedSupermarketNames.forEach(supermarket => {
      totals[supermarket] = 0;
    });

    // Sumar precios de todos los productos
    comparisonProducts.forEach(product => {
      const basePrices = getBasePricesBySupermarket(
        product.id,
        product.name,
        product.brand,
        product.variety,
        product.package,
        product.size
      );

      // Sumar a cada supermercado
      selectedSupermarketNames.forEach(supermarket => {
        const price = basePrices[supermarket];
        if (price !== null) {
          totals[supermarket] += price * product.quantity;
        }
      });

      // Calcular el mejor precio para Caminando Online usando lógica de frecuencia
      const bestPrice = findBestPriceForCaminandoOnline(basePrices);
      caminandoOnlineTotal += bestPrice * product.quantity;
    });

    return { supermarketTotals: totals, caminandoOnlineTotal };
  };

  const { supermarketTotals, caminandoOnlineTotal } = calculateTotals();

  // Calcular promedio de los supermercados (excluyendo Caminando Online)
  const calculateAverageSupermarketTotal = () => {
    const supermarketPrices = Object.values(supermarketTotals);
    const sum = supermarketPrices.reduce((acc, price) => acc + price, 0);
    return sum / supermarketPrices.length;
  };

  const averageSupermarketTotal = calculateAverageSupermarketTotal();
  const savings = averageSupermarketTotal - caminandoOnlineTotal;
  const savingsPercentage = ((savings / averageSupermarketTotal) * 100);

  if (comparisonProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-visible mt-8">
      <div className="px-6 py-4 bg-green-50 border-b border-green-200">
        <h2 className="text-xl font-semibold text-green-900">
          🏆 Resultados Finales - Total de la Compra
        </h2>
        <p className="text-sm text-green-700 mt-1">
          Suma total de todos los productos por supermercado
        </p>
      </div>

      <div className="overflow-visible">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-green-50">
            <tr>
              {selectedSupermarketNames.map(supermarket => (
                <th key={supermarket} className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  {supermarket}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider font-bold bg-blue-50">
                Caminando Online
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              {/* Totales por supermercado */}
              {selectedSupermarketNames.map(supermarket => {
                const total = supermarketTotals[supermarket];

                return (
                  <td key={supermarket} className="px-6 py-6 whitespace-nowrap">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        ${total.toFixed(2)}
                      </div>
                    </div>
                  </td>
                );
              })}

              {/* Total Caminando Online */}
              <td className="px-6 py-6 whitespace-nowrap bg-blue-50">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    ${caminandoOnlineTotal.toFixed(2)}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cartel de Felicitaciones */}
      <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-6 text-center text-white">
        <div className="flex items-center justify-center mb-2">
          <span className="text-3xl mr-3">🎉</span>
          <h3 className="text-2xl font-bold">¡Felicitaciones!</h3>
        </div>
        <p className="text-lg mb-2">
          Caminando Online te está ahorrando{' '}
          <span className="font-bold text-yellow-300 text-xl">
            ${savings.toFixed(2)}
          </span>
        </p>
        <p className="text-base">
          que representa un{' '}
          <span className="font-bold text-yellow-300 text-xl">
            {savingsPercentage.toFixed(1)}%
          </span>{' '}
          menos que el promedio de los supermercados
        </p>
      </div>

      {/* Botón de Compra */}
      <div className="mt-6 text-center">
        <button
          disabled
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-xl opacity-75 cursor-not-allowed transform hover:scale-105 transition-all duration-200"
        >
          🚀 ¡Compra Caminando! (Próximamente 😉)
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Esta funcionalidad estará disponible próximamente
        </p>
      </div>
    </div>
  );
}
