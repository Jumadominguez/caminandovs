# Frontend - Interfaz de Usuario de Caminando Online

[El Frontend es la capa de presentación de la plataforma Caminando Online, responsable de proporcionar una experiencia de usuario intuitiva y moderna para la comparación de precios de supermercados. Se enfoca en la usabilidad, el diseño responsive y la integración fluida con el backend.]

## 📁 Estructura Modular

```
frontend/
├── public/                    # Assets estáticos
│   ├── images/               # Logos de supermercados, iconos
│   ├── fonts/                # Fuentes personalizadas
│   └── favicon.ico           # Icono del sitio
├── src/
│   ├── modules/              # 🆕 Módulos independientes por sección
│   │   ├── supermarket-selector/     # Selector de supermercados
│   │   │   ├── components/          # Componentes del módulo
│   │   │   ├── hooks/              # Hooks específicos
│   │   │   ├── styles/             # Estilos del módulo
│   │   │   ├── types/              # Tipos del módulo
│   │   │   ├── utils/              # Utilidades del módulo
│   │   │   ├── index.ts            # Export principal
│   │   │   └── README.md           # Documentación del módulo
│   │   ├── product-filters/        # Sistema de filtros
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── product-table/          # Tabla de productos
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── comparison-cart/        # Carrito de comparación
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── comparison-results/     # Resultados de comparación
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── auth-forms/            # Formularios de autenticación
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── user-dashboard/        # Dashboard de usuario
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── header-navigation/     # Header y navegación
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   └── footer/                # Footer del sitio
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── styles/
│   │       ├── types/
│   │       ├── utils/
│   │       ├── index.ts
│   │       └── README.md
│   ├── shared/               # Componentes y utilidades compartidas
│   │   ├── components/       # Componentes base reutilizables
│   │   │   ├── ui/           # Button, Input, Modal, etc.
│   │   │   ├── layout/       # Layout components
│   │   │   └── forms/        # Formularios base
│   │   ├── hooks/            # Hooks compartidos
│   │   ├── styles/           # Estilos globales
│   │   ├── types/            # Tipos globales
│   │   ├── utils/            # Utilidades globales
│   │   └── constants/        # Constantes globales
│   ├── pages/                # Páginas principales
│   │   ├── index.tsx        # Página principal
│   │   ├── productos-comparados.tsx
│   │   ├── dashboard.tsx    # Área privada
│   │   └── auth/            # Páginas de autenticación
│   ├── contexts/             # Context providers globales
│   │   ├── AuthContext.tsx  # Contexto de autenticación
│   │   └── AppContext.tsx   # Contexto general de la app
│   ├── services/             # Servicios API
│   │   ├── api.ts           # Cliente HTTP
│   │   ├── products.ts      # Servicios de productos
│   │   └── auth.ts          # Servicios de autenticación
│   ├── App.tsx               # Componente principal
│   ├── index.tsx             # Punto de entrada
│   └── routes.tsx            # Configuración de rutas
├── tests/                    # Tests
│   ├── modules/             # Tests por módulo
│   ├── shared/              # Tests de componentes compartidos
│   └── utils/               # Tests de utilidades
├── package.json              # Dependencias
├── tsconfig.json             # Configuración TypeScript
├── next.config.js            # Configuración Next.js
└── README.md                 # Documentación del frontend
```

## 📚 Documentación por Módulos

Cada módulo tiene su propia documentación detallada:

