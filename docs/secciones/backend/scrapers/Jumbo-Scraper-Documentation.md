# Documentación del Scraper - Jumbo

## Información General

- **Sitio Web**: www.jumbo.com.ar
- **Plataforma**: VTEX (vtex-menu@2.35.3)
- **Tipo de Menú**: Drawer/Mobile Menu
- **Framework Frontend**: React + VTEX IO
- **Estado**: Documentación completa para desarrollo del scraper
- **✅ Primera Tarea Completada**: Scraper básico funcional que abre el menú de categorías

## ✅ Tarea 1: Scraper Básico Completado

### Código Implementado
```typescript
// Selector correcto encontrado: .vtex-menu-2-x-menuItem--category-menu
const menuSelectors = [
  '.vtex-menu-2-x-menuItem--category-menu', // ✅ Selector funcional
  '.vtex-menu-2-x-styledLink--category-menu',
  '[class*="menuItem"][class*="category"]',
  'li[class*="menuItem"]:has-text("CATEGORÍAS")',
  'nav li:has-text("CATEGORÍAS")',
  '.menu-toggle',
  '.hamburger-menu',
  '.mobile-menu-toggle'
];
```

### Resultado de la Prueba
```
🔍 Probando selector: .vtex-menu-2-x-menuItem--category-menu
✅ Menú encontrado con selector: .vtex-menu-2-x-menuItem--category-menu
✅ Menú de categorías abierto correctamente
🎉 Scraper ejecutado exitosamente
```

### Implementación Técnica

#### Dependencias Requeridas
```json
{
  "puppeteer": "^21.0.0",
  "@types/puppeteer": "^5.4.0"
}
```

#### Configuración de TypeScript
```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM"],
    // ... otras opciones
  }
}
```

#### Patrón de Selectores Encontrados
```css
/* Menú de categorías principal */
.vtex-menu-2-x-menuItem--category-menu

/* Elementos relacionados con el menú */
.vtex-menu-2-x-styledLink--category-menu
.vtex-menu-2-x-menuContainer--category-menu
.vtex-menu-2-x-menuItem--header-category
```

### Próxima Tarea: Extraer Categorías del Menú
Una vez que el menú está abierto, necesitamos:
1. Extraer todas las categorías principales del menú desplegado
2. Identificar los selectores para cada categoría
3. Crear función para obtener la lista completa de categorías
4. Validar que todas las categorías sean extraídas correctamente

## Análisis de Estructuras

### 1. Página Global (www.jumbo.com.ar)

#### Estructura de Navegación Principal
```html
<!-- Menú principal con categorías -->
<nav class="main-navigation">
  <div class="category-links">
    <a href="/almacen">Almacén</a>
    <a href="/bebidas">Bebidas</a>
    <a href="/especial-carnes">Carnes</a>
    <a href="/lacteos">Lácteos</a>
    <a href="/limpieza">Limpieza</a>
    <a href="/perfumeria">Perfumería</a>
    <a href="/electro/tv-y-video/televisores">Televisores</a>
  </div>
</nav>
```

#### Algunas Categorías Principales Identificadas
- Almacén (`/almacen`)
- Bebidas (`/bebidas`)
- Carnes (`/especial-carnes`)
- Lácteos (`/lacteos`)
- Limpieza (`/limpieza`)
- Perfumería (`/perfumeria`)
- Electro (`/electro`)
- Frescos (`/frescos`)
- Bebés (`/bebes`)
- Mascotas (`/mascotas`)

#### Selectores CSS para Categorías
```css
/* Categorías principales */
.category-links a[href*="/"]
.main-navigation .category-item

/* Banners promocionales */
.promotional-banner
.slider-container

/* Productos destacados */
.featured-products .product-item
```

### 2. Página de Categoría (https://www.jumbo.com.ar/almacen)

#### Estructura General
```html
<div class="category-page">
  <header class="category-header">
    <h1>Almacén</h1>
    <span class="product-count">3790 productos</span>
  </header>

  <div class="filters-sidebar">
    <!-- Filtros disponibles -->
  </div>

  <div class="products-grid">
    <!-- Lista de productos -->
  </div>

  <div class="pagination">
    <!-- Paginación -->
  </div>
</div>
```

