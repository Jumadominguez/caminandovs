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

#### Problema 4: Rate Limiting / Bloqueo por IP
**Síntomas**: Errores 429, captchas, o bloqueo de acceso
**Soluciones**:
- Implementar delays aleatorios entre requests (1-3 segundos)
- Rotar user agents y headers
- Usar proxies si es necesario
- Implementar exponential backoff para retries

#### Problema 5: Cambios en el DOM de VTEX
**Síntomas**: Selectores dejan de funcionar después de updates
**Soluciones**:
- Usar selectores múltiples como fallback
- Implementar detección automática de cambios
- Monitorear logs para identificar selectores obsoletos
- Mantener lista de selectores alternativos

#### Problema 6: Tiempo de carga excesivo
**Síntomas**: Timeouts frecuentes, rendimiento lento
**Soluciones**:
- Optimizar configuración de Puppeteer
- Implementar timeouts progresivos
- Usar `waitForNetworkIdle` en lugar de timeouts fijos
- Paralelizar operaciones cuando sea posible

#### Problema 7: Datos incompletos o corruptos
**Síntomas**: Categorías sin nombre, URLs inválidas
**Soluciones**:
- Implementar validaciones estrictas antes de persistir
- Usar try-catch para capturar errores de parsing
- Log detallado de datos problemáticos
- Reintentar extracción con diferentes estrategias

#### Problema 8: Memoria insuficiente
**Síntomas**: Crash del proceso por uso excesivo de memoria
**Soluciones**:
- Procesar datos en batches pequeños
- Cerrar páginas de Puppeteer después de uso
- Implementar garbage collection manual
- Monitorear uso de memoria con métricas

#### Problema 9: Conexión a base de datos inestable
**Síntomas**: Errores de conexión, timeouts de DB
**Soluciones**:
- Implementar connection pooling
- Usar retry logic con exponential backoff
- Configurar timeouts apropiados
- Implementar circuit breaker pattern

#### Problema 10: Contenido lazy loading no carga
**Síntomas**: Imágenes o contenido no aparecen
**Soluciones**:
- Scroll automático para trigger lazy loading
- Esperar eventos de carga específicos
- Usar `page.waitForFunction` para verificar carga completa
- Implementar retries con scroll adicional

### Estrategias de Retry y Fallback

