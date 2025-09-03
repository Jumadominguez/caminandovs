# Product Table - Módulo de Tabla de Productos

[El módulo Product Table implementa una tabla de datos avanzada para mostrar productos de múltiples supermercados con funcionalidades de comparación, ordenamiento, paginación y visualización de precios históricos.]

## 📁 Estructura del Módulo

```
modules/product-table/
├── components/
│   ├── ProductTable.tsx          # Componente principal
│   ├── ProductRow.tsx            # Fila de producto
│   ├── ProductCell.tsx           # Celda de producto
│   ├── TableHeader.tsx           # Cabecera de tabla
│   ├── PriceHistoryModal.tsx     # Modal de historial de precios
│   ├── SortControls.tsx          # Controles de ordenamiento
│   ├── PaginationControls.tsx    # Controles de paginación
│   ├── BulkActions.tsx           # Acciones masivas
│   └── ExportControls.tsx        # Controles de exportación
├── hooks/
│   ├── useProductTable.ts        # Hook principal de tabla
│   ├── useTableSorting.ts        # Hook de ordenamiento
│   ├── useTablePagination.ts     # Hook de paginación
│   ├── usePriceHistory.ts        # Hook de historial de precios
│   └── useBulkActions.ts         # Hook de acciones masivas
├── styles/
│   ├── table.module.css          # Estilos principales
│   ├── rows.css                  # Estilos de filas
│   ├── cells.css                 # Estilos de celdas
│   ├── modals.css                # Estilos de modales
│   └── animations.css            # Animaciones
├── types/
│   ├── product.ts                # Tipos de producto
│   ├── table.ts                  # Tipos de tabla
│   └── sorting.ts                # Tipos de ordenamiento
├── utils/
│   ├── tableConfig.ts            # Configuración de tabla
│   ├── priceCalculations.ts      # Cálculos de precios
│   ├── exportUtils.ts            # Utilidades de exportación
│   └── tableHelpers.ts           # Helpers de tabla
├── index.ts                      # Export principal
└── README.md                     # Documentación
```

## 🎯 Funcionalidades

- **Vista Comparativa**: Productos de múltiples supermercados
- **Ordenamiento Avanzado**: Por precio, nombre, descuento, etc.
- **Paginación Inteligente**: Navegación eficiente de grandes datasets
- **Historial de Precios**: Visualización de evolución de precios
- **Acciones Masivas**: Seleccionar y comparar múltiples productos
- **Exportación**: Exportar datos en múltiples formatos
- **Responsive**: Diseño adaptativo para móviles
- **Performance**: Virtualización para datasets grandes

## 🛠 Tecnologías Utilizadas

- **React**: Componentes con estado complejo
- **TypeScript**: Tipado fuerte para datos de productos
- **Tailwind CSS**: Estilos responsivos
- **React Table**: Librería de tablas avanzada
- **React Virtual**: Virtualización de listas grandes
- **Chart.js**: Gráficos de historial de precios
- **React Context**: Estado global de tabla

## 📋 Componentes Principales

### ProductTable (Componente Principal)

