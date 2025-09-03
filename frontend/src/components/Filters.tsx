'use client';

import { useState, useEffect } from 'react';

interface FiltersProps {
  selectedCategory: string;
  selectedSubcategory: string;
  selectedProductType: string;
  subfilters: { [key: string]: string };
  availableProducts: any[];
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onProductTypeChange: (productType: string) => void;
  onSubfilterChange: (filterName: string, value: string) => void;
  onResetFilters: () => void;
}

const categories = {
  'Almacén': {
    'Aceites': ['Aceites de girasol', 'Aceites de oliva', 'Aceites mixtos'],
    'Fideos': ['Fideos secos', 'Fideos frescos', 'Fideos integrales'],
    'Salsas': ['Salsas de tomate', 'Salsas blancas', 'Salsas especiales']
  },
  'Bebidas': {
    'Gaseosas': ['Gaseosas de litro', 'Gaseosas de 2.25L', 'Gaseosas de 500ml'],
    'Vinos': ['Vinos tintos', 'Vinos blancos', 'Vinos rosados'],
    'Aguas': ['Aguas sin gas', 'Aguas con gas', 'Aguas saborizadas']
  },
  'Limpieza': {
    'Detergentes': ['Detergente para platos', 'Detergente para ropa', 'Detergente multiuso'],
    'Lavandinas': ['Lavandina común', 'Lavandina concentrada', 'Lavandina perfumada'],
    'Limpia Vidrios': ['Limpia vidrios concentrado', 'Limpia vidrios listo', 'Limpia vidrios antibacterial']
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
  availableProducts,
  onCategoryChange,
  onSubcategoryChange,
  onProductTypeChange,
  onSubfilterChange,
  onResetFilters
}: FiltersProps) {
  const [availableProductTypes, setAvailableProductTypes] = useState<string[]>([]);

  // Crear estructura jerárquica para el select único
  const hierarchicalOptions = Object.entries(categories).map(([category, subcategories]) => ({
    category,
    subcategories: Object.keys(subcategories)
  }));

  // Generar subfiltros dinámicos basados en productos disponibles
  const generateSubfilterOptions = (): { [key: string]: string[] } => {
    if (!availableProducts || availableProducts.length === 0) {
      return {};
    }

    const options = {
      marca: [...new Set(availableProducts.map(p => p.brand || p.marca || ''))].filter(Boolean).sort(),
      variedad: [...new Set(availableProducts.map(p => p.variety || p.variedad || ''))].filter(Boolean).sort(),
      envase: [...new Set(availableProducts.map(p => p.package || p.envase || ''))].filter(Boolean).sort(),
      tamaño: [...new Set(availableProducts.map(p => p.size || p.tamaño || ''))].filter(Boolean).sort()
    };

    return options;
  };

  const dynamicSubfilterOptions = generateSubfilterOptions();

  // Crear valor combinado para el select
  const selectedValue = selectedCategory && selectedSubcategory
    ? `${selectedCategory}|${selectedSubcategory}`
    : '';

  const handleHierarchicalChange = (value: string) => {
    if (value === '') {
      onCategoryChange('');
      onSubcategoryChange('');
      onProductTypeChange('');
      return;
    }

    const [category, subcategory] = value.split('|');
    onCategoryChange(category);
    onSubcategoryChange(subcategory);
    onProductTypeChange('');
  };

  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      const categoryData = categories[selectedCategory as keyof typeof categories];
      if (categoryData && selectedSubcategory) {
        setAvailableProductTypes(categoryData[selectedSubcategory as keyof typeof categoryData] || []);
        // No resetear selectedProductType aquí, mantener la selección actual
      }
    } else {
      setAvailableProductTypes([]);
    }
  }, [selectedCategory, selectedSubcategory]);

  // Resetear subfiltros cuando cambie el tipo de producto
  useEffect(() => {
    if (selectedProductType) {
      // Resetear subfiltros cuando cambie el tipo de producto
      const resetSubfilters: { [key: string]: string } = {};
      Object.keys(dynamicSubfilterOptions).forEach(key => {
        resetSubfilters[key] = '';
      });
      // Solo resetear si hay cambios en los subfiltros
      const hasChanges = Object.keys(subfilters).some(key => subfilters[key] !== '');
      if (hasChanges) {
        Object.keys(dynamicSubfilterOptions).forEach(filterName => {
          onSubfilterChange(filterName, '');
        });
      }
    }
  }, [selectedProductType, dynamicSubfilterOptions, subfilters, onSubfilterChange]);

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
            Categoría y Subcategoría
          </label>
          <select
            value={selectedValue}
            onChange={(e) => handleHierarchicalChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar categoría y subcategoría...</option>
            {hierarchicalOptions.map((option) => (
              <optgroup key={option.category} label={option.category}>
                {option.subcategories.map((subcategory) => (
                  <option
                    key={`${option.category}|${subcategory}`}
                    value={`${option.category}|${subcategory}`}
                  >
                    {subcategory}
                  </option>
                ))}
              </optgroup>
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
              {selectedSubcategory ? 'Seleccionar tipo de producto...' : 'Primero selecciona subcategoría'}
            </option>
            {availableProductTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {selectedSubcategory && !selectedProductType && (
            <p className="text-xs text-gray-500 mt-1">
              Selecciona un tipo de producto para ver los filtros avanzados y productos disponibles
            </p>
          )}
        </div>
      </div>

      {/* Subfiltros - aparecen cuando se selecciona un tipo de producto */}
      {selectedProductType && dynamicSubfilterOptions && Object.keys(dynamicSubfilterOptions).length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Subfiltros</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dynamicSubfilterOptions).map(([filterName, options]) => (
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
                  {options && options.length > 0 ? (
                    options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))
                  ) : (
                    <option disabled>No hay opciones disponibles</option>
                  )}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
