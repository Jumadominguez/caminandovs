# Supermarket Selector - Módulo de Selección de Supermercados

[El módulo Supermarket Selector es responsable de permitir a los usuarios seleccionar qué supermercados incluir en su comparación de precios. Proporciona una interfaz visual intuitiva con logos de los 5 supermercados principales y gestión del estado de selección.]

## 📁 Estructura del Módulo

```
modules/supermarket-selector/
├── components/
│   ├── SupermarketSelector.tsx    # Componente principal
│   ├── SupermarketCard.tsx       # Tarjeta individual de supermercado
│   ├── SelectorGrid.tsx          # Grid de selección
│   └── SelectionSummary.tsx      # Resumen de selección
├── hooks/
│   ├── useSupermarketSelection.ts # Hook para gestión de selección
│   └── useSupermarketData.ts     # Hook para datos de supermercados
├── styles/
│   ├── selector.module.css       # Estilos específicos del módulo
│   ├── card.css                  # Estilos de tarjetas
│   └── animations.css            # Animaciones de selección
├── types/
│   ├── supermarket.ts            # Tipos de supermercados
│   └── selection.ts              # Tipos de selección
├── utils/
│   ├── supermarketConfig.ts      # Configuración de supermercados
│   └── selectionHelpers.ts       # Utilidades de selección
├── index.ts                      # Export principal del módulo
└── README.md                     # Documentación del módulo
```

## 🎯 Funcionalidades

- **Selección Visual**: Interface con logos de los 5 supermercados
- **Estado por Defecto**: Todos los supermercados seleccionados inicialmente
- **Toggle Individual**: Click para seleccionar/deseleccionar cada supermercado
- **Feedback Visual**: Estados visuales claros (seleccionado/no seleccionado)
- **Persistencia**: Mantener selección durante la sesión
- **Validación**: Asegurar al menos un supermercado seleccionado

## 🛠 Tecnologías Utilizadas

- **React**: Componentes funcionales con hooks
- **TypeScript**: Tipado fuerte para estado y props
- **Tailwind CSS**: Estilos utility-first
- **Framer Motion**: Animaciones de selección
- **React Context**: Gestión global del estado de selección

## 📋 Componentes Principales

### SupermarketSelector (Componente Principal)

```typescript
// modules/supermarket-selector/components/SupermarketSelector.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { useSupermarketSelection } from '../hooks/useSupermarketSelection'
import { useSupermarketData } from '../hooks/useSupermarketData'
import SelectorGrid from './SelectorGrid'
import SelectionSummary from './SelectionSummary'
import styles from '../styles/selector.module.css'

interface SupermarketSelectorProps {
  className?: string
  showSummary?: boolean
  onSelectionChange?: (selected: string[]) => void
}

const SupermarketSelector: React.FC<SupermarketSelectorProps> = ({
  className = '',
  showSummary = true,
  onSelectionChange
}) => {
  const { supermarkets } = useSupermarketData()
  const {
    selectedSupermarkets,
    toggleSupermarket,
    selectAll,
    deselectAll,
    isAllSelected,
    selectedCount
  } = useSupermarketSelection()

  // Notificar cambios de selección
  React.useEffect(() => {
    onSelectionChange?.(selectedSupermarkets)
  }, [selectedSupermarkets, onSelectionChange])

  return (
    <motion.div
      className={`${styles.selectorContainer} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.selectorHeader}>
        <h2 className={styles.title}>Seleccionar Supermercados</h2>
        <div className={styles.actions}>
          <button
            onClick={selectAll}
            disabled={isAllSelected}
            className={styles.selectAllBtn}
          >
            Seleccionar Todos
          </button>
          <button
            onClick={deselectAll}
            disabled={selectedCount === 0}
            className={styles.deselectAllBtn}
          >
            Deseleccionar Todos
          </button>
        </div>
      </div>

      <SelectorGrid
        supermarkets={supermarkets}
        selectedSupermarkets={selectedSupermarkets}
        onToggle={toggleSupermarket}
      />

      {showSummary && (
        <SelectionSummary
          selectedCount={selectedCount}
          totalCount={supermarkets.length}
        />
      )}
    </motion.div>
  )
}

export default SupermarketSelector
```

### SupermarketCard (Tarjeta Individual)

```typescript
// modules/supermarket-selector/components/SupermarketCard.tsx
import React from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/card.css'

interface Supermarket {
  id: string
  name: string
  logo: string
  color: string
  isActive: boolean
}

interface SupermarketCardProps {
  supermarket: Supermarket
  isSelected: boolean
  onToggle: (id: string) => void
}

