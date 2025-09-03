# Comparison Cart - Módulo de Carrito de Comparación

[El módulo Comparison Cart implementa un sistema de comparación avanzada que permite a los usuarios seleccionar múltiples productos y compararlos en una vista detallada con gráficos, métricas y herramientas de análisis.]

## 📁 Estructura del Módulo

```
modules/comparison-cart/
├── components/
│   ├── ComparisonCart.tsx       # Componente principal
│   ├── ProductComparison.tsx    # Vista de comparación
│   ├── ComparisonTable.tsx      # Tabla comparativa
│   ├── PriceChart.tsx           # Gráfico de precios
│   ├── ComparisonMetrics.tsx    # Métricas de comparación
│   ├── CartItem.tsx             # Item del carrito
│   ├── CartControls.tsx         # Controles del carrito
│   ├── ShareComparison.tsx      # Compartir comparación
│   └── ExportComparison.tsx     # Exportar comparación
├── hooks/
│   ├── useComparisonCart.ts     # Hook principal del carrito
│   ├── useComparisonData.ts     # Hook de datos de comparación
│   ├── usePriceAnalysis.ts      # Hook de análisis de precios
│   └── useComparisonPersistence.ts # Hook de persistencia
├── styles/
│   ├── cart.module.css          # Estilos principales
│   ├── comparison.css           # Estilos de comparación
│   ├── charts.css               # Estilos de gráficos
│   └── animations.css           # Animaciones
├── types/
│   ├── cart.ts                  # Tipos del carrito
│   ├── comparison.ts            # Tipos de comparación
│   └── analysis.ts              # Tipos de análisis
├── utils/
│   ├── cartConfig.ts            # Configuración del carrito
│   ├── comparisonHelpers.ts     # Helpers de comparación
│   ├── priceAnalysis.ts         # Análisis de precios
│   └── exportHelpers.ts         # Helpers de exportación
├── index.ts                     # Export principal
└── README.md                    # Documentación
```

## 🎯 Funcionalidades

- **Carrito Inteligente**: Gestión de productos para comparación
- **Vista Comparativa**: Tabla y gráficos lado a lado
- **Análisis de Precios**: Métricas y tendencias
- **Comparación Visual**: Gráficos interactivos
- **Persistencia**: Guardar comparaciones
- **Compartir**: Enlaces públicos de comparaciones
- **Exportación**: Múltiples formatos
- **Sincronización**: Entre dispositivos

## 🛠 Tecnologías Utilizadas

- **React**: Componentes con estado complejo
- **TypeScript**: Tipado fuerte para análisis de datos
- **Tailwind CSS**: Estilos responsivos
- **Chart.js**: Gráficos avanzados
- **React DnD**: Drag & drop para reordenar
- **React Context**: Estado global del carrito
- **Local Storage**: Persistencia local

## 📋 Componentes Principales

### ComparisonCart (Componente Principal)

```typescript
// modules/comparison-cart/components/ComparisonCart.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparisonCart } from '../hooks/useComparisonCart'
import ProductComparison from './ProductComparison'
import CartItem from './CartItem'
import CartControls from './CartControls'
import styles from '../styles/cart.module.css'

interface ComparisonCartProps {
  isOpen: boolean
  onClose: () => void
  onProductAdd: (product: Product) => void
  className?: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  prices: Record<string, PriceData>
  image: string
  unit: string
  discount?: DiscountData
}

export interface PriceData {
  current: number
  previous?: number
  history: PricePoint[]
  updated: string
}

export interface PricePoint {
  price: number
  date: string
  supermarket: string
}

export interface DiscountData {
  percentage: number
  originalPrice: number
  validUntil: string
}

const ComparisonCart: React.FC<ComparisonCartProps> = ({
  isOpen,
  onClose,
  onProductAdd,
  className = ''
}) => {
  const {
    cartItems,
    comparisonData,
    removeFromCart,
    clearCart,
    reorderItems,
    saveComparison,
    shareComparison
  } = useComparisonCart()

  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table')

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className={styles.cartOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`${styles.cartContainer} ${className}`}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.cartHeader}>
            <div className={styles.cartTitle}>
              <h2>Carrito de Comparación</h2>
              <span className={styles.itemCount}>
                {cartItems.length} productos
              </span>
            </div>

            <CartControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSave={saveComparison}
              onShare={shareComparison}
              onClear={clearCart}
              onClose={onClose}
            />
          </div>

          <div className={styles.cartContent}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <div className={styles.emptyIcon}>🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para comparar precios</p>
              </div>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {cartItems.map((item, index) => (
                    <CartItem
                      key={item.id}
                      product={item}
                      index={index}
                      onRemove={() => removeFromCart(item.id)}
                      onReorder={reorderItems}
                    />
                  ))}
                </div>

                <div className={styles.comparisonView}>
                  <ProductComparison
                    products={cartItems}
                    comparisonData={comparisonData}
                    viewMode={viewMode}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ComparisonCart
```

