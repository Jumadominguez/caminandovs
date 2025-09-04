# Documentación del Scraper - Jumbo

## Información General

- **Sitio Web**: www.jumbo.com.ar
- **Plataforma**: VTEX (vtex-menu@2.35.3)
- **Tipo de Menú**: Drawer/Mobile Menu
- **Framework Frontend**: React + VTEX IO
- **Estado**: ✅ **TAREA 2 COMPLETADA** - Click en categoría "Almacén" funcional
- **✅ Primera Tarea Completada**: Scraper básico funcional que abre el menú de categorías
- **✅ Segunda Tarea Completada**: Click automático en categoría "Almacén"

## ✅ Tarea 2: Click en Categoría "Almacén" Completada

### Nueva Funcionalidad Implementada
```typescript
// Nueva función agregada a JumboScraper.ts
async clickAlmacenCategory(): Promise<void> {
  // Busca y hace click en la categoría "Almacén" dentro del menú desplegado
}
```

### Selectores Encontrados para "Almacén"
```css
/* Selector principal que funcionó */
a[href="/almacen"] /* ✅ 3 elementos encontrados */

/* Otros selectores probados */
a[href*="almacen"]
[class*="menuItem"]:has-text("Almacén")
.vtex-menu-2-x-menuItem a[href="/almacen"]
```

### Resultado de la Prueba
```
🔍 Buscando categoría "Almacén" en el menú desplegado...
🔍 Probando selector para Almacén: a[href="/almacen"]
✅ Categoría "Almacén" encontrada con selector: a[href="/almacen"] (3 elementos)
✅ Click en categoría "Almacén" realizado correctamente
🎉 Scraper ejecutado exitosamente
```

### Flujo Completo Actual
1. ✅ Inicializar navegador y página
2. ✅ Navegar a www.jumbo.com.ar
3. ✅ Abrir menú de categorías (`.vtex-menu-2-x-menuItem--category-menu`)
4. ✅ **Buscar y hacer click en "Almacén" (`a[href="/almacen"]`)**
5. 🔄 Próximo: Extraer productos de la categoría Almacén

### Implementación Técnica

#### Método `clickAlmacenCategory()`
- **Propósito**: Buscar la categoría "Almacén" en el menú desplegado y hacer click
- **Estrategia**: Múltiples selectores con fallback a búsqueda por texto
- **Tiempo de espera**: 2 segundos para que el menú se abra completamente
- **Validación**: Verifica que el elemento existe antes de hacer click

#### Manejo de Errores
- Captura de pantalla automática si no se encuentra la categoría
- Múltiples estrategias de búsqueda (CSS selectors + texto)
- Logging detallado para debugging

### Próxima Tarea: Extracción de Productos
Después de hacer click en "Almacén", necesitamos:
1. Esperar a que cargue la página de productos
2. Extraer información de productos (nombre, precio, etc.)
3. Implementar paginación si es necesario
4. Guardar los datos extraídos

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

## Estado del Desarrollo

### ✅ Tarea 1: Scraper Básico - COMPLETADA
**Estado**: ✅ Funcional
**Fecha**: 2025-09-03
**Commit**: V0.2.1

#### Funcionalidades Implementadas
- ✅ Inicialización de Puppeteer con configuración headless
- ✅ Navegación a www.jumbo.com.ar
- ✅ Detección y apertura del menú de categorías
- ✅ Captura de pantalla para análisis
- ✅ Manejo de errores y logging completo

#### Selector Encontrado
```css
.vtex-menu-2-x-menuItem--category-menu
```

#### Código de Implementación
```typescript
// JumboScraper.ts - Clase principal
export class JumboScraper {
  async openCategoryMenu(): Promise<void> {
    const menuSelectors = [
      '.vtex-menu-2-x-menuItem--category-menu', // ✅ Selector funcional
      '.vtex-menu-2-x-styledLink--category-menu',
      // ... otros selectores de respaldo
    ];

    for (const selector of menuSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        await element.click();
        console.log(`✅ Menú encontrado con selector: ${selector}`);
        return;
      }
    }
  }
}
```

#### Resultados de Prueba
```
🧪 Iniciando prueba del scraper básico de Jumbo...
🎯 Iniciando scraper básico de Jumbo...
🚀 Inicializando scraper de Jumbo...
✅ Scraper inicializado correctamente
🌐 Navegando a www.jumbo.com.ar...
✅ Página cargada correctamente
🔍 Buscando menú de categorías...
✅ Menú encontrado con selector: .vtex-menu-2-x-menuItem--category-menu
✅ Menú de categorías abierto correctamente
🎉 Scraper ejecutado exitosamente
```

#### Archivos Creados
- `backend/src/scrapers/JumboScraper.ts` - Scraper principal con funcionalidad completa

## Próximas Etapas

### 🔄 Tarea 2: Extracción de Categorías (Próxima)
- Extraer todas las categorías principales del menú
- Mapear estructura jerárquica de categorías
- Crear lista completa de URLs de categorías
- Implementar validación de categorías activas

### Etapa 3: Extracción de Productos
- Implementar paginación automática
- Extraer datos básicos de productos
- Manejar errores y reintentos
- Optimizar tiempos de respuesta

### Etapa 4: Extracción Avanzada
- Extraer datos detallados de productos
- Implementar filtros y búsqueda
- Parsear especificaciones técnicas
- Extraer información nutricional

### Etapa 5: Testing y Validación
- Validar integridad de datos
- Testing de edge cases
- Optimización de rendimiento
- Implementar sistema de reintentos

### Etapa 6: Producción
- Despliegue del scraper
- Monitoreo continuo
- Mantenimiento y actualizaciones
- Sistema de alertas

## 📊 Resumen del Progreso Actual

### ✅ Tareas Completadas
1. **TAREA 1**: Scraper básico funcional
   - ✅ Inicialización del navegador con Puppeteer
   - ✅ Navegación a www.jumbo.com.ar
   - ✅ Detección y apertura del menú de categorías
   - ✅ Selector identificado: `.vtex-menu-2-x-menuItem--category-menu`
   - ✅ Testing y validación completados

2. **TAREA 2**: Click en categoría "Almacén"
   - ✅ Búsqueda automática de categoría "Almacén" en menú desplegado
   - ✅ Selector identificado: `a[href="/almacen"]` (3 elementos encontrados)
   - ✅ Click automático funcional
   - ✅ Testing y validación completados

### 🔄 Estado Actual del Scraper
- **Funcionalidad**: Navegación + Apertura de menú + Click en Almacén
- **Archivos principales**:
  - `backend/src/scrapers/JumboScraper.ts` - Scraper principal con funcionalidad completa
- **Tiempo de ejecución**: ~15-20 segundos (incluyendo esperas)
- **Éxito de pruebas**: 100% en pruebas realizadas

### 🎯 Próximos Pasos Inmediatos
- **TAREA 3**: Extraer productos de la categoría Almacén
- **TAREA 4**: Implementar paginación automática
- **TAREA 5**: Extracción de datos detallados de productos