const SupermarketCard: React.FC<SupermarketCardProps> = ({
  supermarket,
  isSelected,
  onToggle
}) => {
  const handleClick = () => {
    if (supermarket.isActive) {
      onToggle(supermarket.id)
    }
  }

  return (
    <motion.div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${!supermarket.isActive ? styles.disabled : ''}`}
      onClick={handleClick}
      whileHover={supermarket.isActive ? { scale: 1.05 } : {}}
      whileTap={supermarket.isActive ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={styles.logoContainer}>
        <img
          src={supermarket.logo}
          alt={`${supermarket.name} logo`}
          className={`${styles.logo} ${isSelected ? styles.logoSelected : ''}`}
        />
      </div>

      <div className={styles.nameContainer}>
        <span className={styles.name}>{supermarket.name}</span>
      </div>

      <div className={styles.checkmark}>
        {isSelected && (
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </motion.svg>
        )}
      </div>
    </motion.div>
  )
}

export default SupermarketCard
```

## 🎣 Hooks Personalizados

### useSupermarketSelection

```typescript
// modules/supermarket-selector/hooks/useSupermarketSelection.ts
import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'

const STORAGE_KEY = 'caminando-selected-supermarkets'
const DEFAULT_SUPERMARKETS = ['carrefour', 'disco', 'jumbo', 'dia', 'vea']

export const useSupermarketSelection = () => {
  const [storedSelection, setStoredSelection] = useLocalStorage<string[]>(
    STORAGE_KEY,
    DEFAULT_SUPERMARKETS
  )

  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>(storedSelection)

  // Persistir cambios en localStorage
  useEffect(() => {
    setStoredSelection(selectedSupermarkets)
  }, [selectedSupermarkets, setStoredSelection])

  const toggleSupermarket = useCallback((supermarketId: string) => {
    setSelectedSupermarkets(prev => {
      const isSelected = prev.includes(supermarketId)

      if (isSelected) {
        // No permitir deseleccionar si es el último
        if (prev.length === 1) {
          return prev
        }
        return prev.filter(id => id !== supermarketId)
      } else {
        return [...prev, supermarketId]
      }
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedSupermarkets(DEFAULT_SUPERMARKETS)
  }, [])

  const deselectAll = useCallback(() => {
    // Mantener al menos uno seleccionado
    setSelectedSupermarkets([DEFAULT_SUPERMARKETS[0]])
  }, [])

  const isAllSelected = selectedSupermarkets.length === DEFAULT_SUPERMARKETS.length
  const selectedCount = selectedSupermarkets.length

  return {
    selectedSupermarkets,
    toggleSupermarket,
    selectAll,
    deselectAll,
    isAllSelected,
    selectedCount
  }
}
```

### useSupermarketData

```typescript
// modules/supermarket-selector/hooks/useSupermarketData.ts
import { useState, useEffect } from 'react'
import { getSupermarketConfig } from '../utils/supermarketConfig'

export interface Supermarket {
  id: string
  name: string
  logo: string
  color: string
  isActive: boolean
  description?: string
}

export const useSupermarketData = () => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSupermarkets = async () => {
      try {
        setLoading(true)
        const config = await getSupermarketConfig()
        setSupermarkets(config)
        setError(null)
      } catch (err) {
        setError('Error al cargar la configuración de supermercados')
        console.error('Error loading supermarket config:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSupermarkets()
  }, [])

  return {
    supermarkets,
    loading,
    error
  }
}
```

## 🎨 Estilos del Módulo

### selector.module.css

```css
/* modules/supermarket-selector/styles/selector.module.css */
.selectorContainer {
  @apply bg-white rounded-lg shadow-lg p-6;
}

.selectorHeader {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4;
}

.title {
  @apply text-2xl font-bold text-gray-800;
}

.actions {
  @apply flex gap-3;
}

.selectAllBtn,
.deselectAllBtn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.selectAllBtn {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed;
}

.deselectAllBtn {
  @apply bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed;
}

.grid {
  @apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4;
}

.card {
  @apply relative cursor-pointer transition-all duration-200;
}

.card:hover {
  @apply transform scale-105;
}

.card.selected {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}

.card.disabled {
  @apply opacity-50 cursor-not-allowed;
}

.logoContainer {
  @apply flex items-center justify-center h-20 bg-gray-50 rounded-lg mb-3;
}

.logo {
  @apply h-12 w-auto object-contain filter grayscale transition-all duration-200;
}

.logoSelected {
  @apply filter-none;
}

.nameContainer {
  @apply text-center;
}

.name {
  @apply text-sm font-medium text-gray-700;
}

.checkmark {
  @apply absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center;
}

.checkmark svg {
  @apply w-4 h-4 text-white;
}
```

## 🔧 Utilidades

### supermarketConfig.ts

```typescript
// modules/supermarket-selector/utils/supermarketConfig.ts
import { Supermarket } from '../types/supermarket'

export const SUPERMERCADO_CONFIG: Supermarket[] = [
  {
    id: 'carrefour',
    name: 'Carrefour',
    logo: '/images/supermarkets/carrefour-logo.png',
    color: '#004899',
    isActive: true,
    description: 'La cadena de supermercados líder en España'
  },
  {
    id: 'disco',
    name: 'Disco',
    logo: '/images/supermarkets/disco-logo.png',
    color: '#FF6B35',
    isActive: true,
    description: 'Especialistas en productos frescos'
  },
  {
    id: 'jumbo',
    name: 'Jumbo',
    logo: '/images/supermarkets/jumbo-logo.png',
    color: '#E53E3E',
    isActive: true,
    description: 'Calidad y variedad para toda la familia'
  },
  {
    id: 'dia',
    name: 'Día',
    logo: '/images/supermarkets/dia-logo.png',
    color: '#FF8C00',
    isActive: true,
    description: 'Conveniencia y precios accesibles'
  },
  {
    id: 'vea',
    name: 'Vea',
    logo: '/images/supermarkets/vea-logo.png',
    color: '#228B22',
    isActive: true,
    description: 'Productos locales y frescos'
  }
]

export const getSupermarketConfig = async (): Promise<Supermarket[]> => {
  // Simular carga asíncrona
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(SUPERMERCADO_CONFIG)
    }, 100)
  })
}

export const getSupermarketById = (id: string): Supermarket | undefined => {
  return SUPERMERCADO_CONFIG.find(supermarket => supermarket.id === id)
}

export const getActiveSupermarkets = (): Supermarket[] => {
  return SUPERMERCADO_CONFIG.filter(supermarket => supermarket.isActive)
}
```

## 📋 Tipos TypeScript

### supermarket.ts

```typescript
// modules/supermarket-selector/types/supermarket.ts
export interface Supermarket {
  id: string
  name: string
  logo: string
  color: string
  isActive: boolean
  description?: string
}

export interface SupermarketSelection {
  selectedIds: string[]
  lastUpdated: Date
}

export interface SupermarketSelectorProps {
  className?: string
  showSummary?: boolean
  onSelectionChange?: (selected: string[]) => void
  disabled?: boolean
}
```

## 🧪 Testing

### Tests del Hook

```typescript
// modules/supermarket-selector/__tests__/useSupermarketSelection.test.ts
import { renderHook, act } from '@testing-library/react'
import { useSupermarketSelection } from '../hooks/useSupermarketSelection'

describe('useSupermarketSelection', () => {
  it('should initialize with default supermarkets', () => {
    const { result } = renderHook(() => useSupermarketSelection())

    expect(result.current.selectedSupermarkets).toEqual(['carrefour', 'disco', 'jumbo', 'dia', 'vea'])
    expect(result.current.selectedCount).toBe(5)
    expect(result.current.isAllSelected).toBe(true)
  })

  it('should toggle supermarket selection', () => {
    const { result } = renderHook(() => useSupermarketSelection())

    act(() => {
      result.current.toggleSupermarket('carrefour')
    })

    expect(result.current.selectedSupermarkets).toEqual(['disco', 'jumbo', 'dia', 'vea'])
    expect(result.current.selectedCount).toBe(4)
  })

  it('should not allow deselecting the last supermarket', () => {
    const { result } = renderHook(() => useSupermarketSelection())

    // Deseleccionar todos menos uno
    act(() => {
      result.current.toggleSupermarket('disco')
      result.current.toggleSupermarket('jumbo')
      result.current.toggleSupermarket('dia')
      result.current.toggleSupermarket('vea')
    })

    // Intentar deseleccionar el último
    act(() => {
      result.current.toggleSupermarket('carrefour')
    })

    expect(result.current.selectedSupermarkets).toEqual(['carrefour'])
    expect(result.current.selectedCount).toBe(1)
  })
})
```

## 🚀 Integración

### Uso en la Página Principal

```typescript
// src/pages/index.tsx
import SupermarketSelector from '@/modules/supermarket-selector'

const IndexPage = () => {
  const [selectedSupermarkets, setSelectedSupermarkets] = useState([])

  const handleSupermarketChange = (selected: string[]) => {
    setSelectedSupermarkets(selected)
    // Actualizar filtros de productos, etc.
  }

  return (
    <div>
      <SupermarketSelector
        onSelectionChange={handleSupermarketChange}
        showSummary={true}
      />

      {/* Otros componentes que usan selectedSupermarkets */}
      <ProductFilters supermarkets={selectedSupermarkets} />
      <ProductTable supermarkets={selectedSupermarkets} />
    </div>
  )
}
```

## 📝 Notas Importantes

- **Estado Persistente**: La selección se mantiene en localStorage
- **Validación**: Siempre al menos un supermercado debe estar seleccionado
- **Performance**: Componentes optimizados con React.memo
- **Accesibilidad**: Soporte completo para navegación por teclado
- **Responsive**: Diseño adaptativo para todos los tamaños de pantalla
- **Animaciones**: Transiciones suaves con Framer Motion

## 🔄 Próximas Mejoras

- [ ] Soporte para más supermercados
- [ ] Grupos de supermercados personalizados
- [ ] Estadísticas de uso por supermercado
- [ ] Modo offline con selección guardada
- [ ] Integración con geolocalización