```typescript
// modules/product-table/components/ProductTable.tsx
import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductTable } from '../hooks/useProductTable'
import TableHeader from './TableHeader'
import ProductRow from './ProductRow'
import SortControls from './SortControls'
import PaginationControls from './PaginationControls'
import BulkActions from './BulkActions'
import PriceHistoryModal from './PriceHistoryModal'
import styles from '../styles/table.module.css'

interface ProductTableProps {
  products: Product[]
  supermarkets: string[]
  filters: ProductFilters
  onProductSelect: (product: Product) => void
  onBulkCompare: (products: Product[]) => void
  className?: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  prices: Record<string, PriceData>
  image: string
  description: string
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

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  supermarkets,
  filters,
  onProductSelect,
  onBulkCompare,
  className = ''
}) => {
  const {
    sortedProducts,
    currentPage,
    totalPages,
    selectedProducts,
    sortConfig,
    priceHistoryProduct,
    setSortConfig,
    setCurrentPage,
    toggleProductSelection,
    selectAllProducts,
    clearSelection,
    showPriceHistory,
    closePriceHistory
  } = useProductTable(products, supermarkets)

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * 20
    return sortedProducts.slice(startIndex, startIndex + 20)
  }, [sortedProducts, currentPage])

  return (
    <motion.div
      className={`${styles.tableContainer} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <h2>Productos Encontrados</h2>
          <span className={styles.productCount}>
            {sortedProducts.length} productos
          </span>
        </div>

        <div className={styles.tableControls}>
          <SortControls
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
          />
          <BulkActions
            selectedCount={selectedProducts.length}
            onCompare={() => onBulkCompare(selectedProducts)}
            onClear={clearSelection}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.productTable}>
          <TableHeader
            supermarkets={supermarkets}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            selectedAll={selectedProducts.length === paginatedProducts.length}
            onSelectAll={selectAllProducts}
          />

          <tbody>
            <AnimatePresence>
              {paginatedProducts.map((product, index) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  supermarkets={supermarkets}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={() => toggleProductSelection(product.id)}
                  onProductClick={() => onProductSelect(product)}
                  onPriceHistory={() => showPriceHistory(product)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AnimatePresence>
        {priceHistoryProduct && (
          <PriceHistoryModal
            product={priceHistoryProduct}
            onClose={closePriceHistory}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProductTable
```

### ProductRow

```typescript
// modules/product-table/components/ProductRow.tsx
import React from 'react'
import { motion } from 'framer-motion'
import ProductCell from './ProductCell'
import styles from '../styles/rows.css'

interface ProductRowProps {
  product: Product
  supermarkets: string[]
  isSelected: boolean
  onSelect: () => void
  onProductClick: () => void
  onPriceHistory: () => void
  index: number
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  supermarkets,
  isSelected,
  onSelect,
  onProductClick,
  onPriceHistory,
  index
}) => {
  return (
    <motion.tr
      className={`${styles.productRow} ${isSelected ? styles.selected : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
    >
      <td className={styles.checkboxCell}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className={styles.checkbox}
        />
      </td>

      <ProductCell
        type="product"
        product={product}
        onClick={onProductClick}
      />

      {supermarkets.map((supermarket) => (
        <ProductCell
          key={supermarket}
          type="price"
          product={product}
          supermarket={supermarket}
          onPriceHistory={onPriceHistory}
        />
      ))}

      <ProductCell
        type="actions"
        product={product}
        onPriceHistory={onPriceHistory}
      />
    </motion.tr>
  )
}

export default ProductRow
```

### ProductCell

```typescript
// modules/product-table/components/ProductCell.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { calculatePriceDifference, formatPrice } from '../utils/priceCalculations'
import styles from '../styles/cells.css'

interface ProductCellProps {
  type: 'product' | 'price' | 'actions'
  product: Product
  supermarket?: string
  onClick?: () => void
  onPriceHistory?: () => void
}

const ProductCell: React.FC<ProductCellProps> = ({
  type,
  product,
  supermarket,
  onClick,
  onPriceHistory
}) => {
  if (type === 'product') {
    return (
      <td className={styles.productCell}>
        <div className={styles.productInfo}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
          />
          <div className={styles.productDetails}>
            <h3
              className={styles.productName}
              onClick={onClick}
            >
              {product.name}
            </h3>
            <p className={styles.productBrand}>{product.brand}</p>
            <p className={styles.productCategory}>{product.category}</p>
            <span className={styles.productUnit}>{product.unit}</span>
          </div>
        </div>
      </td>
    )
  }

  if (type === 'price' && supermarket) {
    const priceData = product.prices[supermarket]
    if (!priceData) {
      return (
        <td className={styles.priceCell}>
          <span className={styles.noPrice}>No disponible</span>
        </td>
      )
    }

    const priceDiff = calculatePriceDifference(priceData)
    const hasDiscount = product.discount && product.discount.percentage > 0

    return (
      <td className={styles.priceCell}>
        <div className={styles.priceContainer}>
          <div className={styles.currentPrice}>
            {formatPrice(priceData.current)}
          </div>

          {hasDiscount && (
            <div className={styles.discountBadge}>
              -{product.discount.percentage}%
            </div>
          )}

          {priceData.previous && (
            <div className={`${styles.priceChange} ${
              priceDiff > 0 ? styles.priceUp : styles.priceDown
            }`}>
              {priceDiff > 0 ? '↑' : '↓'} {Math.abs(priceDiff)}%
            </div>
          )}

          <button
            className={styles.historyButton}
            onClick={onPriceHistory}
            title="Ver historial de precios"
          >
            📊
          </button>
        </div>
      </td>
    )
  }

  if (type === 'actions') {
    return (
      <td className={styles.actionsCell}>
        <button
          className={styles.actionButton}
          onClick={onPriceHistory}
          title="Historial de precios"
        >
          📈
        </button>
        <button
          className={styles.actionButton}
          onClick={onClick}
          title="Ver detalles"
        >
          👁️
        </button>
      </td>
    )
  }

  return <td></td>
}

export default ProductCell
```

## 🎣 Hooks Personalizados

### useProductTable

```typescript
// modules/product-table/hooks/useProductTable.ts
import { useState, useMemo, useCallback } from 'react'
import { useTableSorting } from './useTableSorting'
import { useTablePagination } from './useTablePagination'
import { useBulkActions } from './useBulkActions'
import { Product } from '../types/product'

interface UseProductTableProps {
  products: Product[]
  supermarkets: string[]
}

export const useProductTable = ({ products, supermarkets }: UseProductTableProps) => {
  const { sortConfig, sortedProducts, setSortConfig } = useTableSorting(products)
  const { currentPage, totalPages, setCurrentPage } = useTablePagination(sortedProducts.length)
  const {
    selectedProducts,
    toggleProductSelection,
    selectAllProducts,
    clearSelection
  } = useBulkActions(products)

  const [priceHistoryProduct, setPriceHistoryProduct] = useState<Product | null>(null)

  const showPriceHistory = useCallback((product: Product) => {
    setPriceHistoryProduct(product)
  }, [])

  const closePriceHistory = useCallback(() => {
    setPriceHistoryProduct(null)
  }, [])

  return {
    sortedProducts,
    currentPage,
    totalPages,
    selectedProducts,
    sortConfig,
    priceHistoryProduct,
    setSortConfig,
    setCurrentPage,
    toggleProductSelection,
    selectAllProducts,
    clearSelection,
    showPriceHistory,
    closePriceHistory
  }
}
```

### useTableSorting

```typescript
// modules/product-table/hooks/useTableSorting.ts
import { useState, useMemo } from 'react'
import { Product } from '../types/product'
import { SortConfig, SortDirection } from '../types/sorting'

export const useTableSorting = (products: Product[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  })

  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'brand':
          aValue = a.brand.toLowerCase()
          bValue = b.brand.toLowerCase()
          break
        case 'lowestPrice':
          aValue = Math.min(...Object.values(a.prices).map(p => p?.current || Infinity))
          bValue = Math.min(...Object.values(b.prices).map(p => p?.current || Infinity))
          break
        case 'discount':
          aValue = a.discount?.percentage || 0
          bValue = b.discount?.percentage || 0
          break
        default:
          return 0
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    return sorted
  }, [products, sortConfig])

  return {
    sortConfig,
    sortedProducts,
    setSortConfig
  }
}
```

## 🎨 Estilos del Módulo

### table.module.css

```css
/* modules/product-table/styles/table.module.css */
.tableContainer {
  @apply bg-white rounded-lg shadow-lg overflow-hidden;
}

.tableHeader {
  @apply flex items-center justify-between p-6 bg-gray-50 border-b;
}

.tableTitle h2 {
  @apply text-2xl font-bold text-gray-800;
}

.productCount {
  @apply text-sm text-gray-600 ml-2;
}

.tableControls {
  @apply flex items-center space-x-4;
}

.tableWrapper {
  @apply overflow-x-auto;
}

.productTable {
  @apply w-full;
}

.productTable th,
.productTable td {
  @apply px-4 py-3 text-left border-b border-gray-200;
}

.productTable th {
  @apply bg-gray-50 font-semibold text-gray-700;
}

.sortButton {
  @apply ml-2 text-gray-400 hover:text-gray-600 transition-colors;
}

.sortButton.active {
  @apply text-blue-600;
}

.checkbox {
  @apply rounded border-gray-300 text-blue-600 focus:ring-blue-500;
}
```

### cells.css

```css
/* modules/product-table/styles/cells.css */
.productCell {
  @apply min-w-64;
}

.productInfo {
  @apply flex items-center space-x-4;
}

.productImage {
  @apply w-16 h-16 object-cover rounded-lg;
}

.productDetails {
  @apply flex-1;
}

.productName {
  @apply font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors;
}

.productBrand {
  @apply text-sm text-gray-600;
}

.productCategory {
  @apply text-xs text-gray-500;
}

.productUnit {
  @apply text-xs bg-gray-100 px-2 py-1 rounded;
}

.priceCell {
  @apply min-w-32;
}

.priceContainer {
  @apply relative;
}

.currentPrice {
  @apply font-bold text-lg text-gray-900;
}

.discountBadge {
  @apply absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold;
}

.priceChange {
  @apply text-sm;
}

.priceUp {
  @apply text-red-600;
}

.priceDown {
  @apply text-green-600;
}

.historyButton {
  @apply ml-2 text-gray-400 hover:text-blue-600 transition-colors;
}

.noPrice {
  @apply text-gray-400 italic;
}

.actionsCell {
  @apply min-w-24;
}

.actionButton {
  @apply mx-1 p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded transition-all;
}
```

## 🔧 Utilidades

### priceCalculations.ts

```typescript
// modules/product-table/utils/priceCalculations.ts
import { PriceData } from '../types/product'

export const calculatePriceDifference = (priceData: PriceData): number => {
  if (!priceData.previous) return 0

  const difference = ((priceData.current - priceData.previous) / priceData.previous) * 100
  return Math.round(difference * 100) / 100
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(price)
}

export const getLowestPrice = (prices: Record<string, PriceData>): PriceData | null => {
  const validPrices = Object.values(prices).filter(price => price !== null)

  if (validPrices.length === 0) return null

  return validPrices.reduce((lowest, current) =>
    current.current < lowest.current ? current : lowest
  )
}

export const calculateAveragePrice = (prices: Record<string, PriceData>): number => {
  const validPrices = Object.values(prices).filter(price => price !== null)

  if (validPrices.length === 0) return 0

  const sum = validPrices.reduce((total, price) => total + price.current, 0)
  return sum / validPrices.length
}
```

### exportUtils.ts

```typescript
// modules/product-table/utils/exportUtils.ts
import { Product } from '../types/product'
import { formatPrice } from './priceCalculations'

export const exportToCSV = (products: Product[], supermarkets: string[]): void => {
  const headers = [
    'Producto',
    'Marca',
    'Categoría',
    'Unidad',
    ...supermarkets.map(s => `${s} - Precio`),
    ...supermarkets.map(s => `${s} - Descuento`),
    'Precio Más Bajo',
    'Supermercado Más Barato'
  ]

  const rows = products.map(product => {
    const lowestPrice = Math.min(
      ...Object.values(product.prices)
        .filter(p => p)
        .map(p => p.current)
    )

    const cheapestSupermarket = Object.entries(product.prices)
      .filter(([_, price]) => price)
      .reduce((cheapest, [supermarket, price]) =>
        !cheapest || price.current < cheapest.price.current
          ? { supermarket, price }
          : cheapest
      , null as { supermarket: string; price: PriceData } | null)

    return [
      product.name,
      product.brand,
      product.category,
      product.unit,
      ...supermarkets.map(s => {
        const price = product.prices[s]
        return price ? formatPrice(price.current) : 'N/A'
      }),
      ...supermarkets.map(s => {
        const price = product.prices[s]
        return price && product.discount ? `${product.discount.percentage}%` : 'N/A'
      }),
      formatPrice(lowestPrice),
      cheapestSupermarket?.supermarket || 'N/A'
    ]
  })

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `productos_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

export const exportToJSON = (products: Product[]): void => {
  const jsonContent = JSON.stringify(products, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `productos_${new Date().toISOString().split('T')[0]}.json`
  link.click()
}
```

## 📋 Tipos TypeScript

### product.ts

```typescript
// modules/product-table/types/product.ts
export interface Product {
  id: string
  name: string
  brand: string
  category: string
  prices: Record<string, PriceData>
  image: string
  description: string
  unit: string
  discount?: DiscountData
  tags?: string[]
  nutritionalInfo?: NutritionalInfo
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

export interface NutritionalInfo {
  calories?: number
  proteins?: number
  carbs?: number
  fats?: number
  fiber?: number
}
```

### table.ts

```typescript
// modules/product-table/types/table.ts
export interface TableConfig {
  pageSize: number
  showImages: boolean
  showDiscounts: boolean
  showPriceHistory: boolean
  compactView: boolean
}

export interface TableState {
  currentPage: number
  selectedProducts: string[]
  expandedRows: string[]
  sortConfig: SortConfig
}

export interface BulkAction {
  type: 'compare' | 'export' | 'favorite' | 'share'
  products: Product[]
}
```

## 🧪 Testing

### Tests de Componentes

```typescript
// modules/product-table/__tests__/ProductTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProductTable from '../components/ProductTable'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coca-Cola 2.5L',
    brand: 'Coca-Cola',
    category: 'Bebidas',
    prices: {
      carrefour: {
        current: 150,
        previous: 160,
        history: [],
        updated: '2024-01-01'
      }
    },
    image: 'coca-cola.jpg',
    description: 'Gaseosa cola',
    unit: '2.5L'
  }
]

describe('ProductTable', () => {
  it('should render products correctly', () => {
    render(
      <ProductTable
        products={mockProducts}
        supermarkets={['carrefour']}
        filters={{}}
        onProductSelect={jest.fn()}
        onBulkCompare={jest.fn()}
      />
    )

    expect(screen.getByText('Coca-Cola 2.5L')).toBeInTheDocument()
    expect(screen.getByText('$150.00')).toBeInTheDocument()
  })

  it('should handle product selection', () => {
    const mockOnSelect = jest.fn()
    render(
      <ProductTable
        products={mockProducts}
        supermarkets={['carrefour']}
        filters={{}}
        onProductSelect={mockOnSelect}
        onBulkCompare={jest.fn()}
      />
    )

    const productName = screen.getByText('Coca-Cola 2.5L')
    fireEvent.click(productName)

    expect(mockOnSelect).toHaveBeenCalledWith(mockProducts[0])
  })
})
```

## 🚀 Integración

### Uso en la Página Principal

```typescript
// src/pages/index.tsx
import ProductTable from '@/modules/product-table'

const IndexPage = () => {
  const [products, setProducts] = useState([])
  const [selectedSupermarkets, setSelectedSupermarkets] = useState(['carrefour'])
  const [filters, setFilters] = useState({})

  const handleProductSelect = (product) => {
    // Mostrar modal con detalles del producto
  }

  const handleBulkCompare = (products) => {
    // Abrir vista de comparación
  }

  return (
    <div>
      <SupermarketSelector onSelectionChange={setSelectedSupermarkets} />
      <ProductFilters onFiltersChange={setFilters} />
      <ProductTable
        products={products}
        supermarkets={selectedSupermarkets}
        filters={filters}
        onProductSelect={handleProductSelect}
        onBulkCompare={handleBulkCompare}
      />
    </div>
  )
}
```

## 📝 Notas Importantes

- **Performance**: Virtualización para datasets > 1000 productos
- **Responsive**: Vista compacta en móviles
- **Accesibilidad**: Navegación completa por teclado
- **SEO**: Meta tags dinámicos para productos
- **Cache**: Cache inteligente de imágenes de productos
- **Offline**: Funcionalidad básica sin conexión

## 🔄 Próximas Mejoras

- [ ] Vista de tarjetas para móviles
- [ ] Filtros avanzados en tabla
- [ ] Gráficos de comparación de precios
- [ ] Notificaciones de cambios de precio
- [ ] Integración con listas de compras
- [ ] Modo comparación lado a lado