#### Sistema de Filtros
```html
<!-- Sidebar de filtros -->
<div class="filters-container">
  <div class="filter-group">
    <h3>Categoría</h3>
    <div class="subcategory-list">
      <!-- Subcategorías -->
    </div>
  </div>

  <div class="filter-group">
    <h3>Marca</h3>
    <div class="brand-list">
      <!-- Marcas disponibles -->
    </div>
  </div>

  <div class="filter-group">
    <h3>Precio</h3>
    <div class="price-ranges">
      <!-- Rangos de precio -->
    </div>
  </div>
</div>
```

#### Selectores para Productos en Grid
```css
/* Contenedor de productos */
.products-grid
.product-listing

/* Item individual de producto */
.product-item
.product-card
.product-summary

/* Información del producto */
.product-name
.product-price
.product-brand
.product-image img

/* Botón agregar al carrito */
.add-to-cart-btn
```

#### Paginación
```html
<div class="pagination-container">
  <span class="current-page">Página 1 de 50</span>
  <div class="page-numbers">
    <a href="?page=1" class="page-link active">1</a>
    <a href="?page=2" class="page-link">2</a>
    <a href="?page=3" class="page-link">3</a>
    <!-- ... -->
  </div>
</div>
```

#### URLs de Paginación
- Base: `https://www.jumbo.com.ar/almacen`
- Paginada: `https://www.jumbo.com.ar/almacen?page=2`
- Con filtros: `https://www.jumbo.com.ar/almacen?marca=kitkat&page=1`

### 3. Página de Producto (https://www.jumbo.com.ar/oblea-leche-4-fingers-41-5-grs-kitkat-2/p)

#### Estructura General del Producto
```html
<div class="product-page">
  <div class="product-images">
    <!-- Imágenes del producto -->
  </div>

  <div class="product-info">
    <h1 class="product-name">Oblea Leche 4 Fingers 41.5 Grs Kitkat®</h1>
    <div class="product-price">
      <!-- Información de precio -->
    </div>
    <div class="product-details">
      <!-- Detalles del producto -->
    </div>
  </div>
</div>
```

#### Información del Producto
```html
<!-- Nombre del producto -->
<h1 class="product-name">Oblea Leche 4 Fingers 41.5 Grs Kitkat®</h1>

<!-- Precio -->
<div class="product-price">
  <span class="current-price">$1.776,86</span>
  <span class="original-price">$PRECIO SIN IMPUESTOS NACIONALES</span>
</div>

<!-- SKU -->
<div class="product-sku">
  <span>SKU: 11811368004</span>
</div>

<!-- Descripción -->
<div class="product-description">
  <p>Disfrutá de tu break con KitKat, el snack ideal para esos momentos de descanso.</p>
</div>

<!-- Características -->
<div class="product-specifications">
  <div class="spec-item">
    <strong>Tipo de Producto:</strong> Obleas
  </div>
  <div class="spec-item">
    <strong>País de Origen:</strong> Argentina
  </div>
  <div class="spec-item">
    <strong>Contenido:</strong> Menor a 250 g
  </div>
  <div class="spec-item">
    <strong>Origen:</strong> Nacional
  </div>
</div>

<!-- Ingredientes -->
<div class="ingredients">
  <h3>Ingredientes</h3>
  <p>Azúcar, leche en polvo entera, leche en polvo descremada, manteca de cacao...</p>
</div>

<!-- Información Nutricional -->
<div class="nutrition-info">
  <!-- Tabla nutricional -->
</div>
```

#### Selectores CSS para Datos del Producto
```css
/* Nombre del producto */
.product-name
.product-title h1

/* Precio */
.product-price .current-price
.product-price .original-price

/* SKU */
.product-sku
.product-id

/* Descripción */
.product-description
.product-summary

/* Especificaciones */
.product-specifications .spec-item

/* Ingredientes */
.ingredients
.nutrition-facts

/* Imagen principal */
.product-images .main-image img
.product-gallery img
```