#### Retry Logic General
```javascript
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      console.log(`Intento ${attempt} falló, reintentando en ${backoffDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
}
```

#### Fallback para Selectores
```javascript
async function findMenuButton(page) {
  const selectors = [
    'button:contains("Menu")',
    '[class*="jumboargentinaio-store-theme"]',
    '.vtex-store-drawer-0-x-openIconContainer--drawer-menu-mobile',
    'button[aria-label*="menu"]',
    '.hamburger-menu'
  ];
  
  for (const selector of selectors) {
    try {
      const element = await page.$(selector);
      if (element) return element;
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('No se pudo encontrar el botón del menú');
}
```

#### Fallback para Extracción de Datos
```javascript
async function extractCategoriesWithFallback(page) {
  // Estrategia primaria
  try {
    return await extractCategoriesPrimary(page);
  } catch (error) {
    console.log('Estrategia primaria falló, intentando fallback');
    
    // Estrategia de fallback
    return await extractCategoriesFallback(page);
  }
}
```

#### Circuit Breaker para Conexiones
```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.lastFailureTime = null;
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
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

## Análisis de Estructura de Base de Datos

Antes de proceder con la implementación del scraper, es crucial analizar y definir la estructura de la base de datos para evitar entradas desordenadas. Esta sección detalla el esquema propuesto para almacenar categorías, filtros y productos de Jumbo.

### Esquema de Categorías
```typescript
interface Category {
  _id: ObjectId;
  supermarket: 'jumbo'; // Identificador único del supermercado
  name: string; // Nombre de la categoría (ej: "Almacén")
  url: string; // URL completa de la categoría
  level: number; // Nivel jerárquico (1 = principal, 2 = subcategoría)
  parentCategory?: ObjectId; // Referencia a categoría padre (si es subcategoría)
  hasSubcategories: boolean; // Indica si tiene subcategorías
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean; // Para controlar categorías obsoletas
}
```

### Esquema de Filtros
```typescript
interface Filter {
  _id: ObjectId;
  categoryId: ObjectId; // Referencia a la categoría
  supermarket: 'jumbo';
  name: string; // Nombre del filtro (ej: "Marca", "Precio")
  type: 'select' | 'range' | 'checkbox'; // Tipo de filtro
  options: string[]; // Opciones disponibles (ej: ["Coca-Cola", "Pepsi"])
  createdAt: Date;
  updatedAt: Date;
}
```

### Esquema de Productos
```typescript
interface Product {
  _id: ObjectId;
  supermarket: 'jumbo';
  categoryId: ObjectId; // Referencia a la categoría principal
  name: string; // Nombre del producto
  brand?: string; // Marca del producto
  price: number; // Precio actual
  originalPrice?: number; // Precio original (si hay descuento)
  discount?: number; // Porcentaje de descuento
  imageUrl: string; // URL de la imagen principal
  productUrl: string; // URL del producto en Jumbo
  sku: string; // Código SKU único
  description?: string; // Descripción del producto
  weight?: string; // Peso o volumen
  unit?: string; // Unidad de medida
  availability: boolean; // Si está disponible
  createdAt: Date;
  updatedAt: Date;
}
```

### Consideraciones de Integridad
- **Relaciones**: Usar referencias ObjectId para mantener integridad referencial
- **Índices**: Crear índices en campos frecuentemente consultados (supermarket, categoryId, name)
- **Validación**: Implementar validaciones en el esquema para asegurar datos correctos
- **Duplicados**: Prevenir duplicados mediante unique constraints en combinaciones críticas
- **Actualizaciones**: Estrategia de upsert para actualizar datos existentes sin crear duplicados

### Estrategia de Persistencia
1. **Validar datos** antes de insertar en la base de datos
2. **Usar transacciones** para operaciones que involucren múltiples colecciones
3. **Implementar logging** detallado de operaciones de base de datos
4. **Backup regular** de datos críticos
5. **Monitoreo de rendimiento** de queries y operaciones

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

#### Métricas de Éxito por Etapa

##### Etapa 1: Extracción de Categorías
- ✅ Menú detectado y clickeable
- ✅ Drawer se abre correctamente
- ✅ **TODAS las categorías extraídas y organizadas en la base de datos**
- ✅ Todas las URLs son válidas y accesibles
- ✅ Tiempo de ejecución < 30 segundos

##### Etapa 2: Extracción de Filtros
- ✅ **TODOS los filtros extraídos y organizados en la base de datos**
- ✅ Filtros mapeados correctamente por categoría
- ✅ Estructura de filtros persistida en MongoDB
- ✅ Validación de integridad de datos de filtros

##### Etapa 3: Extracción de Productos
- ✅ **TODOS los productos extraídos y organizados en la base de datos**
- ✅ Información completa de productos capturada
- ✅ Paginación completa procesada
- ✅ Imágenes y contenido lazy cargado correctamente
- ✅ Datos de productos validados y persistidos

### 9. Debugging y Monitoreo

#### Sistema de Logging Detallado
Implementar logging comprehensivo para debugging y monitoreo del scraper.

##### Niveles de Log
- **DEBUG**: Información detallada para desarrollo (selectores encontrados, tiempos de ejecución)
- **INFO**: Eventos importantes (inicio/fin de extracciones, conexiones exitosas)
- **WARN**: Situaciones que requieren atención (retries, timeouts)
- **ERROR**: Errores que impiden el funcionamiento (conexiones fallidas, datos corruptos)

##### Ejemplo de Configuración Winston
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'jumbo-scraper' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});
```

#### Puntos de Logging Estratégicos
```javascript
// Inicio de scraping
logger.info('Iniciando scraping de Jumbo', { timestamp: new Date() });

// Detección de elementos
logger.debug('Botón menú detectado', { selector: menuButtonSelector });

// Operaciones de base de datos
logger.info('Guardando categorías en DB', { count: categories.length });

// Errores con contexto
logger.error('Error al extraer categorías', {
  error: error.message,
  url: currentUrl,
  attempt: attemptNumber,
  stack: error.stack
});

