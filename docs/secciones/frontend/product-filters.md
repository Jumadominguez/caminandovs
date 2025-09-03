# Product Filters - Módulo de Filtros de Productos

[El módulo Product Filters implementa el sistema de filtros dinámicos que permite a los usuarios navegar por la jerarquía de productos de manera intuitiva. Incluye categorías, subcategorías, tipos de producto y subfiltros que se activan progresivamente.]

## 📁 Estructura del Módulo

```
modules/product-filters/
├── components/
│   ├── ProductFilters.tsx        # Componente principal
│   ├── CategorySelector.tsx      # Selector de categorías
│   ├── SubcategorySelector.tsx   # Selector de subcategorías
│   ├── ProductTypeSelector.tsx   # Selector de tipos de producto
│   ├── SubfiltersPanel.tsx       # Panel de subfiltros
│   ├── FilterChips.tsx           # Chips de filtros activos
│   └── ResetFiltersButton.tsx    # Botón de reset
├── hooks/
│   ├── useProductFilters.ts      # Hook principal de filtros
│   ├── useFilterHierarchy.ts     # Hook para jerarquía de filtros
│   └── useFilterPersistence.ts   # Hook para persistencia
├── styles/
│   ├── filters.module.css        # Estilos principales
│   ├── selectors.css              # Estilos de selectores
│   ├── chips.css                  # Estilos de chips
│   └── animations.css             # Animaciones
├── types/
│   ├── filter.ts                  # Tipos de filtros
│   ├── hierarchy.ts               # Tipos de jerarquía
│   └── state.ts                   # Tipos de estado
├── utils/
│   ├── filterConfig.ts            # Configuración de filtros
│   ├── hierarchyHelpers.ts        # Utilidades de jerarquía
│   └── filterValidators.ts        # Validadores de filtros
├── index.ts                       # Export principal
└── README.md                      # Documentación
```

## 🎯 Funcionalidades

- **Jerarquía Dinámica**: Categorías → Subcategorías → Tipos → Subfiltros
- **Filtros Activos**: Visualización clara de filtros aplicados
- **Reset de Filtros**: Limpiar todos los filtros con un click
- **Persistencia**: Mantener filtros durante la sesión
- **Validación**: Validar jerarquía de filtros
- **Performance**: Optimización de queries de filtrado

## 🛠 Tecnologías Utilizadas

- **React**: Componentes con estado complejo
- **TypeScript**: Tipado fuerte para jerarquía de filtros
- **Tailwind CSS**: Estilos responsivos
- **React Hook Form**: Gestión de formularios complejos
- **Framer Motion**: Animaciones de expansión/contraacción
- **React Context**: Estado global de filtros

## 📋 Componentes Principales

### ProductFilters (Componente Principal)