### ProductComparison

```typescript
// modules/comparison-cart/components/ProductComparison.tsx
import React from 'react'
import { motion } from 'framer-motion'
import ComparisonTable from './ComparisonTable'
import PriceChart from './PriceChart'
import ComparisonMetrics from './ComparisonMetrics'
import styles from '../styles/comparison.css'

interface ProductComparisonProps {
  products: Product[]
  comparisonData: ComparisonData
  viewMode: 'table' | 'chart'
}

export interface ComparisonData {
  priceRange: {
    min: number
    max: number
    average: number
  }
  bestDeals: Product[]
  priceHistory: PriceHistoryData[]
  savings: {
    total: number
    percentage: number
  }
}

export interface PriceHistoryData {
  productId: string
  productName: string
  history: PricePoint[]
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  comparisonData,
  viewMode
}) => {
  return (
    <motion.div
      className={styles.comparisonContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.comparisonHeader}>
        <h3>Análisis de Comparación</h3>
        <ComparisonMetrics data={comparisonData} />
      </div>

      <div className={styles.comparisonContent}>
        {viewMode === 'table' ? (
          <ComparisonTable
            products={products}
            comparisonData={comparisonData}
          />
        ) : (
          <PriceChart
            products={products}
            comparisonData={comparisonData}
          />
        )}
      </div>
    </motion.div>
  )
}

export default ProductComparison
```

### PriceChart

```typescript
// modules/comparison-cart/components/PriceChart.tsx
import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import styles from '../styles/charts.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface PriceChartProps {
  products: Product[]
  comparisonData: ComparisonData
}

const PriceChart: React.FC<PriceChartProps> = ({
  products,
  comparisonData
}) => {
  const chartData = useMemo(() => {
    const supermarkets = [...new Set(
      products.flatMap(product =>
        Object.keys(product.prices)
      )
    )]

    const datasets = products.map((product, index) => ({
      label: product.name,
      data: supermarkets.map(supermarket => {
        const price = product.prices[supermarket]
        return price ? price.current : null
      }),
      borderColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%, 0.1)`,
      tension: 0.1
    }))

    return {
      labels: supermarkets,
      datasets
    }
  }, [products])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Comparación de Precios por Supermercado'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `$${value}`
        }
      }
    }
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h4>Gráfico de Precios</h4>
        <div className={styles.chartControls}>
          <button className={styles.chartTypeButton}>
            📊
          </button>
          <button className={styles.chartTypeButton}>
            📈
          </button>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <Bar data={chartData} options={options} />
      </div>

      <div className={styles.chartInsights}>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>Precio Promedio:</span>
          <span className={styles.insightValue}>
            ${comparisonData.priceRange.average.toFixed(2)}
          </span>
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>Rango de Precios:</span>
          <span className={styles.insightValue}>
            ${comparisonData.priceRange.min} - ${comparisonData.priceRange.max}
          </span>
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>Ahorro Potencial:</span>
          <span className={styles.insightValue}>
            ${comparisonData.savings.total} ({comparisonData.savings.percentage}%)
          </span>
        </div>
      </div>
    </div>
  )
}