| Módulo | Documentación | Descripción |
|--------|---------------|-------------|
| **🏪 Supermarket Selector** | `docs/secciones/frontend/supermarket-selector.md` | Selector de supermercados con logos |
| **🔍 Product Filters** | `docs/secciones/frontend/product-filters.md` | Sistema de filtros dinámicos |
| **📋 Product Table** | `docs/secciones/frontend/product-table.md` | Tabla de productos con selección |
| **🛒 Comparison Cart** | `docs/secciones/frontend/comparison-cart.md` | Carrito de productos a comparar |
| **📊 Comparison Results** | `docs/secciones/frontend/comparison-results.md` | Resultados de comparación |
| **🔐 Auth Forms** | `docs/secciones/frontend/auth-forms.md` | Formularios de login/registro |
| **📈 User Dashboard** | `docs/secciones/frontend/user-dashboard.md` | Panel de usuario |
| **🧭 Header Navigation** | `docs/secciones/frontend/header-navigation.md` | Navegación principal |
| **📄 Footer** | `docs/secciones/frontend/footer.md` | Footer del sitio |
│   ├── hooks/               # Tests de hooks
│   └── utils/               # Tests de utilidades
├── package.json              # Dependencias
├── tsconfig.json             # Configuración TypeScript
├── next.config.js            # Configuración Next.js
└── README.md                 # Documentación del frontend
```

## 🎯 Funcionalidades Principales

- *Interfaz de Comparación*: Página principal con selección de supermercados, filtros y tablas de productos
- *Sistema de Filtros Dinámicos*: Categorías, subcategorías, tipos y subfiltros que se activan progresivamente
- *Gestión de Productos*: Tabla de productos con selección múltiple y carrito de comparación
- *Dashboard de Usuario*: Panel personal con análisis de compras y vinculación de cuentas
- *Sistema de Autenticación*: Login, registro y recuperación de contraseña
- *Responsive Design*: Optimización completa para mobile, tablet y desktop
- *Páginas Operativas*: TOS, contacto, FAQ, manejo de errores 404

## 🛠 Tecnologías Utilizadas

- *React.js*: Framework principal para componentes
- *Next.js*: Framework React con SSR y SSG para mejor performance
- *TypeScript*: Tipado estático para mayor robustez
- *Tailwind CSS*: Framework CSS utility-first para estilos rápidos
- *React Hook Form*: Gestión de formularios con validación
- *React Query*: Gestión de estado del servidor y cache
- *Framer Motion*: Animaciones y transiciones suaves
- *React Router*: Navegación entre páginas
- *Axios*: Cliente HTTP para llamadas API
- *Jest + React Testing Library*: Testing de componentes

## Uso y Ejemplos

### Página Principal (Index)

```typescript
// src/pages/index.tsx
import { useState } from 'react'
import SupermarketSelector from '@/components/SupermarketSelector'
import ProductFilters from '@/components/ProductFilters'
import ProductTable from '@/components/ProductTable'
import ComparisonCart from '@/components/ComparisonCart'