// Métricas de rendimiento
logger.info('Extracción completada', {
  duration: endTime - startTime,
  categoriesExtracted: categories.length,
  successRate: successCount / totalCount
});
```

#### Debugging de Selectores
```javascript
async function debugSelectors(page, selectors) {
  logger.debug('Debugging selectores en página');
  
  for (const selector of selectors) {
    try {
      const elements = await page.$$(selector);
      logger.debug(`Selector "${selector}": ${elements.length} elementos encontrados`);
      
      if (elements.length > 0) {
        const elementInfo = await page.evaluate(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          textContent: el.textContent?.substring(0, 100)
        }), elements[0]);
        
        logger.debug('Primer elemento encontrado:', elementInfo);
      }
    } catch (error) {
      logger.error(`Error con selector "${selector}":`, error.message);
    }
  }
}
```

#### Monitoreo de Rendimiento
```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      startTime: null,
      endTime: null,
      pagesProcessed: 0,
      errorsCount: 0,
      retryCount: 0
    };
  }
  
  start() {
    this.metrics.startTime = Date.now();
    logger.info('Monitor de rendimiento iniciado');
  }
  
  recordPageProcessed() {
    this.metrics.pagesProcessed++;
  }
  
  recordError() {
    this.metrics.errorsCount++;
  }
  
  recordRetry() {
    this.metrics.retryCount++;
  }
  
  getReport() {
    const duration = Date.now() - this.metrics.startTime;
    return {
      duration,
      pagesProcessed: this.metrics.pagesProcessed,
      errorsCount: this.metrics.errorsCount,
      retryCount: this.metrics.retryCount,
      pagesPerSecond: this.metrics.pagesProcessed / (duration / 1000),
      errorRate: this.metrics.errorsCount / this.metrics.pagesProcessed
    };
  }
  
  logReport() {
    const report = this.getReport();
    logger.info('Reporte de rendimiento', report);
  }
}
```

#### Debugging de Conexión a Base de Datos
```javascript
async function debugDatabaseConnection() {
  try {
    const db = mongoose.connection;
    logger.info('Estado de conexión DB:', db.readyState);
    
    // Verificar colecciones
    const collections = await db.db.listCollections().toArray();
    logger.debug('Colecciones disponibles:', collections.map(c => c.name));
    
    // Contar documentos
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    logger.info(`Documentos en DB - Categorías: ${categoryCount}, Productos: ${productCount}`);
    
  } catch (error) {
    logger.error('Error en debugging de DB:', error);
  }
}
```

#### Alertas y Notificaciones
```javascript
class AlertSystem {
  async sendAlert(message, level = 'error') {
    logger[level](`ALERTA: ${message}`);
    
    // Aquí se podría integrar con servicios como Slack, email, etc.
    // Por ahora, solo log detallado
    if (level === 'error') {
      logger.error('Enviando alerta crítica', { message, timestamp: new Date() });
    }
  }
  
