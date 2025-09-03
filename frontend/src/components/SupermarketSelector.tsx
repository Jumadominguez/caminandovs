'use client';

import { useState } from 'react';

interface SupermarketSelectorProps {
  selectedSupermarkets: string[];
  onSupermarketToggle: (supermarket: string) => void;
}

const supermarkets = [
  { id: 'carrefour', name: 'Carrefour', logo: '🏪' },
  { id: 'disco', name: 'Disco', logo: '🛒' },
  { id: 'jumbo', name: 'Jumbo', logo: '🏬' },
  { id: 'dia', name: 'Dia', logo: '🏪' },
  { id: 'vea', name: 'Vea', logo: '🛍️' }
];

export default function SupermarketSelector({ selectedSupermarkets, onSupermarketToggle }: SupermarketSelectorProps) {
  return (
    <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Seleccionar Supermercados</h2>
      <div className="grid grid-cols-5 gap-4">
        {supermarkets.map((supermarket) => {
          const isSelected = selectedSupermarkets.includes(supermarket.id);
          return (
            <div
              key={supermarket.id}
              onClick={() => onSupermarketToggle(supermarket.id)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className={`text-3xl mb-2 ${isSelected ? '' : 'grayscale opacity-50'}`}>
                {supermarket.logo}
              </div>
              <div className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                {supermarket.name}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