const IndexPage = () => {
  const [selectedSupermarkets, setSelectedSupermarkets] = useState(['carrefour', 'disco', 'jumbo', 'dia', 'vea'])
  const [filters, setFilters] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SupermarketSelector
          selected={selectedSupermarkets}
          onChange={setSelectedSupermarkets}
        />

        <ProductFilters
          filters={filters}
          onChange={setFilters}
          supermarkets={selectedSupermarkets}
        />

        <ProductTable
          filters={filters}
          supermarkets={selectedSupermarkets}
          onProductSelect={(product) => setSelectedProducts([...selectedProducts, product])}
        />

        {selectedProducts.length > 0 && (
          <ComparisonCart
            products={selectedProducts}
            onRemove={(productId) => setSelectedProducts(selectedProducts.filter(p => p.id !== productId))}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default IndexPage
```

### Componente de Filtros Dinámicos

```typescript
// src/components/ProductFilters.tsx
import { useState, useEffect } from 'react'
import { api } from '@/services/api'

interface ProductFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  supermarkets: string[]
}

const ProductFilters = ({ filters, onChange, supermarkets }: ProductFiltersProps) => {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [subfilters, setSubfilters] = useState([])

  useEffect(() => {
    // Cargar categorías basadas en supermercados seleccionados
    api.getCategories(supermarkets).then(setCategories)
  }, [supermarkets])

  const handleCategoryChange = async (categoryId: string) => {
    const subs = await api.getSubcategories(categoryId)
    setSubcategories(subs)
    onChange({ ...filters, category: categoryId, subcategory: null, type: null })
  }

  const handleSubcategoryChange = async (subcategoryId: string) => {
    const types = await api.getProductTypes(subcategoryId)
    setProductTypes(types)
    onChange({ ...filters, subcategory: subcategoryId, type: null })
  }

  const handleTypeChange = async (typeId: string) => {
    const filters = await api.getSubfilters(typeId)
    setSubfilters(filters)
    onChange({ ...filters, type: typeId })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={filters.category || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="">Seleccionar Categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={filters.subcategory || ''}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          disabled={!filters.category}
          className="border rounded-md p-2"
        >
          <option value="">Seleccionar Subcategoría</option>
          {subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>

        <select
          value={filters.type || ''}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={!filters.subcategory}
          className="border rounded-md p-2"
        >
          <option value="">Seleccionar Tipo</option>
          {productTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <button
          onClick={() => onChange({})}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Resetear Filtros
        </button>
      </div>

      {filters.type && subfilters.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {subfilters.map(filter => (
            <div key={filter.id}>
              <label className="block text-sm font-medium mb-1">
                {filter.name}
              </label>
              <select className="border rounded-md p-2 w-full">
                <option value="">Todos</option>
                {filter.options.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductFilters
```

### Hook Personalizado para Productos

```typescript
// src/hooks/useProducts.ts
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { api } from '@/services/api'

interface UseProductsOptions {
  filters?: ProductFilters
  supermarkets?: string[]
  enabled?: boolean
}

export const useProducts = ({ filters, supermarkets, enabled = true }: UseProductsOptions) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const { data: products, isLoading, error, refetch } = useQuery(
    ['products', filters, supermarkets],
    () => api.getProducts({ filters, supermarkets }),
    { enabled }
  )

  const addProduct = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }])
    }
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map(p =>
        p.id === productId ? { ...p, quantity } : p
      )
    )
  }

  const clearProducts = () => {
    setSelectedProducts([])
  }

  return {
    products: products || [],
    selectedProducts,
    isLoading,
    error,
    addProduct,
    removeProduct,
    updateQuantity,
    clearProducts,
    refetch
  }
}
```

## 📋 Convenciones y Patrones

### Nomenclatura

- *Archivos*: kebab-case para páginas y utilidades (index.tsx, product-filters.tsx)
- *Variables*: camelCase para variables y funciones (selectedProducts, handleSubmit)
- *Componentes*: PascalCase para componentes React (ProductTable, UserDashboard)
- *Tipos*: PascalCase con sufijo descriptivo (ProductType, UserInterface, ApiResponse)

### Estructura de Archivos

- *index.ts*: Exporta componentes principales del módulo
- *types.ts*: Define interfaces y tipos TypeScript específicos
- *constants.ts*: Contiene valores constantes y configuraciones
- *utils.ts*: Funciones utilitarias del módulo

### Imports

```typescript
// Imports absolutos con alias
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/services/api'
import { formatPrice } from '@/utils/formatters'
import type { Product, User } from '@/types'

// Imports relativos solo para archivos cercanos
import { validateEmail } from '../utils/validation'
```

## 🔧 Configuración

### Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.caminando.online
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Variables privadas
MONGODB_URI=mongodb://localhost:27017/caminando
JWT_SECRET=your-secret-key
SCRAPING_API_KEY=scraping-service-key
```

### Dependencias Principales

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "framer-motion": "^10.16.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

## 🧪 Testing

### Estructura de Tests

```
__tests__/
├── components/
│   ├── ProductTable.test.tsx
│   ├── ProductFilters.test.tsx
│   └── SupermarketSelector.test.tsx
├── hooks/
│   ├── useProducts.test.ts
│   └── useAuth.test.ts
├── pages/
│   ├── index.test.tsx
│   └── productos-comparados.test.tsx
└── utils/
    ├── formatters.test.ts
    └── validators.test.ts
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests de componentes específicos
npm run test ProductTable

# Tests en modo watch
npm run test:watch
```

## 📝 Notas Importantes

- *Performance*: Usar React.memo para componentes que renderizan listas grandes
- *SEO*: Implementar meta tags dinámicas para páginas de productos
- *Accesibilidad*: Cumplir WCAG 2.1 AA con navegación por teclado
- *Mobile First*: Diseño responsive comenzando desde mobile
- *Error Boundaries*: Implementar para manejo de errores en producción

## 🔗 Referencias y Documentación

- [Documentación oficial de Next.js](https://nextjs.org/docs)
- [Guía de Tailwind CSS](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🚧 Roadmap y TODOs

### Próximas Mejoras

- [ ] Implementar PWA para funcionalidad offline
- [ ] Agregar modo oscuro/claro
- [ ] Optimizar Core Web Vitals
- [ ] Implementar virtualización para listas grandes
- [ ] Agregar internacionalización (i18n)

### Problemas Conocidos

- [ ] Optimización de carga inicial en mobile - Prioridad: Alta
- [ ] Manejo de estado offline - Prioridad: Media
- [ ] Testing de integración end-to-end - Prioridad: Media
