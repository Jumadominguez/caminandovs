# Jumbo Scraper

Esta carpeta contiene los scripts para el scraping de categorías y subcategorías del sitio web de Jumbo.

## Archivos

### Scripts Principales

- **`extract-subcategories.js`** - Script principal para extraer subcategorías de Jumbo
  - Extrae subcategorías de todas las categorías principales activas
  - Implementa fallback automático cuando no encuentra contenedor de "Sub-Categoría"
  - Guarda snapshots antes de modificaciones en la carpeta `reports/`
  - Actualiza la base de datos con las subcategorías encontradas

- **`check-categories.js`** - Script de verificación
  - Verifica cuántas categorías principales tienen subcategorías
  - Muestra estadísticas de subcategorías por categoría
  - Identifica categorías sin subcategorías

- **`check-subcategories.js`** - Script adicional de verificación
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
