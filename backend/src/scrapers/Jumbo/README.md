# Jumbo Scraper

Esta carpeta contiene el script principal para el scraping completo de categorías y subcategorías del sitio web de Jumbo.

## Archivo Principal

### **`scraperCategories-Jumbo.js`** - Script completo de scraping de Jumbo
- **Extrae información del supermercado** (logo, descripción, etc.)
- **Extrae categorías principales** del menú de navegación
- **Extrae subcategorías** con fallback automático inteligente
- **Implementa normalización Unicode** para nombres con acentos
- **Genera reportes comparativos** detallados con diferencias
- **Reemplaza colecciones** sin duplicados usando estrategia raw
- **Maneja errores robustamente** con múltiples estrategias de recuperación

## Características

- ✅ **Scraping completo**: Supermercado + Categorías + Subcategorías
- ✅ **Unicode normalization**: Manejo correcto de acentos (ñ, á, é, etc.)
- ✅ **Fallback automático**: Usa contenedor de "Categoría" cuando no hay "Sub-Categoría"
- ✅ **Reportes detallados**: Comparación de cambios entre ejecuciones
- ✅ **Estrategia raw**: Evita duplicados y permite rollback
- ✅ **Múltiples estrategias**: Detección robusta de elementos DOM

## Uso

```bash
cd backend/src/scrapers/Jumbo
node scraperCategories-Jumbo.js
```

## Reportes

Los reportes se generan automáticamente en la carpeta `reports/` con:
- Snapshot de colecciones actuales
- Estadísticas detalladas
- Comparación de cambios
- Resumen ejecutivo

## Base de Datos

- **Base de datos**: `Jumbo`
- **Colecciones principales**: `categories`, `supermarkets`
- **Colecciones temporales**: `categories-raw`, `supermarkets-raw`
  - Verifica subcategorías específicas
  - Utilizado para debugging y validación

### Carpeta Reports

La carpeta `reports/` contiene todos los snapshots y reportes generados:

- **`snapshot-categories-*.md`** - Snapshots automáticos de la colección 'categories'
  - Generados antes de cada ejecución del script principal
  - Contienen estadísticas completas de categorías y subcategorías
  - Formato Markdown con timestamp

- **`subcategorias-jumbo.md`** - Reporte manual de subcategorías
  - Documentación adicional de subcategorías

## Funcionalidades

### Fallback Automático
El script `extract-subcategories.js` implementa un sistema de fallback automático:
- Primero busca contenedor de "Sub-Categoría"
- Si no lo encuentra, automáticamente busca contenedor de "Categoría"
- Usa los elementos de Categoría como subcategorías
- Marca las subcategorías fallback con `isFallback: true`

### Base de Datos
- Conecta a MongoDB en `localhost:27017/Jumbo`
- Trabaja con la colección `categories`
- Actualiza categorías padre con referencias a subcategorías
- Usa operaciones upsert para evitar duplicados

## Uso

```bash
# Ejecutar extracción de subcategorías
node extract-subcategories.js

# Verificar estado de categorías
node check-categories.js

# Verificar subcategorías específicas
node check-subcategories.js
```

## Dependencias

- `puppeteer` - Para web scraping
- `mongoose` - Para conexión a MongoDB
- `fs` y `path` - Para manejo de archivos y snapshots