export default PriceChart
```

## 🎣 Hooks Personalizados

### useComparisonCart

```typescript
// modules/comparison-cart/hooks/useComparisonCart.ts
import { useState, useEffect, useCallback } from 'react'
import { useComparisonData } from './useComparisonData'
import { useComparisonPersistence } from './useComparisonPersistence'
import { Product } from '../types/cart'

export const useComparisonCart = () => {
  const [cartItems, setCartItems] = useState<Product[]>([])
  const { saveCart, loadCart, clearSavedCart } = useComparisonPersistence()
  const comparisonData = useComparisonData(cartItems)

  // Cargar carrito guardado al inicializar
  useEffect(() => {
    const savedCart = loadCart()
    if (savedCart) {
      setCartItems(savedCart)
    }
  }, [loadCart])

  // Guardar carrito cuando cambie
  useEffect(() => {
    saveCart(cartItems)
  }, [cartItems, saveCart])

  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      // Evitar duplicados
      if (prev.find(item => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
    clearSavedCart()
  }, [clearSavedCart])

  const reorderItems = useCallback((startIndex: number, endIndex: number) => {
    setCartItems(prev => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }, [])

  const saveComparison = useCallback(async () => {
    // Guardar comparación en el backend
    const comparisonId = await saveComparisonToAPI(cartItems, comparisonData)
    return comparisonId
  }, [cartItems, comparisonData])

  const shareComparison = useCallback(async () => {
    const comparisonId = await saveComparison()
    const shareUrl = `${window.location.origin}/comparison/${comparisonId}`
    await navigator.share?.({
      title: 'Comparación de Productos',
      text: 'Mira esta comparación de precios',
      url: shareUrl
    })
    return shareUrl
  }, [saveComparison])

  return {
    cartItems,
    comparisonData,
    addToCart,
    removeFromCart,
    clearCart,
    reorderItems,
    saveComparison,
    shareComparison
  }
}
```

### useComparisonData

```typescript
// modules/comparison-cart/hooks/useComparisonData.ts
import { useMemo } from 'react'
import { Product } from '../types/cart'
import { calculatePriceAnalysis } from '../utils/priceAnalysis'

export const useComparisonData = (products: Product[]) => {
  const comparisonData = useMemo(() => {
    if (products.length === 0) {
      return {
        priceRange: { min: 0, max: 0, average: 0 },
        bestDeals: [],
        priceHistory: [],
        savings: { total: 0, percentage: 0 }
      }
    }

    return calculatePriceAnalysis(products)
  }, [products])

  return comparisonData
}
```

## 🎨 Estilos del Módulo

### cart.module.css

```css
/* modules/comparison-cart/styles/cart.module.css */
.cartOverlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4;
}

.cartContainer {
  @apply bg-white rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-screen overflow-hidden flex flex-col;
}

.cartHeader {
  @apply flex items-center justify-between p-6 bg-gray-50 border-b;
}

.cartTitle h2 {
  @apply text-2xl font-bold text-gray-800;
}

.itemCount {
  @apply text-sm text-gray-600 ml-2 bg-blue-100 px-2 py-1 rounded-full;
}

.cartContent {
  @apply flex-1 overflow-hidden flex flex-col;
}

.emptyCart {
  @apply flex-1 flex flex-col items-center justify-center text-center p-8;
}

.emptyIcon {
  @apply text-6xl mb-4;
}

.emptyCart h3 {
  @apply text-xl font-semibold text-gray-700 mb-2;
}

.emptyCart p {
  @apply text-gray-500;
}

.cartItems {
  @apply flex-shrink-0 p-4 bg-gray-50 border-b overflow-x-auto;
}

.comparisonView {
  @apply flex-1 overflow-auto p-6;
}
```

### comparison.css

```css
/* modules/comparison-cart/styles/comparison.css */
.comparisonContainer {
  @apply space-y-6;
}

.comparisonHeader {
  @apply flex items-center justify-between;
}

.comparisonHeader h3 {
  @apply text-xl font-bold text-gray-800;
}

.comparisonContent {
  @apply bg-white rounded-lg border p-6;
}

.comparisonTable {
  @apply w-full;
}

.comparisonTable th,
.comparisonTable td {
  @apply px-4 py-3 border-b border-gray-200 text-left;
}