```typescript
// modules/product-filters/components/ProductFilters.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductFilters } from '../hooks/useProductFilters'
import CategorySelector from './CategorySelector'
import SubcategorySelector from './SubcategorySelector'
import ProductTypeSelector from './ProductTypeSelector'
import SubfiltersPanel from './SubfiltersPanel'
import FilterChips from './FilterChips'
import ResetFiltersButton from './ResetFiltersButton'
import styles from '../styles/filters.module.css'

interface ProductFiltersProps {
  supermarkets: string[]
  onFiltersChange: (filters: ProductFilters) => void
  className?: string
}

export interface ProductFilters {
  category?: string
  subcategory?: string
  productType?: string
  subfilters: Record<string, any>
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  supermarkets,
  onFiltersChange,
  className = ''
}) => {
  const {
    filters,
    availableOptions,
    updateCategory,
    updateSubcategory,
    updateProductType,
    updateSubfilters,
    resetFilters,
    hasActiveFilters
  } = useProductFilters(supermarkets, onFiltersChange)

  return (
    <motion.div
      className={`${styles.filtersContainer} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.filtersHeader}>
        <h2 className={styles.title}>Filtrar Productos</h2>
        <ResetFiltersButton
          onReset={resetFilters}
          disabled={!hasActiveFilters}
        />
      </div>

      <div className={styles.filtersGrid}>
        <CategorySelector
          value={filters.category}
          options={availableOptions.categories}
          onChange={updateCategory}
          disabled={false}
        />

        <AnimatePresence>
          {filters.category && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubcategorySelector
                value={filters.subcategory}
                options={availableOptions.subcategories}
                onChange={updateSubcategory}
                disabled={!filters.category}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {filters.subcategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ProductTypeSelector
                value={filters.productType}
                options={availableOptions.productTypes}
                onChange={updateProductType}
                disabled={!filters.subcategory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {filters.productType && availableOptions.subfilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SubfiltersPanel
              subfilters={availableOptions.subfilters}
              values={filters.subfilters}
              onChange={updateSubfilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {hasActiveFilters && (
        <FilterChips
          filters={filters}
          onRemove={resetFilters}
        />
      )}
    </motion.div>
  )
}

export default ProductFilters
```

### CategorySelector

```typescript
// modules/product-filters/components/CategorySelector.tsx
import React from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/selectors.css'

interface CategoryOption {
  id: string
  name: string
  icon: string
  count: number
}

interface CategorySelectorProps {
  value?: string
  options: CategoryOption[]
  onChange: (categoryId: string) => void
  disabled: boolean
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  options,
  onChange,
  disabled
}) => {
  return (
    <div className={styles.selectorGroup}>
      <label className={styles.label}>
        Categoría
        <span className={styles.required}>*</span>
      </label>

      <div className={styles.optionsGrid}>
        {options.map((option) => (
          <motion.button
            key={option.id}
            className={`${styles.optionCard} ${
              value === option.id ? styles.selected : ''
            } ${disabled ? styles.disabled : ''}`}
            onClick={() => !disabled && onChange(option.id)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className={styles.optionIcon}>
              <span className="text-2xl">{option.icon}</span>
            </div>
            <div className={styles.optionContent}>
              <span className={styles.optionName}>{option.name}</span>
              <span className={styles.optionCount}>
                {option.count} productos
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default CategorySelector
```

## 🎣 Hooks Personalizados

### useProductFilters

```typescript
// modules/product-filters/hooks/useProductFilters.ts
import { useState, useEffect, useCallback } from 'react'
import { useFilterHierarchy } from './useFilterHierarchy'
import { useFilterPersistence } from './useFilterPersistence'
import { ProductFilters } from '../types/filter'

interface UseProductFiltersProps {
  supermarkets: string[]
  onFiltersChange: (filters: ProductFilters) => void
}

export const useProductFilters = ({ supermarkets, onFiltersChange }: UseProductFiltersProps) => {
  const { hierarchy, getAvailableOptions } = useFilterHierarchy(supermarkets)
  const { saveFilters, loadFilters } = useFilterPersistence()

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    subfilters: {}
  }))

  // Cargar filtros guardados al inicializar
  useEffect(() => {
    const savedFilters = loadFilters()
    if (savedFilters) {
      setFilters(savedFilters)
    }
  }, [loadFilters])

  // Notificar cambios de filtros
  useEffect(() => {
    onFiltersChange(filters)
    saveFilters(filters)
  }, [filters, onFiltersChange, saveFilters])

  const updateCategory = useCallback((categoryId: string) => {
    setFilters(prev => ({
      category: categoryId,
      subcategory: undefined, // Reset subcategoría
      productType: undefined, // Reset tipo de producto
      subfilters: {} // Reset subfiltros
    }))
  }, [])

  const updateSubcategory = useCallback((subcategoryId: string) => {
    setFilters(prev => ({
      ...prev,
      subcategory: subcategoryId,
      productType: undefined, // Reset tipo de producto
      subfilters: {} // Reset subfiltros
    }))
  }, [])

  const updateProductType = useCallback((productTypeId: string) => {
    setFilters(prev => ({
      ...prev,
      productType: productTypeId,
      subfilters: {} // Reset subfiltros
    }))
  }, [])

  const updateSubfilters = useCallback((subfilters: Record<string, any>) => {
    setFilters(prev => ({
      ...prev,
      subfilters
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      subfilters: {}
    })
  }, [])

  const availableOptions = getAvailableOptions(filters)
  const hasActiveFilters = Boolean(
    filters.category || filters.subcategory || filters.productType ||
    Object.keys(filters.subfilters).length > 0
  )

  return {
    filters,
    availableOptions,
    updateCategory,
    updateSubcategory,
    updateProductType,
    updateSubfilters,
    resetFilters,
    hasActiveFilters
  }
}
```

### useFilterHierarchy

```typescript
// modules/product-filters/hooks/useFilterHierarchy.ts
import { useState, useEffect } from 'react'
import { getFilterHierarchy } from '../utils/filterConfig'
import { FilterHierarchy, ProductFilters } from '../types/hierarchy'

export const useFilterHierarchy = (supermarkets: string[]) => {
  const [hierarchy, setHierarchy] = useState<FilterHierarchy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHierarchy = async () => {
      try {
        setLoading(true)
        const data = await getFilterHierarchy(supermarkets)
        setHierarchy(data)
      } catch (error) {
        console.error('Error loading filter hierarchy:', error)
      } finally {
        setLoading(false)
      }
    }

    if (supermarkets.length > 0) {
      loadHierarchy()
    }
  }, [supermarkets])

  const getAvailableOptions = (currentFilters: ProductFilters) => {
    if (!hierarchy) {
      return {
        categories: [],
        subcategories: [],
        productTypes: [],
        subfilters: []
      }
    }

    const categories = hierarchy.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      count: cat.productCount
    }))

    let subcategories = []
    if (currentFilters.category) {
      const category = hierarchy.categories.find(c => c.id === currentFilters.category)
      subcategories = category?.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        count: sub.productCount
      })) || []
    }

    let productTypes = []
    if (currentFilters.subcategory) {
      const category = hierarchy.categories.find(c => c.id === currentFilters.category)
      const subcategory = category?.subcategories.find(s => s.id === currentFilters.subcategory)
      productTypes = subcategory?.productTypes.map(type => ({
        id: type.id,
        name: type.name,
        count: type.productCount
      })) || []
    }

    let subfilters = []
    if (currentFilters.productType) {
      const category = hierarchy.categories.find(c => c.id === currentFilters.category)
      const subcategory = category?.subcategories.find(s => s.id === currentFilters.subcategory)
      const productType = subcategory?.productTypes.find(t => t.id === currentFilters.productType)
      subfilters = productType?.subfilters || []
    }

    return {
      categories,
      subcategories,
      productTypes,
      subfilters
    }
  }

  return {
    hierarchy,
    loading,
    getAvailableOptions
  }
}
```

## 🎨 Estilos del Módulo

### filters.module.css

```css
/* modules/product-filters/styles/filters.module.css */
.filtersContainer {
  @apply bg-white rounded-lg shadow-lg p-6;
}

