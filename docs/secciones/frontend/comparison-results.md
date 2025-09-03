# Comparison Results - Módulo de Resultados de Comparación

[El módulo Comparison Results implementa una vista avanzada de resultados de comparación con análisis detallado, métricas de ahorro, recomendaciones personalizadas y herramientas de visualización interactiva.]

## 📁 Estructura del Módulo

```
modules/comparison-results/
├── components/
│   ├── ComparisonResults.tsx    # Componente principal
│   ├── ResultsHeader.tsx        # Cabecera de resultados
│   ├── SavingsAnalysis.tsx      # Análisis de ahorros
│   ├── PriceEvolutionChart.tsx  # Gráfico de evolución
│   ├── RecommendationsPanel.tsx # Panel de recomendaciones
│   ├── ResultsTable.tsx         # Tabla de resultados
│   ├── ResultsFilters.tsx       # Filtros de resultados
│   ├── ExportResults.tsx        # Exportar resultados
│   └── ShareResults.tsx         # Compartir resultados
├── hooks/
│   ├── useComparisonResults.ts  # Hook principal
│   ├── useResultsAnalysis.ts    # Hook de análisis
│   ├── useRecommendations.ts    # Hook de recomendaciones
│   └── useResultsPersistence.ts # Hook de persistencia
├── styles/
│   ├── results.module.css       # Estilos principales
│   ├── analysis.css             # Estilos de análisis
│   ├── charts.css               # Estilos de gráficos
│   └── animations.css           # Animaciones
├── types/
│   ├── results.ts               # Tipos de resultados
│   ├── analysis.ts              # Tipos de análisis
│   └── recommendations.ts       # Tipos de recomendaciones
├── utils/
│   ├── resultsConfig.ts         # Configuración
│   ├── analysisHelpers.ts       # Helpers de análisis
│   ├── recommendationEngine.ts  # Motor de recomendaciones
│   └── exportHelpers.ts         # Helpers de exportación
├── index.ts                     # Export principal
└── README.md                    # Documentación
```

## 🎯 Funcionalidades

- **Análisis Completo**: Métricas detalladas de comparación
- **Visualización Interactiva**: Gráficos y tablas dinámicas
- **Recomendaciones Inteligentes**: Sugerencias basadas en datos
- **Análisis de Ahorros**: Cálculos de ahorro potencial
- **Filtros Avanzados**: Personalización de vista
- **Exportación Completa**: Múltiples formatos
- **Persistencia**: Guardar y recuperar análisis
- **Compartir**: Enlaces públicos de resultados

## 🛠 Tecnologías Utilizadas

- **React**: Componentes con estado complejo
- **TypeScript**: Tipado fuerte para análisis de datos
- **Tailwind CSS**: Estilos responsivos
- **Chart.js**: Gráficos avanzados y personalizados
- **D3.js**: Visualizaciones de datos complejas
- **React Context**: Estado global de resultados
- **IndexedDB**: Almacenamiento local avanzado

## 📋 Componentes Principales

### ComparisonResults (Componente Principal)