#### Breadcrumb de Navegación
```html
<nav class="breadcrumb">
  <a href="/">Inicio</a>
  <span>/</span>
  <a href="/almacen">Almacén</a>
  <span>/</span>
  <a href="/almacen/golosinas-y-chocolates">Golosinas y Chocolates</a>
  <span>/</span>
  <a href="/almacen/golosinas-y-chocolates/chocolates">Chocolates</a>
  <span>/</span>
  <span>Oblea Leche 4 Fingers 41.5 Grs Kitkat®</span>
</nav>
```

## URLs y Patrones Identificados

### Patrón de URLs de Categorías
- Base: `https://www.jumbo.com.ar/{categoria}`
- Ejemplos:
  - `https://www.jumbo.com.ar/almacen`
  - `https://www.jumbo.com.ar/bebidas`
  - `https://www.jumbo.com.ar/lacteos`

### Patrón de URLs de Subcategorías
- `https://www.jumbo.com.ar/{categoria}/{subcategoria}`
- Ejemplos:
  - `https://www.jumbo.com.ar/almacen/golosinas-y-chocolates`
  - `https://www.jumbo.com.ar/bebidas/cervezas`

### Patrón de URLs de Productos
- `https://www.jumbo.com.ar/{nombre-producto-slug}/p`
- Ejemplo: `https://www.jumbo.com.ar/oblea-leche-4-fingers-41-5-grs-kitkat-2/p`

### Patrón de URLs con Paginación
- `https://www.jumbo.com.ar/{categoria}?page={numero}`
- Ejemplo: `https://www.jumbo.com.ar/almacen?page=2`

### Patrón de URLs con Filtros
- `https://www.jumbo.com.ar/{categoria}?{filtro}={valor}&page={numero}`
- Ejemplos:
  - `https://www.jumbo.com.ar/almacen?marca=kitkat&page=1`
  - `https://www.jumbo.com.ar/almacen?precio=0-100&page=1`

## Estructura de Datos Esperada

### Categoría
```typescript
interface JumboCategory {
  id: string;
  name: string;
  url: string;
  productCount: number;
  subcategories?: JumboSubcategory[];
}
```

### Subcategoría
```typescript
interface JumboSubcategory {
  id: string;
  name: string;
  url: string;
  parentCategory: string;
  productCount: number;
}
```

### Producto
```typescript
interface JumboProduct {
  sku: string;
  name: string;
  brand: string;
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  description: string;
  specifications: {
    tipoProducto?: string;
    paisOrigen?: string;
    contenido?: string;
    origen?: string;
  };
  ingredients?: string;
  nutritionInfo?: object;
  images: string[];
  url: string;
  category: string;
  subcategory?: string;
  availability: boolean;
}
```

## Consideraciones Técnicas para el Scraper

### 1. Anti-Bot Protection
- VTEX implementa protección anti-bot
- Posibles técnicas: rate limiting, CAPTCHAs
- Recomendación: implementar delays entre requests

### 2. JavaScript Rendering
- El sitio usa React + VTEX IO
- Contenido dinámico cargado vía JavaScript
- Recomendación: usar Puppeteer o Playwright

### 3. Paginación
- Máximo de productos por página: ~48 productos
- Total de páginas variable por categoría
- Implementar paginación automática

### 4. Rate Limiting
- Implementar delays entre requests (2-5 segundos)
- Rotar user agents
- Manejar errores 429 (Too Many Requests)

### 5. Data Parsing
- Precios en formato argentino: `$1.776,86`
- Convertir a formato numérico: 1776.86
- Manejar productos sin stock
- Parsear especificaciones técnicas



## Posibles Problemas y Soluciones

### Problema 1: Contenido Dinámico
**Solución**: Usar Puppeteer con `waitForSelector` para esperar carga completa

### Problema 2: Rate Limiting
**Solución**: Implementar delays exponenciales y rotación de proxies

### Problema 3: Cambios en el DOM
**Solución**: Usar selectores CSS múltiples y XPath como fallback

### Problema 4: Productos Sin Stock
**Solución**: Verificar disponibilidad antes de extraer datos completos

### Problema 5: Precios Dinámicos
**Solución**: Capturar tanto precio actual como precio original

<parameter name="filePath">d:\caminando-online\docs\secciones\backend\scrapers\Jumbo-Scraper-Documentation.md