.filtersHeader {
  @apply flex items-center justify-between mb-6;
}

.title {
  @apply text-2xl font-bold text-gray-800;
}

.filtersGrid {
  @apply space-y-6;
}

.selectorGroup {
  @apply space-y-3;
}

.label {
  @apply block text-sm font-medium text-gray-700;
}

.required {
  @apply text-red-500 ml-1;
}

.optionsGrid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3;
}

.optionCard {
  @apply p-4 border-2 border-gray-200 rounded-lg text-left transition-all duration-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.optionCard.selected {
  @apply border-blue-500 bg-blue-50;
}

.optionCard.disabled {
  @apply opacity-50 cursor-not-allowed;
}

.optionIcon {
  @apply mb-2;
}

.optionContent {
  @apply space-y-1;
}

.optionName {
  @apply block font-medium text-gray-900;
}

.optionCount {
  @apply block text-sm text-gray-500;
}

.subfiltersPanel {
  @apply mt-6 p-4 bg-gray-50 rounded-lg;
}

.subfiltersTitle {
  @apply text-lg font-semibold text-gray-800 mb-4;
}

.subfiltersGrid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

.filterChips {
  @apply mt-6 flex flex-wrap gap-2;
}

.chip {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800;
}

.chipRemove {
  @apply ml-2 hover:bg-blue-200 rounded-full p-1;
}

.resetButton {
  @apply px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed;
}
```

## 🔧 Utilidades

### filterConfig.ts

```typescript
// modules/product-filters/utils/filterConfig.ts
import { FilterHierarchy } from '../types/hierarchy'

export const getFilterHierarchy = async (supermarkets: string[]): Promise<FilterHierarchy> => {
  // Simular llamada a API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        categories: [
          {
            id: 'bebidas',
            name: 'Bebidas',
            icon: '🥤',
            productCount: 1250,
            subcategories: [
              {
                id: 'gaseosas',
                name: 'Gaseosas',
                productCount: 450,
                productTypes: [
                  {
                    id: 'cola',
                    name: 'Cola',
                    productCount: 120,
                    subfilters: [
                      {
                        id: 'brand',
                        name: 'Marca',
                        type: 'select',
                        options: ['Coca-Cola', 'Pepsi', 'Otro']
                      },
                      {
                        id: 'size',
                        name: 'Tamaño',
                        type: 'select',
                        options: ['1.5L', '2.5L', '3L']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
    }, 200)
  })
}

export const validateFilterHierarchy = (filters: any): boolean => {
  // Validar que la jerarquía de filtros sea correcta
  if (filters.subcategory && !filters.category) return false
  if (filters.productType && !filters.subcategory) return false
  return true
}
```

## 📋 Tipos TypeScript

### filter.ts

```typescript
// modules/product-filters/types/filter.ts
export interface ProductFilters {
  category?: string
  subcategory?: string
  productType?: string
  subfilters: Record<string, any>
}

export interface FilterOption {
  id: string
  name: string
  count?: number
  icon?: string
}

export interface Subfilter {
  id: string
  name: string
  type: 'select' | 'range' | 'checkbox'
  options?: string[]
  min?: number
  max?: number
}
```

### hierarchy.ts

```typescript
// modules/product-filters/types/hierarchy.ts
export interface FilterHierarchy {
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  icon: string
  productCount: number
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  productCount: number
  productTypes: ProductType[]
}

export interface ProductType {
  id: string
  name: string
  productCount: number
  subfilters: Subfilter[]
}

export interface Subfilter {
  id: string
  name: string
  type: 'select' | 'range' | 'checkbox'
  options?: string[]
  min?: number
  max?: number
}
```

## 🧪 Testing

### Tests de Hooks

```typescript
// modules/product-filters/__tests__/useProductFilters.test.ts
import { renderHook, act } from '@testing-library/react'
import { useProductFilters } from '../hooks/useProductFilters'

const mockOnFiltersChange = jest.fn()

describe('useProductFilters', () => {
  it('should initialize with empty filters', () => {
    const { result } = renderHook(() =>
      useProductFilters({
        supermarkets: ['carrefour'],
        onFiltersChange: mockOnFiltersChange
      })
    )

    expect(result.current.filters.category).toBeUndefined()
    expect(result.current.filters.subcategory).toBeUndefined()
    expect(result.current.filters.productType).toBeUndefined()
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it('should update category and reset dependent filters', () => {
    const { result } = renderHook(() =>
      useProductFilters({
        supermarkets: ['carrefour'],
        onFiltersChange: mockOnFiltersChange
      })
    )

    act(() => {
      result.current.updateCategory('bebidas')
    })

    expect(result.current.filters.category).toBe('bebidas')
    expect(result.current.filters.subcategory).toBeUndefined()
    expect(result.current.filters.productType).toBeUndefined()
    expect(result.current.hasActiveFilters).toBe(true)
  })

  it('should reset all filters', () => {
    const { result } = renderHook(() =>
      useProductFilters({
        supermarkets: ['carrefour'],
        onFiltersChange: mockOnFiltersChange
      })
    )

    act(() => {
      result.current.updateCategory('bebidas')
      result.current.resetFilters()
    })

    expect(result.current.filters.category).toBeUndefined()
    expect(result.current.hasActiveFilters).toBe(false)
  })
})
```

## 🚀 Integración

### Uso en la Página Principal

```typescript
// src/pages/index.tsx
import ProductFilters from '@/modules/product-filters'

const IndexPage = () => {
  const [selectedSupermarkets, setSelectedSupermarkets] = useState(['carrefour', 'disco'])
  const [productFilters, setProductFilters] = useState({})

  const handleFiltersChange = (filters) => {
    setProductFilters(filters)
    // Actualizar tabla de productos con nuevos filtros
  }

  return (
    <div>
      <SupermarketSelector onSelectionChange={setSelectedSupermarkets} />
      <ProductFilters
        supermarkets={selectedSupermarkets}
        onFiltersChange={handleFiltersChange}
      />
      <ProductTable
        supermarkets={selectedSupermarkets}
        filters={productFilters}
      />
    </div>
  )
}
```

## 📝 Notas Importantes

- **Jerarquía Estricta**: Los filtros se activan en orden estricto
- **Persistencia**: Los filtros se guardan en localStorage
- **Performance**: Lazy loading de opciones de filtro
- **Validación**: Validación de jerarquía en tiempo real
- **Responsive**: Diseño adaptativo para móviles
- **Accesibilidad**: Navegación por teclado completa

## 🔄 Próximas Mejoras

- [ ] Filtros avanzados (rango de precios, calificaciones)
- [ ] Búsqueda en tiempo real dentro de filtros
- [ ] Filtros guardados como favoritos
- [ ] Historial de filtros usados
- [ ] Sincronización de filtros entre dispositivos