  async alertOnFailure(operation, error) {
    await this.sendAlert(`Fallo en operación: ${operation}`, 'error');
    logger.error('Detalles del error:', {
      operation,
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
  }
  
  async alertOnSuccess(operation, metrics) {
    logger.info(`Operación exitosa: ${operation}`, metrics);
  }
}
```

#### Debugging de Extracción de Datos
```javascript
async function debugDataExtraction(page, category) {
  logger.debug(`Debugging extracción para categoría: ${category.name}`);
  
  try {
    // Verificar URL accesible
    const response = await page.goto(category.url, { waitUntil: 'networkidle2' });
    logger.debug(`Respuesta HTTP: ${response.status()}`);
    
    // Verificar elementos de producto
    const productSelectors = [
      '.product-item',
      '.product-card',
      '[data-product]',
      '.vtex-product'
    ];
    
    for (const selector of productSelectors) {
      const count = await page.$$eval(selector, elements => elements.length);
      logger.debug(`Productos encontrados con "${selector}": ${count}`);
    }
    
    // Verificar paginación
    const paginationSelectors = [
      '.pagination',
      '.pager',
      '[data-pagination]',
      '.vtex-pagination'
    ];
    
    for (const selector of paginationSelectors) {
      const exists = await page.$(selector) !== null;
      logger.debug(`Paginación detectada con "${selector}": ${exists}`);
    }
    
  } catch (error) {
    logger.error(`Error en debugging de ${category.name}:`, error);
  }
}
```

#### Logs de Auditoría
```javascript
async function logAuditEvent(event, details) {
  const auditLog = {
    timestamp: new Date(),
    event,
    details,
    scraper: 'jumbo',
    version: process.env.SCRAPER_VERSION || '1.0.0'
  };
  
  logger.info('AUDIT', auditLog);
  
  // Persistir en colección de auditoría si es necesario
  // await AuditLog.create(auditLog);
}
```

Este sistema de debugging permite:
- Rastrear el flujo completo de ejecución
- Identificar cuellos de botella en rendimiento
- Diagnosticar problemas de selectores rápidamente
- Monitorear la salud del scraper en tiempo real
- Generar reportes detallados para optimización

### 10. Deployment y CI/CD

#### Configuración de Docker
```dockerfile
# Dockerfile para el scraper de Jumbo
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY src/ ./src/
COPY dist/ ./dist/

# Crear directorio para logs
RUN mkdir -p logs

# Variables de entorno
ENV NODE_ENV=production
ENV LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('Scraper is healthy')"

# Comando de ejecución
CMD ["node", "dist/index.js"]
```

#### Docker Compose para Desarrollo
```yaml
version: '3.8'
services:
  jumbo-scraper:
    build: .
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/caminando
      - LOG_LEVEL=debug
    volumes:
      - ./logs:/app/logs
      - ./src:/app/src
    depends_on:
      - mongo
    networks:
      - scraper-network

  mongo:
    image: mongo:6.0
    environment:
      - MONGO_INITDB_DATABASE=caminando
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - scraper-network

volumes:
  mongo_data:

networks:
  scraper-network:
    driver: bridge
```

#### Pipeline de GitHub Actions
```yaml
# .github/workflows/scraper-ci.yml
name: Jumbo Scraper CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongo:
        image: mongo:6.0
        ports:
          - 27017:27017
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
      env:
        MONGODB_URI: mongodb://localhost:27017/test
    
    - name: Build TypeScript
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: jumbo-scraper
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    
    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster jumbo-scraper-cluster \
          --service jumbo-scraper-service \
          --force-new-deployment \
          --region us-east-1

  notify:
    needs: [test, deploy]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
    - name: Send notification
      run: |
        if [ "${{ needs.test.result }}" == "success" ] && [ "${{ needs.deploy.result }}" == "success" ]; then
          echo "✅ Deployment successful"
        else
          echo "❌ Deployment failed"
        fi
```

#### Variables de Entorno
```bash
# .env.production
NODE_ENV=production
MONGODB_URI=mongodb://username:password@host:port/database
LOG_LEVEL=info
SCRAPER_INTERVAL=3600000  # 1 hora en ms
MAX_RETRIES=3
TIMEOUT_MS=30000
AWS_REGION=us-east-1
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

#### Estrategia de Deployment
1. **Blue-Green Deployment**: Mantener dos versiones activas para rollback inmediato
2. **Canary Releases**: Desplegar gradualmente para detectar issues temprano
3. **Rollback Automático**: Revertir automáticamente si las métricas caen por debajo de thresholds
4. **Zero-downtime**: Asegurar que el scraper nunca esté completamente offline

#### Monitoreo en Producción
```javascript
// Integración con servicios de monitoreo
const monitoring = {
  datadog: {
    apiKey: process.env.DATADOG_API_KEY,
    appKey: process.env.DATADOG_APP_KEY
  },
  
  newRelic: {
    licenseKey: process.env.NEW_RELIC_LICENSE_KEY
  },
  
  prometheus: {
    pushGateway: process.env.PROMETHEUS_PUSH_GATEWAY
  }
};

// Métricas clave a monitorear
const metrics = {
  scrapeDuration: 'histogram',
  categoriesExtracted: 'counter',
  productsExtracted: 'counter',
  errorsCount: 'counter',
  retryCount: 'counter',
  dbConnectionStatus: 'gauge'
};
```

#### Backup y Recovery
```javascript
class BackupManager {
  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `/backups/jumbo-scraper-${timestamp}`;
    
    // Backup de base de datos
    await this.backupDatabase(backupPath);
    
    // Backup de logs
    await this.backupLogs(backupPath);
    
    // Backup de configuración
    await this.backupConfig(backupPath);
    
    logger.info(`Backup creado: ${backupPath}`);
  }
  
  async restoreFromBackup(backupPath) {
    logger.info(`Restaurando desde: ${backupPath}`);
    
    // Restaurar base de datos
    await this.restoreDatabase(backupPath);
    
    // Verificar integridad
    await this.verifyRestore();
    
    logger.info('Restauración completada');
  }
}
```

#### Escalado Horizontal
```javascript
class ScraperOrchestrator {
  constructor() {
    this.workers = [];
    this.maxWorkers = process.env.MAX_WORKERS || 5;
  }
  
  async scaleWorkers(targetCategories) {
    const workersNeeded = Math.min(targetCategories.length, this.maxWorkers);
    
    // Crear workers adicionales si es necesario
    while (this.workers.length < workersNeeded) {
      const worker = await this.createWorker();
      this.workers.push(worker);
    }
    
    // Distribuir trabajo entre workers
    await this.distributeWork(targetCategories);
  }
  
  async createWorker() {
    // Lógica para crear instancia de scraper worker
    const worker = new JumboScraper();
    await worker.initialize();
    return worker;
  }
  
  async distributeWork(categories) {
    const chunks = this.chunkArray(categories, this.workers.length);
    
    const promises = this.workers.map((worker, index) => 
      worker.processCategories(chunks[index])
    );
    
    await Promise.all(promises);
  }
}
```

#### Seguridad en Producción
- **Secrets Management**: Usar AWS Secrets Manager o similar para credenciales
- **Network Security**: Configurar VPC, security groups y firewalls
- **Access Control**: Implementar IAM roles con principio de menor privilegio
- **Audit Logging**: Mantener logs detallados de todas las operaciones
- **Regular Updates**: Actualizar dependencias y sistema operativo regularmente

---

**Fecha de An�lisis**: Septiembre 2025
**Analista**: GitHub Copilot
**Estado**: Documentaci�n completa y detallada para desarrollo del scraper con plan de implementaci�n, debugging y deployment
