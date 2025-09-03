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

      // Calcular el precio más bajo para Caminando Online
      const prices = selectedSupermarketNames.map(supermarket => basePrices[supermarket]).filter(price => price !== null);
      const lowestPrice = Math.min(...prices);
      caminandoOnlineTotal += lowestPrice * product.quantity;
    });

    return { supermarketTotals: totals, caminandoOnlineTotal };
  };

  const { supermarketTotals, caminandoOnlineTotal } = calculateTotals();

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
    </div>
  );
}