.comparisonTable th {
  @apply bg-gray-50 font-semibold text-gray-700;
}

.productColumn {
  @apply min-w-64;
}

.priceColumn {
  @apply min-w-32 text-center;
}

.bestPrice {
  @apply bg-green-100 text-green-800 font-semibold;
}

.worstPrice {
  @apply bg-red-100 text-red-800;
}
```

## 🔧 Utilidades

### priceAnalysis.ts

```typescript
// modules/comparison-cart/utils/priceAnalysis.ts
import { Product, ComparisonData, PriceHistoryData } from '../types/comparison'

export const calculatePriceAnalysis = (products: Product[]): ComparisonData => {
  if (products.length === 0) {
    return {
      priceRange: { min: 0, max: 0, average: 0 },
      bestDeals: [],
      priceHistory: [],
      savings: { total: 0, percentage: 0 }
    }
  }

  // Calcular todos los precios disponibles
  const allPrices: number[] = []
  products.forEach(product => {
    Object.values(product.prices).forEach(priceData => {
      if (priceData) {
        allPrices.push(priceData.current)
      }
    })
  })

  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const averagePrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length

  // Encontrar mejores ofertas
  const bestDeals = products
    .map(product => {
      const prices = Object.values(product.prices).filter(p => p)
      const lowestPrice = Math.min(...prices.map(p => p.current))
      return { product, lowestPrice }
    })
    .sort((a, b) => a.lowestPrice - b.lowestPrice)
    .slice(0, 3)
    .map(item => item.product)

  // Preparar datos de historial de precios
  const priceHistory: PriceHistoryData[] = products.map(product => ({
    productId: product.id,
    productName: product.name,
    history: Object.values(product.prices)
      .filter(p => p)
      .flatMap(p => p.history)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }))

  // Calcular ahorros potenciales
  const totalSavings = maxPrice - minPrice
  const savingsPercentage = ((maxPrice - minPrice) / maxPrice) * 100

  return {
    priceRange: {
      min: minPrice,
      max: maxPrice,
      average: averagePrice
    },
    bestDeals,
    priceHistory,
    savings: {
      total: totalSavings,
      percentage: Math.round(savingsPercentage * 100) / 100
    }
  }
}

export const findBestPrice = (product: Product): { supermarket: string; price: number } | null => {
  const prices = Object.entries(product.prices)
    .filter(([_, priceData]) => priceData)
    .map(([supermarket, priceData]) => ({
      supermarket,
      price: priceData.current
    }))

  if (prices.length === 0) return null

  return prices.reduce((best, current) =>
    current.price < best.price ? current : best
  )
}

export const calculatePriceDifference = (price1: number, price2: number): number => {
  return ((price2 - price1) / price1) * 100
}
```

### comparisonHelpers.ts

```typescript
// modules/comparison-cart/utils/comparisonHelpers.ts
import { Product } from '../types/cart'

export const groupProductsByCategory = (products: Product[]): Record<string, Product[]> => {
  return products.reduce((groups, product) => {
    const category = product.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(product)
    return groups
  }, {} as Record<string, Product[]>)
}

export const sortProductsByPrice = (
  products: Product[],
  supermarket: string,
  direction: 'asc' | 'desc' = 'asc'
): Product[] => {
  return [...products].sort((a, b) => {
    const priceA = a.prices[supermarket]?.current || Infinity
    const priceB = b.prices[supermarket]?.current || Infinity

    if (direction === 'asc') {
      return priceA - priceB
    } else {
      return priceB - priceA
    }
  })
}

export const filterProductsByAvailability = (
  products: Product[],
  supermarkets: string[]
): Product[] => {
  return products.filter(product =>
    supermarkets.some(supermarket => product.prices[supermarket])
  )
}