```typescript
// modules/comparison-results/components/ComparisonResults.tsx
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparisonResults } from '../hooks/useComparisonResults'
import ResultsHeader from './ResultsHeader'
import SavingsAnalysis from './SavingsAnalysis'
import PriceEvolutionChart from './PriceEvolutionChart'
import RecommendationsPanel from './RecommendationsPanel'
import ResultsTable from './ResultsTable'
import ResultsFilters from './ResultsFilters'
import styles from '../styles/results.module.css'

interface ComparisonResultsProps {
  comparisonId?: string
  products: Product[]
  supermarkets: string[]
  onBack?: () => void
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
  rating?: number
  reviews?: number
}

export interface PriceData {
  current: number
  previous?: number
  history: PricePoint[]
  updated: string
  currency: string
  availability: boolean
}

export interface PricePoint {
  price: number
  date: string
  supermarket: string
  discount?: number
}

export interface DiscountData {
  percentage: number
  originalPrice: number
  validUntil: string
  type: 'percentage' | 'fixed' | 'buy_get'
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  comparisonId,
  products,
  supermarkets,
  onBack,
  className = ''
}) => {
  const {
    resultsData,
    analysis,
    recommendations,
    filters,
    updateFilters,
    exportResults,
    shareResults,
    saveResults
  } = useComparisonResults(products, supermarkets, comparisonId)

  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'charts'>('overview')

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Aplicar filtros
      if (filters.category && product.category !== filters.category) return false
      if (filters.brand && product.brand !== filters.brand) return false
      if (filters.priceRange) {
        const minPrice = Math.min(...Object.values(product.prices).map(p => p?.current || 0))
        if (minPrice < filters.priceRange.min || minPrice > filters.priceRange.max) return false
      }
      if (filters.onlyDiscounted && !product.discount) return false
      if (filters.minRating && (!product.rating || product.rating < filters.minRating)) return false
      return true
    })
  }, [products, filters])

  return (
    <motion.div
      className={`${styles.resultsContainer} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ResultsHeader
        title="Resultados de Comparación"
        productCount={filteredProducts.length}
        onBack={onBack}
        onExport={exportResults}
        onShare={shareResults}
        onSave={saveResults}
      />

      <div className={styles.resultsContent}>
        <div className={styles.resultsSidebar}>
          <ResultsFilters
            filters={filters}
            onFiltersChange={updateFilters}
            availableCategories={resultsData.categories}
            availableBrands={resultsData.brands}
            priceRange={resultsData.priceRange}
          />

          <SavingsAnalysis
            analysis={analysis}
            className={styles.savingsWidget}
          />
        </div>

        <div className={styles.resultsMain}>
          <div className={styles.viewTabs}>
            <button
              className={`${styles.tabButton} ${activeView === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveView('overview')}
            >
              Vista General
            </button>
            <button
              className={`${styles.tabButton} ${activeView === 'detailed' ? styles.active : ''}`}
              onClick={() => setActiveView('detailed')}
            >
              Vista Detallada
            </button>
            <button
              className={`${styles.tabButton} ${activeView === 'charts' ? styles.active : ''}`}
              onClick={() => setActiveView('charts')}
            >
              Gráficos
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ResultsTable
                  products={filteredProducts}
                  supermarkets={supermarkets}
                  analysis={analysis}
                  compact={true}
                />
              </motion.div>
            )}

            {activeView === 'detailed' && (
              <motion.div
                key="detailed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ResultsTable
                  products={filteredProducts}
                  supermarkets={supermarkets}
                  analysis={analysis}
                  compact={false}
                />
              </motion.div>
            )}

            {activeView === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PriceEvolutionChart
                  products={filteredProducts}
                  analysis={analysis}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <RecommendationsPanel
            recommendations={recommendations}
            onRecommendationClick={(product) => {
              // Lógica para agregar producto recomendado
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default ComparisonResults
```

### SavingsAnalysis

```typescript
// modules/comparison-results/components/SavingsAnalysis.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { formatPrice } from '../utils/analysisHelpers'
import styles from '../styles/analysis.css'

interface SavingsAnalysisProps {
  analysis: AnalysisData
  className?: string
}

export interface AnalysisData {
  totalSavings: number
  percentageSavings: number
  bestDeals: Product[]
  priceDistribution: PriceDistribution
  categorySavings: CategorySavings[]
  timeSavings: TimeSavings
}

export interface PriceDistribution {
  ranges: {
    min: number
    max: number
    count: number
    percentage: number
  }[]
}

export interface CategorySavings {
  category: string
  savings: number
  percentage: number
  productCount: number
}

export interface TimeSavings {
  hoursSaved: number
  visitsAvoided: number
  fuelSaved: number
}

const SavingsAnalysis: React.FC<SavingsAnalysisProps> = ({
  analysis,
  className = ''
}) => {
  return (
    <motion.div
      className={`${styles.analysisContainer} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className={styles.analysisTitle}>Análisis de Ahorros</h3>

      <div className={styles.savingsMetrics}>
        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {formatPrice(analysis.totalSavings)}
          </div>
          <div className={styles.metricLabel}>Ahorro Total</div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {analysis.percentageSavings.toFixed(1)}%
          </div>
          <div className={styles.metricLabel}>Porcentaje</div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {analysis.timeSavings.hoursSaved}h
          </div>
          <div className={styles.metricLabel}>Tiempo Ahorrado</div>
        </div>
      </div>

      <div className={styles.categorySavings}>
        <h4>Ahorrro por Categoría</h4>
        {analysis.categorySavings.map((category) => (
          <div key={category.category} className={styles.categoryItem}>
            <span className={styles.categoryName}>{category.category}</span>
            <span className={styles.categorySavings}>
              {formatPrice(category.savings)} ({category.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>

      <div className={styles.bestDeals}>
        <h4>Mejores Ofertas</h4>
        {analysis.bestDeals.slice(0, 3).map((product, index) => (
          <motion.div
            key={product.id}
            className={styles.dealItem}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className={styles.dealImage}
            />
            <div className={styles.dealInfo}>
              <span className={styles.dealName}>{product.name}</span>
              <span className={styles.dealPrice}>
                {formatPrice(Math.min(...Object.values(product.prices).map(p => p?.current || 0)))}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default SavingsAnalysis
```

### PriceEvolutionChart

```typescript
// modules/comparison-results/components/PriceEvolutionChart.tsx
import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import styles from '../styles/charts.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

interface PriceEvolutionChartProps {
  products: Product[]
  analysis: AnalysisData
}

const PriceEvolutionChart: React.FC<PriceEvolutionChartProps> = ({
  products,
  analysis
}) => {
  const chartData = useMemo(() => {
    // Combinar todos los puntos de historial
    const allHistoryPoints: Record<string, PricePoint[]> = {}

    products.forEach(product => {
      Object.values(product.prices).forEach(priceData => {
        if (priceData?.history) {
          priceData.history.forEach(point => {
            if (!allHistoryPoints[point.supermarket]) {
              allHistoryPoints[point.supermarket] = []
            }
            allHistoryPoints[point.supermarket].push({
              ...point,
              productName: product.name
            })
          })
        }
      })
    })

    // Crear datasets para cada supermercado
    const datasets = Object.entries(allHistoryPoints).map(([supermarket, points], index) => ({
      label: supermarket,
      data: points.map(point => ({
        x: new Date(point.date),
        y: point.price
      })),
      borderColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%, 0.1)`,
      tension: 0.1,
      pointRadius: 4,
      pointHoverRadius: 6
    }))

    return {
      datasets
    }
  }, [products])

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolución de Precios en el Tiempo'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${formatPrice(context.parsed.y)}`
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day'
        },
        title: {
          display: true,
          text: 'Fecha'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Precio (ARS)'
        },
        ticks: {
          callback: (value: any) => formatPrice(value)
        }
      }
    }
  }

  return (
    <div className={styles.evolutionChart}>
      <div className={styles.chartHeader}>
        <h4>Evolución de Precios</h4>
        <div className={styles.chartControls}>
          <select className={styles.timeRangeSelect}>
            <option value="7d">7 días</option>
            <option value="30d">30 días</option>
            <option value="90d">3 meses</option>
            <option value="1y">1 año</option>
          </select>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <Line data={chartData} options={options} />
      </div>

      <div className={styles.chartInsights}>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>Tendencia General:</span>
          <span className={`${styles.insightValue} ${
            analysis.priceDistribution.ranges[0]?.percentage > 50 ? styles.trendingUp : styles.trendingDown
          }`}>
            {analysis.priceDistribution.ranges[0]?.percentage > 50 ? '📈' : '📉'}
          </span>
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>Volatilidad:</span>
          <span className={styles.insightValue}>
            {calculateVolatility(products)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default PriceEvolutionChart
```

## 🎣 Hooks Personalizados

### useComparisonResults

```typescript
// modules/comparison-results/hooks/useComparisonResults.ts
import { useState, useEffect, useMemo } from 'react'
import { useResultsAnalysis } from './useResultsAnalysis'
import { useRecommendations } from './useRecommendations'
import { useResultsPersistence } from './useResultsPersistence'
import { Product } from '../types/results'

interface UseComparisonResultsProps {
  products: Product[]
  supermarkets: string[]
  comparisonId?: string
}

export const useComparisonResults = ({
  products,
  supermarkets,
  comparisonId
}: UseComparisonResultsProps) => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: null,
    onlyDiscounted: false,
    minRating: 0
  })

  const { saveResults, loadResults, exportResults: persistExport } = useResultsPersistence()
  const analysis = useResultsAnalysis(products, supermarkets)
  const recommendations = useRecommendations(products, analysis)

  // Cargar resultados guardados si hay comparisonId
  useEffect(() => {
    if (comparisonId) {
      const savedResults = loadResults(comparisonId)
      if (savedResults) {
        // Aplicar filtros guardados
        setFilters(savedResults.filters)
      }
    }
  }, [comparisonId, loadResults])

  const resultsData = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))]
    const brands = [...new Set(products.map(p => p.brand))]
    const prices = products.flatMap(p =>
      Object.values(p.prices).map(price => price?.current || 0)
    ).filter(p => p > 0)

    return {
      categories,
      brands,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    }
  }, [products])

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    const exportData = {
      products,
      analysis,
      recommendations,
      filters,
      exportedAt: new Date().toISOString()
    }

    if (format === 'pdf') {
      await exportToPDF(exportData)
    } else if (format === 'excel') {
      await exportToExcel(exportData)
    } else {
      await exportToCSV(exportData)
    }
  }

  const handleShare = async () => {
    const shareId = await saveResults({
      products,
      analysis,
      recommendations,
      filters
    })

    const shareUrl = `${window.location.origin}/comparison/${shareId}`
    await navigator.share?.({
      title: 'Resultados de Comparación de Precios',
      text: 'Mira estos resultados de comparación de precios',
      url: shareUrl
    })

    return shareUrl
  }

  const handleSave = async () => {
    return await saveResults({
      products,
      analysis,
      recommendations,
      filters
    })
  }

  return {
    resultsData,
    analysis,
    recommendations,
    filters,
    updateFilters,
    exportResults: handleExport,
    shareResults: handleShare,
    saveResults: handleSave
  }
}
```

### useResultsAnalysis

```typescript
// modules/comparison-results/hooks/useResultsAnalysis.ts
import { useMemo } from 'react'
import { Product } from '../types/results'
import { calculateDetailedAnalysis } from '../utils/analysisHelpers'

export const useResultsAnalysis = (products: Product[], supermarkets: string[]) => {
  const analysis = useMemo(() => {
    return calculateDetailedAnalysis(products, supermarkets)
  }, [products, supermarkets])

  return analysis
}
```

## 🎨 Estilos del Módulo

### results.module.css

```css
/* modules/comparison-results/styles/results.module.css */
.resultsContainer {
  @apply min-h-screen bg-gray-50;
}

.resultsContent {
  @apply flex gap-6 p-6;
}

.resultsSidebar {
  @apply w-80 flex-shrink-0 space-y-6;
}

.resultsMain {
  @apply flex-1 space-y-6;
}

.viewTabs {
  @apply flex bg-white rounded-lg p-1 shadow-sm;
}

.tabButton {
  @apply flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all;
}

.tabButton.active {
  @apply bg-blue-500 text-white shadow-sm;
}

.savingsWidget {
  @apply bg-white rounded-lg p-6 shadow-sm;
}
```

### analysis.css

```css
/* modules/comparison-results/styles/analysis.css */
.analysisContainer {
  @apply bg-white rounded-lg p-6 shadow-sm;
}

.analysisTitle {
  @apply text-lg font-semibold text-gray-800 mb-4;
}

.savingsMetrics {
  @apply grid grid-cols-3 gap-4 mb-6;
}

.metric {
  @apply text-center;
}

.metricValue {
  @apply text-2xl font-bold text-green-600;
}

.metricLabel {
  @apply text-sm text-gray-600 mt-1;
}

.categorySavings {
  @apply space-y-3;
}

.categorySavings h4 {
  @apply font-medium text-gray-700 mb-3;
}

.categoryItem {
  @apply flex justify-between items-center py-2;
}

.categoryName {
  @apply text-sm text-gray-600;
}

.categorySavings {
  @apply text-sm font-medium text-green-600;
}

.bestDeals {
  @apply space-y-3;
}

.bestDeals h4 {
  @apply font-medium text-gray-700 mb-3;
}

.dealItem {
  @apply flex items-center space-x-3 p-3 bg-green-50 rounded-lg;
}

.dealImage {
  @apply w-12 h-12 object-cover rounded;
}

.dealInfo {
  @apply flex-1;
}

.dealName {
  @apply text-sm font-medium text-gray-800;
}

.dealPrice {
  @apply text-lg font-bold text-green-600;
}
```

## 🔧 Utilidades

### analysisHelpers.ts

```typescript
// modules/comparison-results/utils/analysisHelpers.ts
import { Product, AnalysisData } from '../types/analysis'

export const calculateDetailedAnalysis = (products: Product[], supermarkets: string[]): AnalysisData => {
  if (products.length === 0) {
    return {
      totalSavings: 0,
      percentageSavings: 0,
      bestDeals: [],
      priceDistribution: { ranges: [] },
      categorySavings: [],
      timeSavings: { hoursSaved: 0, visitsAvoided: 0, fuelSaved: 0 }
    }
  }

  // Calcular precios totales
  const totalPrices = products.map(product => {
    const prices = Object.values(product.prices)
      .filter(p => p)
      .map(p => p.current)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      product
    }
  })

  const totalMaxPrice = totalPrices.reduce((sum, item) => sum + item.max, 0)
  const totalMinPrice = totalPrices.reduce((sum, item) => sum + item.min, 0)
  const totalSavings = totalMaxPrice - totalMinPrice
  const percentageSavings = (totalSavings / totalMaxPrice) * 100

  // Encontrar mejores ofertas
  const bestDeals = totalPrices
    .sort((a, b) => a.min - b.min)
    .slice(0, 5)
    .map(item => item.product)

  // Distribución de precios
  const priceRanges = [
    { min: 0, max: 50, count: 0 },
    { min: 50, max: 100, count: 0 },
    { min: 100, max: 200, count: 0 },
    { min: 200, max: 500, count: 0 },
    { min: 500, max: Infinity, count: 0 }
  ]

  totalPrices.forEach(item => {
    const range = priceRanges.find(r => item.min >= r.min && item.min < r.max)
    if (range) range.count++
  })

  const priceDistribution = {
    ranges: priceRanges.map(range => ({
      ...range,
      percentage: (range.count / products.length) * 100
    }))
  }

  // Ahorros por categoría
  const categoryGroups = products.reduce((groups, product) => {
    if (!groups[product.category]) {
      groups[product.category] = []
    }
    groups[product.category].push(product)
    return groups
  }, {} as Record<string, Product[]>)

  const categorySavings = Object.entries(categoryGroups).map(([category, categoryProducts]) => {
    const categoryPrices = categoryProducts.map(product => {
      const prices = Object.values(product.prices)
        .filter(p => p)
        .map(p => p.current)
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    })

    const categoryMax = categoryPrices.reduce((sum, item) => sum + item.max, 0)
    const categoryMin = categoryPrices.reduce((sum, item) => sum + item.min, 0)
    const savings = categoryMax - categoryMin
    const percentage = (savings / categoryMax) * 100

    return {
      category,
      savings,
      percentage,
      productCount: categoryProducts.length
    }
  })

  // Cálculos de tiempo ahorrado
  const visitsAvoided = Math.floor(totalSavings / 200) // Asumiendo gasto promedio por visita
  const hoursSaved = visitsAvoided * 2 // 2 horas por visita ahorrada
  const fuelSaved = visitsAvoided * 15 // 15km por visita

  return {
    totalSavings,
    percentageSavings,
    bestDeals,
    priceDistribution,
    categorySavings,
    timeSavings: {
      hoursSaved,
      visitsAvoided,
      fuelSaved
    }
  }
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(price)
}

export const calculateVolatility = (products: Product[]): number => {
  // Calcular volatilidad basada en cambios de precio históricos
  const allChanges: number[] = []

  products.forEach(product => {
    Object.values(product.prices).forEach(priceData => {
      if (priceData?.history && priceData.history.length > 1) {
        for (let i = 1; i < priceData.history.length; i++) {
          const change = Math.abs(
            (priceData.history[i].price - priceData.history[i - 1].price) /
            priceData.history[i - 1].price
          ) * 100
          allChanges.push(change)
        }
      }
    })
  })

  if (allChanges.length === 0) return 0

  const avgChange = allChanges.reduce((sum, change) => sum + change, 0) / allChanges.length
  return Math.round(avgChange * 100) / 100
}
```

### recommendationEngine.ts

```typescript
// modules/comparison-results/utils/recommendationEngine.ts
import { Product, Recommendation } from '../types/recommendations'

export const generateRecommendations = (products: Product[], analysis: any): Recommendation[] => {
  const recommendations: Recommendation[] = []

  // Recomendación 1: Productos con mejor descuento
  const discountedProducts = products
    .filter(p => p.discount && p.discount.percentage > 15)
    .sort((a, b) => (b.discount?.percentage || 0) - (a.discount?.percentage || 0))
    .slice(0, 3)

  discountedProducts.forEach(product => {
    recommendations.push({
      type: 'discount',
      product,
      reason: `${product.discount?.percentage}% de descuento`,
      savings: product.discount ? product.discount.originalPrice - product.discount.originalPrice * (1 - product.discount.percentage / 100) : 0
    })
  })

  // Recomendación 2: Productos con mejor rating
  const highlyRatedProducts = products
    .filter(p => p.rating && p.rating >= 4.5)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 2)

  highlyRatedProducts.forEach(product => {
    recommendations.push({
      type: 'rating',
      product,
      reason: `Calificación ${product.rating}/5`,
      savings: 0
    })
  })

  // Recomendación 3: Alternativas más baratas
  products.forEach(product => {
    const currentMinPrice = Math.min(...Object.values(product.prices).map(p => p?.current || Infinity))
    const alternatives = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .map(p => ({
        product: p,
        price: Math.min(...Object.values(p.prices).map(pr => pr?.current || Infinity))
      }))
      .filter(item => item.price < currentMinPrice)
      .sort((a, b) => a.price - b.price)
      .slice(0, 2)

    alternatives.forEach(alt => {
      recommendations.push({
        type: 'alternative',
        product: alt.product,
        reason: `Alternativa ${Math.round(((currentMinPrice - alt.price) / currentMinPrice) * 100)}% más barata`,
        savings: currentMinPrice - alt.price
      })
    })
  })

  // Eliminar duplicados y limitar a 10 recomendaciones
  const uniqueRecommendations = recommendations
    .filter((rec, index, self) =>
      index === self.findIndex(r => r.product.id === rec.product.id)
    )
    .slice(0, 10)

  return uniqueRecommendations
}
```

## 📋 Tipos TypeScript

### results.ts

```typescript
// modules/comparison-results/types/results.ts
export interface Product {
  id: string
  name: string
  brand: string
  category: string
  prices: Record<string, PriceData>
  image: string
  unit: string
  discount?: DiscountData
  rating?: number
  reviews?: number
  tags?: string[]
  nutritionalInfo?: NutritionalInfo
}

export interface PriceData {
  current: number
  previous?: number
  history: PricePoint[]
  updated: string
  currency: string
  availability: boolean
}

export interface PricePoint {
  price: number
  date: string
  supermarket: string
  discount?: number
}

export interface DiscountData {
  percentage: number
  originalPrice: number
  validUntil: string
  type: 'percentage' | 'fixed' | 'buy_get'
}

export interface NutritionalInfo {
  calories?: number
  proteins?: number
  carbs?: number
  fats?: number
  fiber?: number
}

export interface ResultsFilters {
  category: string
  brand: string
  priceRange: {
    min: number
    max: number
  } | null
  onlyDiscounted: boolean
  minRating: number
}
```

### analysis.ts

```typescript
// modules/comparison-results/types/analysis.ts
export interface AnalysisData {
  totalSavings: number
  percentageSavings: number
  bestDeals: Product[]
  priceDistribution: PriceDistribution
  categorySavings: CategorySavings[]
  timeSavings: TimeSavings
  trends: PriceTrend[]
}

export interface PriceDistribution {
  ranges: {
    min: number
    max: number
    count: number
    percentage: number
  }[]
}

export interface CategorySavings {
  category: string
  savings: number
  percentage: number
  productCount: number
}

export interface TimeSavings {
  hoursSaved: number
  visitsAvoided: number
  fuelSaved: number
}

export interface PriceTrend {
  period: string
  change: number
  direction: 'up' | 'down' | 'stable'
  confidence: number
}
```

## 🧪 Testing

### Tests de Utilidades

```typescript
// modules/comparison-results/__tests__/analysisHelpers.test.ts
import { calculateDetailedAnalysis, formatPrice } from '../utils/analysisHelpers'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Producto 1',
    brand: 'Marca 1',
    category: 'Categoría 1',
    prices: {
      super1: { current: 100, history: [], updated: '2024-01-01', availability: true },
      super2: { current: 120, history: [], updated: '2024-01-01', availability: true }
    },
    image: 'img1.jpg',
    unit: '1kg'
  },
  {
    id: '2',
    name: 'Producto 2',
    brand: 'Marca 2',
    category: 'Categoría 1',
    prices: {
      super1: { current: 80, history: [], updated: '2024-01-01', availability: true },
      super2: { current: 90, history: [], updated: '2024-01-01', availability: true }
    },
    image: 'img2.jpg',
    unit: '1kg'
  }
]

