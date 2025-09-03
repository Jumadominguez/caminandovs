'use client';

import { useState, useEffect } from 'react';

interface FiltersProps {
  selectedCategory: string;
  selectedSubcategory: string;
  selectedProductType: string;
  subfilters: { [key: string]: string };
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onProductTypeChange: (productType: string) => void;
  onSubfilterChange: (filterName: string, value: string) => void;
  onResetFilters: () => void;
}

const categories = {
  'Bebidas': {
    'Gaseosas': ['Gaseosas de litro', 'Gaseosas de 2.25L', 'Gaseosas de 500ml'],
    'Cervezas': ['Cervezas rubias', 'Cervezas negras', 'Cervezas artesanales'],
    'Vinos': ['Vinos tintos', 'Vinos blancos', 'Vinos rosados']
  },
  'Almacén': {
    'Aceites': ['Aceites de girasol', 'Aceites de oliva', 'Aceites mixtos'],
    'Arroces': ['Arroz blanco', 'Arroz integral', 'Arroz parboil'],
    'Fideos': ['Fideos secos', 'Fideos frescos', 'Fideos integrales']
  },
  'Limpieza': {
    'Detergentes': ['Detergente para platos', 'Detergente para ropa', 'Detergente multiuso'],
    'Desodorantes': ['Desodorantes ambientales', 'Desodorantes de piso', 'Desodorantes de baño'],
    'Lavandinas': ['Lavandina común', 'Lavandina concentrada', 'Lavandina perfumada']
  }
};

const subfilterOptions = {
  'marca': ['Coca-Cola', 'Pepsi', 'Manaos', 'Otra'],
  'variedad': ['Clásica', 'Light', 'Zero', 'Dietética'],
  'envase': ['Botella', 'Lata', 'Tetra Pack', 'Vidrio'],
  'tamaño': ['500ml', '1L', '1.5L', '2L', '2.25L']
};

export default function Filters({
  selectedCategory,
  selectedSubcategory,
  selectedProductType,
  subfilters,
  onCategoryChange,
  onSubcategoryChange,
  onProductTypeChange,
  onSubfilterChange,
  onResetFilters
}: FiltersProps) {
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [availableProductTypes, setAvailableProductTypes] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      setAvailableSubcategories(Object.keys(categories[selectedCategory as keyof typeof categories]));
      setAvailableProductTypes([]);
      onSubcategoryChange('');
      onProductTypeChange('');
    }
  }, [selectedCategory, onSubcategoryChange, onProductTypeChange]);

  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      const categoryData = categories[selectedCategory as keyof typeof categories];
      setAvailableProductTypes(categoryData[selectedSubcategory as keyof typeof categoryData]);
      onProductTypeChange('');
    }
  }, [selectedCategory, selectedSubcategory, onProductTypeChange]);

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Resetear Filtros
        </button>
      </div>

      {/* Primera línea de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorías
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar categoría...</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Producto
          </label>
          <select
            value={selectedProductType}
            onChange={(e) => onProductTypeChange(e.target.value)}
            disabled={!selectedSubcategory}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {selectedSubcategory ? 'Seleccionar tipo...' : 'Primero selecciona subcategoría'}
            </option>
            {availableProductTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mostrar subcategorías cuando se selecciona una categoría */}
      {selectedCategory && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategorías
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar subcategoría...</option>
            {availableSubcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>
      )}

      {/* Subfiltros - aparecen cuando se selecciona un tipo de producto */}
      {selectedProductType && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Subfiltros</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(subfilterOptions).map(([filterName, options]) => (
              <div key={filterName}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {filterName}
                </label>
                <select
                  value={subfilters[filterName] || ''}
                  onChange={(e) => onSubfilterChange(filterName, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