export const calculateSimilarityScore = (product1: Product, product2: Product): number => {
  let score = 0

  // Misma marca
  if (product1.brand === product2.brand) score += 30

  // Misma categoría
  if (product1.category === product2.category) score += 40

  // Nombre similar (simple check)
  const name1 = product1.name.toLowerCase()
  const name2 = product2.name.toLowerCase()
  if (name1.includes(name2) || name2.includes(name1)) score += 20

  // Misma unidad
  if (product1.unit === product2.unit) score += 10

  return Math.min(score, 100)
}
```

## 📋 Tipos TypeScript

### cart.ts

```typescript
// modules/comparison-cart/types/cart.ts
export interface Product {
  id: string
  name: string
  brand: string
  category: string
  prices: Record<string, PriceData>
  image: string
  unit: string
  discount?: DiscountData
  tags?: string[]
}

export interface PriceData {
  current: number
  previous?: number
  history: PricePoint[]
  updated: string
  currency: string
}

export interface PricePoint {
  price: number
  date: string
  supermarket: string
}

export interface DiscountData {
  percentage: number
  originalPrice: number
  validUntil: string
  type: 'percentage' | 'fixed'
}

export interface CartItem extends Product {
  addedAt: string
  notes?: string
}
```

### comparison.ts

```typescript
// modules/comparison-cart/types/comparison.ts
export interface ComparisonData {
  priceRange: PriceRange
  bestDeals: Product[]
  priceHistory: PriceHistoryData[]
  savings: SavingsData
  recommendations: Recommendation[]
}

export interface PriceRange {
  min: number
  max: number
  average: number
}

export interface PriceHistoryData {
  productId: string
  productName: string
  history: PricePoint[]
}

export interface SavingsData {
  total: number
  percentage: number
}

export interface Recommendation {
  type: 'best_deal' | 'similar_product' | 'bulk_discount'
  product: Product
  reason: string
  savings?: number
}

export interface ComparisonConfig {
  showPriceHistory: boolean
  showDiscounts: boolean
  showRecommendations: boolean
  chartType: 'bar' | 'line' | 'radar'
  currency: string
}
```

## 🧪 Testing

### Tests de Hooks

```typescript
// modules/comparison-cart/__tests__/useComparisonCart.test.ts
import { renderHook, act } from '@testing-library/react'
import { useComparisonCart } from '../hooks/useComparisonCart'

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  brand: 'Test Brand',
  category: 'Test Category',
  prices: {
    supermarket1: {
      current: 100,
      history: [],
      updated: '2024-01-01'
    }
  },
  image: 'test.jpg',
  unit: '1kg'
}

describe('useComparisonCart', () => {
  it('should add product to cart', () => {
    const { result } = renderHook(() => useComparisonCart())

    act(() => {
      result.current.addToCart(mockProduct)
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0]).toEqual(mockProduct)
  })

  it('should remove product from cart', () => {
    const { result } = renderHook(() => useComparisonCart())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.removeFromCart(mockProduct.id)
    })

    expect(result.current.cartItems).toHaveLength(0)
  })

  it('should clear cart', () => {
    const { result } = renderHook(() => useComparisonCart())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.clearCart()
    })

    expect(result.current.cartItems).toHaveLength(0)
  })
})
```

## 🚀 Integración

### Uso en la Página Principal

```typescript
// src/pages/index.tsx
import ComparisonCart from '@/modules/comparison-cart'

const IndexPage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleAddToComparison = (product) => {
    // Lógica para agregar al carrito
  }

  return (
    <div>
      <ProductTable onAddToComparison={handleAddToComparison} />
      <ComparisonButton onClick={() => setIsCartOpen(true)} />

      <ComparisonCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProductAdd={handleAddToComparison}
      />
    </div>
  )
}
```

## 📝 Notas Importantes

- **Límite de Productos**: Máximo 10 productos para comparación óptima
- **Persistencia**: Carrito guardado en localStorage y backend
- **Sincronización**: Entre dispositivos con la misma cuenta
- **Performance**: Lazy loading de datos de comparación
- **Accesibilidad**: Navegación completa por teclado
- **SEO**: URLs compartibles para comparaciones

## 🔄 Próximas Mejoras

- [ ] Comparación de productos similares automáticamente
- [ ] Alertas de cambios de precio
- [ ] Integración con listas de compras
- [ ] Modo comparación avanzado con más métricas
- [ ] Exportación a PDF con gráficos
- [ ] Recomendaciones basadas en historial