describe('calculateDetailedAnalysis', () => {
  it('should calculate correct savings', () => {
    const analysis = calculateDetailedAnalysis(mockProducts, ['super1', 'super2'])

    expect(analysis.totalSavings).toBe(60) // (120 + 90) - (100 + 80) = 60
    expect(analysis.percentageSavings).toBeCloseTo(25) // 60/240 * 100
  })

  it('should identify best deals', () => {
    const analysis = calculateDetailedAnalysis(mockProducts, ['super1', 'super2'])

    expect(analysis.bestDeals).toHaveLength(2)
    expect(analysis.bestDeals[0].id).toBe('2') // Producto más barato
  })
})

describe('formatPrice', () => {
  it('should format price correctly', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56')
    expect(formatPrice(100)).toBe('$100.00')
  })
})
```

## 🚀 Integración

### Uso en Páginas

```typescript
// src/pages/comparison/[id].tsx
import ComparisonResults from '@/modules/comparison-results'

const ComparisonPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [products, setProducts] = useState([])
  const [supermarkets, setSupermarkets] = useState([])

  // Cargar datos de comparación por ID

  return (
    <ComparisonResults
      comparisonId={id as string}
      products={products}
      supermarkets={supermarkets}
      onBack={() => router.push('/')}
    />
  )
}
```

## 📝 Notas Importantes

- **Performance**: Cálculos de análisis cacheados
- **Persistencia**: Resultados guardados en IndexedDB
- **Compartibilidad**: URLs públicas con IDs únicos
- **Accesibilidad**: Navegación completa por teclado
- **Responsive**: Diseño adaptativo completo
- **SEO**: Meta tags dinámicos para resultados

## 🔄 Próximas Mejoras

- [ ] Análisis predictivo de precios
- [ ] Integración con IA para recomendaciones
- [ ] Alertas personalizadas de precios
- [ ] Comparaciones guardadas como favoritas
- [ ] Modo offline para resultados
- [ ] Integración con Google Analytics
