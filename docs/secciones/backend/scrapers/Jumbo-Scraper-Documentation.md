# Documentación del Scraper - Jumbo

## Información General
- **Supermercado**: Jumbo
- **URL Base**: https://www.jumbo.com.ar
- **Plataforma**: VTEX (vtex-menu@2.35.3)
- **Tipo de Menú**: Drawer/Mobile Menu (menú hamburguesa)

## Estructura Técnica Identificada

### 1. Elementos de Navegación
- **Plataforma**: VTEX e-commerce
- **Versión del menú**: vtex-menu@2.35.3
- **Tipo de navegación**: Mobile-first con drawer menu

### 2. Selectores Identificados

#### Botón del Menú Hamburguesa
```css
/* Selector principal del botón menú */
button[class*="jumboargentinaio-store-theme"]
/* También puede ser identificado por texto */
button:contains("Menu")
```

#### Elementos del Drawer/Menu
```css
/* Contenedor del drawer */
.vtex-store-drawer-0-x-openIconContainer--drawer-menu-mobile

/* Elementos del menú desplegable */
.vtex-menu-2-x-menuItem
.vtex-menu-2-x-menuItem--category-menu

/* Contenedor del menú abierto */
[data-testid="menu-drawer"]
.menu-drawer
.mobile-menu
```

#### Enlaces de Categorías
```css
/* Enlaces de categorías dentro del menú */
a[href*="/categoria"]
a[href*="/c/"]
a[href*="/departamento"]

/* Elementos de menú específicos */
.menu-item a
.drawer-menu-item a
.mobile-menu-item a
```

### 3. Flujo de Scraping

#### Paso 1: Carga Inicial
```javascript
await page.goto('https://www.jumbo.com.ar', {
  waitUntil: 'networkidle2',
  timeout: 30000
});
await page.waitForTimeout(5000); // Esperar carga completa
```

#### Paso 2: Localizar Botón del Menú
```javascript
// Buscar el botón del menú hamburguesa
const menuButton = await page.$('button:contains("Menu")') ||
                   await page.$('[class*="jumboargentinaio-store-theme"]') ||
                   await page.$('.vtex-store-drawer-0-x-openIconContainer--drawer-menu-mobile');
```

#### Paso 3: Hacer Click en el Menú
```javascript
await menuButton.click();
await page.waitForTimeout(2000); // Esperar que se abra el drawer
```

#### Paso 4: Extraer Categorías
```javascript
const categories = await page.evaluate(() => {
  const categoryElements = document.querySelectorAll(`
    .vtex-menu-2-x-menuItem a,
    .menu-item a,
    .drawer-menu-item a,
    a[href*="/categoria"],
    a[href*="/c/"]
  `);

  return Array.from(categoryElements).map(link => ({
    name: link.textContent?.trim(),
    url: link.href,
    level: 1,
    hasSubcategories: false
  })).filter(cat => cat.name && cat.url);
});
```

### 4. Consideraciones Técnicas

#### User Agent Recomendado
```javascript
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
```

#### Headers Requeridos
```javascript
{
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache'
}
```

#### Configuración de Puppeteer
```javascript
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor'
  ]
});
```

### 5. Posibles Problemas y Soluciones

#### Problema 1: Menú no se carga
**Solución**: Aumentar tiempo de espera y verificar carga completa
```javascript
await page.waitForFunction(() => {
  return document.querySelector('button:contains("Menu")') !== null;
}, { timeout: 10000 });
```

#### Problema 2: Categorías no aparecen después del click
**Solución**: Esperar a que el drawer esté completamente abierto
```javascript
await page.waitForSelector('.menu-drawer', { visible: true, timeout: 5000 });
```

#### Problema 3: Contenido dinámico
**Solución**: Usar `waitForFunction` para esperar contenido específico
```javascript
await page.waitForFunction(() => {
  const links = document.querySelectorAll('a[href*="/categoria"]');
  return links.length > 0;
}, { timeout: 10000 });
```

### 6. Estructura de Datos Esperada

#### Categoría Individual
```typescript
interface ScrapedCategory {
  name: string;           // Nombre de la categoría
  url: string;            // URL completa de la categoría
  level: number;          // Nivel en la jerarquía (1 = principal)
  parentCategory?: string; // Categoría padre (para sub-categorías)
  hasSubcategories: boolean; // Si tiene subcategorías
}
```

#### Ejemplo de Datos
```javascript
{
  name: "Almacén",
  url: "https://www.jumbo.com.ar/almacen",
  level: 1,
  hasSubcategories: true
}
```

### 7. Próximas Etapas

#### Etapa 2: Extracción de Filtros
- Identificar selectores de filtros en páginas de categoría
- Extraer opciones de filtros disponibles
- Mapear estructura de filtros por categoría

#### Etapa 3: Extracción de Productos
- Implementar paginación automática
- Extraer información completa de productos
- Manejar carga lazy de imágenes y contenido

### 8. Testing y Validación

#### Casos de Prueba
1. **Carga inicial**: Verificar que la página carga completamente
2. **Menú hamburguesa**: Confirmar que el botón del menú es clickeable
3. **Drawer abierto**: Validar que el menú se abre correctamente
4. **Categorías extraídas**: Verificar que se obtienen categorías válidas
5. **URLs válidas**: Confirmar que todas las URLs son accesibles

#### Métricas de Éxito
- ✅ Menú detectado y clickeable
- ✅ Drawer se abre correctamente
- ✅ Mínimo 8-10 categorías principales extraídas
- ✅ Todas las URLs son válidas y accesibles
- ✅ Tiempo de ejecución < 30 segundos

---

**Fecha de Análisis**: Septiembre 2025
**Analista**: GitHub Copilot
**Estado**: Documentación completa para desarrollo del scraper</content>
<parameter name="filePath">d:\caminando-online\backend\src\scrapers\Jumbo-Scraper-Documentation.md
