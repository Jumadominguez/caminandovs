# Scraping - Sistema de Web Scraping de Caminando Online

[El sistema de scraping es el componente crítico que permite a Caminando Online obtener datos actualizados de precios y productos de los 5 supermercados argentinos. Utiliza técnicas avanzadas de web scraping con Puppeteer y Cheerio, implementando estrategias de rate limiting, manejo de CAPTCHAs y rotación de user agents para evitar bloqueos.]

## 📁 Estructura

```
scraping/
├── core/                   # Núcleo del sistema de scraping
│   ├── scraper.ts         # Clase base del scraper
│   ├── browser.ts         # Gestión de instancias de Puppeteer
│   ├── parser.ts          # Parsers de HTML
│   └── scheduler.ts       # Programador de tareas
├── scrapers/              # Scrapers específicos por supermercado
│   ├── carrefour.ts       # Scraper de Carrefour
│   ├── disco.ts           # Scraper de Disco
│   ├── jumbo.ts           # Scraper de Jumbo
│   ├── dia.ts             # Scraper de Día
│   ├── vea.ts             # Scraper de Vea
│   └── base.ts            # Clase base para scrapers
├── processors/            # Procesadores de datos
│   ├── dataProcessor.ts   # Procesamiento general
│   ├── priceProcessor.ts  # Procesamiento de precios
│   ├── productProcessor.ts # Procesamiento de productos
│   └── imageProcessor.ts  # Procesamiento de imágenes
├── utils/                 # Utilidades de scraping
│   ├── userAgents.ts      # Rotación de user agents
│   ├── proxies.ts         # Gestión de proxies
│   ├── rateLimiter.ts     # Control de tasa de requests
│   ├── captchaSolver.ts   # Resolución de CAPTCHAs
│   └── retryMechanism.ts  # Mecanismo de reintentos
├── storage/               # Almacenamiento de datos scrapeados
│   ├── queue.ts           # Cola de trabajos
│   ├── cache.ts           # Caché de resultados
│   └── backup.ts          # Backup de datos
├── monitoring/            # Monitoreo del scraping
│   ├── logger.ts          # Logging específico
│   ├── metrics.ts         # Métricas de performance
│   ├── alerts.ts          # Sistema de alertas
│   └── dashboard.ts       # Dashboard de monitoreo
├── config/                # Configuraciones
│   ├── supermarkets.ts    # Config de cada supermercado
│   ├── scraping.ts        # Config general de scraping
│   └── selectors.ts       # Selectores CSS por sitio
├── jobs/                  # Trabajos programados
│   ├── dailyScraping.ts   # Job diario de scraping
│   ├── incrementalUpdate.ts # Actualizaciones incrementales
│   └── emergencyScrape.ts # Scraping de emergencia
├── tests/                 # Tests del sistema
│   ├── unit/              # Tests unitarios
│   ├── integration/       # Tests de integración
│   └── mocks/             # Mocks de respuestas HTTP
├── scripts/               # Scripts de utilidad
│   ├── setup.ts           # Configuración inicial
│   ├── validate.ts        # Validación de selectores
│   └── debug.ts           # Herramientas de debug
├── docs/                  # Documentación
│   ├── api.md             # Documentación de API
│   ├── selectors.md       # Guía de selectores
│   └── troubleshooting.md # Solución de problemas
├── package.json           # Dependencias
└── README.md              # Documentación principal
```

## 🎯 Funcionalidades Principales

- *Scraping Automatizado*: Recolección diaria de precios y productos
- *Múltiples Supermercados*: Soporte para 5 cadenas argentinas
- *Gestión de Rate Limiting*: Control inteligente de frecuencia de requests
- *Manejo de CAPTCHAs*: Detección y resolución automática
- *Rotación de Proxies*: Evitar bloqueos IP con proxies rotativos
- *Procesamiento de Datos*: Limpieza y normalización de datos scrapeados
- *Sistema de Reintentos*: Recuperación automática de fallos temporales
- *Monitoreo en Tiempo Real*: Dashboard de estado y métricas
- *Backup y Recuperación*: Estrategias de respaldo de datos críticos

## 🛠 Tecnologías Utilizadas

- *Puppeteer*: Automatización de navegadores para sitios con JavaScript
- *Cheerio*: Parsing rápido de HTML para sitios estáticos
- *Axios*: Cliente HTTP para requests ligeros
- *Proxy Agent*: Gestión de proxies HTTP/SOCKS
- *User Agent Rotator*: Rotación automática de user agents
- *Rate Limiter*: Control de tasa de requests por dominio
- *Redis*: Cola de trabajos y caché de resultados
- *Winston*: Sistema avanzado de logging
- *Node-cron*: Programación de tareas automatizadas
- *Sharp*: Procesamiento de imágenes de productos

## Uso y Ejemplos

### Clase Base del Scraper

```typescript
// scraping/core/scraper.ts
import puppeteer, { Browser, Page } from 'puppeteer'
import cheerio from 'cheerio'
import { RateLimiter } from '../utils/rateLimiter'
import { UserAgentRotator } from '../utils/userAgents'
import { ProxyManager } from '../utils/proxies'
import logger from '../monitoring/logger'

export interface ScrapingConfig {
  baseUrl: string
  selectors: {
    productContainer: string
    name: string
    price: string
    brand?: string
    image?: string
    nextPage?: string
  }
  pagination?: {
    type: 'button' | 'url' | 'infinite-scroll'
    selector?: string
    maxPages: number
  }
  rateLimit: {
    requests: number
    period: number // en minutos
  }
  useProxy: boolean
  useHeadless: boolean
}

export interface ScrapedProduct {
  name: string
  brand: string
  price: number
  originalPrice?: number
  discount?: number
  imageUrl?: string
  productUrl: string
  inStock: boolean
  category?: string
  subcategory?: string
}

export abstract class BaseScraper {
  protected browser: Browser | null = null
  protected config: ScrapingConfig
  protected rateLimiter: RateLimiter
  protected userAgentRotator: UserAgentRotator
  protected proxyManager: ProxyManager

  constructor(config: ScrapingConfig) {
    this.config = config
    this.rateLimiter = new RateLimiter(config.rateLimit.requests, config.rateLimit.period * 60 * 1000)
    this.userAgentRotator = new UserAgentRotator()
    this.proxyManager = new ProxyManager()
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: this.config.useHeadless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      })

      logger.info('Browser initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize browser:', error)
      throw error
    }
  }

  async scrape(): Promise<ScrapedProduct[]> {
    if (!this.browser) {
      await this.initialize()
    }

    const allProducts: ScrapedProduct[] = []
    let currentUrl = this.config.baseUrl
    let pageNum = 1

    try {
      while (currentUrl && pageNum <= (this.config.pagination?.maxPages || 1)) {
        logger.info(`Scraping page ${pageNum} for ${this.constructor.name}`)

        // Esperar rate limit
        await this.rateLimiter.waitForSlot()

        const products = await this.scrapePage(currentUrl)
        allProducts.push(...products)

        // Obtener siguiente página
        currentUrl = await this.getNextPageUrl(currentUrl, pageNum)
        pageNum++

        // Delay entre páginas para evitar detección
        await this.delay(2000 + Math.random() * 3000)
      }

      logger.info(`Scraping completed. Total products: ${allProducts.length}`)
      return allProducts

    } catch (error) {
      logger.error(`Scraping failed for ${this.constructor.name}:`, error)
      throw error
    }
  }

  protected async scrapePage(url: string): Promise<ScrapedProduct[]> {
    if (!this.browser) throw new Error('Browser not initialized')

    const page = await this.browser.newPage()

    try {
      // Configurar página
      await page.setUserAgent(this.userAgentRotator.getRandomUserAgent())
      await page.setViewport({ width: 1366, height: 768 })

      // Usar proxy si está habilitado
      if (this.config.useProxy) {
        const proxy = this.proxyManager.getRandomProxy()
        if (proxy) {
          await page.authenticate({ username: proxy.username, password: proxy.password })
        }
      }

      // Navegar a la página
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Esperar a que cargue el contenido dinámico
      await this.waitForContent(page)

      // Verificar si hay CAPTCHA
      const hasCaptcha = await this.detectCaptcha(page)
      if (hasCaptcha) {
        logger.warn('CAPTCHA detected, attempting to solve...')
        await this.handleCaptcha(page)
      }

      // Obtener HTML
      const content = await page.content()
      const products = this.parseProducts(content, url)

      return products

    } catch (error) {
      logger.error(`Error scraping page ${url}:`, error)
      throw error
    } finally {
      await page.close()
    }
  }

  protected abstract parseProducts(html: string, baseUrl: string): ScrapedProduct[]

  protected abstract waitForContent(page: Page): Promise<void>

  protected async detectCaptcha(page: Page): Promise<boolean> {
    try {
      const captchaSelectors = [
        '[class*="captcha"]',
        '[id*="captcha"]',
        '.recaptcha',
        '#captcha',
        '[data-sitekey]'
      ]

      for (const selector of captchaSelectors) {
        const element = await page.$(selector)
        if (element) return true
      }

      return false
    } catch (error) {
      return false
    }
  }

  protected async handleCaptcha(page: Page): Promise<void> {
    // Implementar lógica de resolución de CAPTCHA
    // Esto podría incluir servicios externos como 2Captcha
    logger.info('CAPTCHA handling not implemented yet')
  }

  protected async getNextPageUrl(currentUrl: string, currentPage: number): Promise<string | null> {
    if (!this.config.pagination) return null

    switch (this.config.pagination.type) {
      case 'button':
        return this.getNextPageFromButton(currentUrl, currentPage)
      case 'url':
        return this.generateNextPageUrl(currentUrl, currentPage)
      case 'infinite-scroll':
        return this.handleInfiniteScroll(currentUrl, currentPage)
      default:
        return null
    }
  }

  protected async getNextPageFromButton(currentUrl: string, currentPage: number): Promise<string | null> {
    if (!this.browser || !this.config.pagination?.selector) return null

    const page = await this.browser.newPage()
    try {
      await page.goto(currentUrl, { waitUntil: 'networkidle2' })
      const nextButton = await page.$(this.config.pagination.selector)

      if (nextButton) {
        const nextUrl = await page.evaluate(btn => (btn as HTMLAnchorElement).href, nextButton)
        return nextUrl
      }

      return null
    } finally {
      await page.close()
    }
  }

  protected generateNextPageUrl(currentUrl: string, currentPage: number): string {
    // Implementar lógica para generar URLs de paginación
    // Ejemplo: /productos?page=2
    const url = new URL(currentUrl)
    url.searchParams.set('page', (currentPage + 1).toString())
    return url.toString()
  }

  protected async handleInfiniteScroll(currentUrl: string, currentPage: number): Promise<string | null> {
    // Implementar scroll infinito
    return null
  }

  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}
```

### Scraper Específico para Carrefour

```typescript
// scraping/scrapers/carrefour.ts
import { BaseScraper, ScrapedProduct } from '../core/scraper'
import cheerio from 'cheerio'

export class CarrefourScraper extends BaseScraper {
  constructor() {
    super({
      baseUrl: 'https://www.carrefour.com.ar/catalogsearch/result/?q=',
      selectors: {
        productContainer: '.product-item',
        name: '.product-item-name',
        price: '.price',
        brand: '.product-brand',
        image: '.product-image img',
        nextPage: '.next-page'
      },
      pagination: {
        type: 'button',
        selector: '.next-page a',
        maxPages: 10
      },
      rateLimit: {
        requests: 5,
        period: 1
      },
      useProxy: true,
      useHeadless: true
    })
  }

  protected parseProducts(html: string, baseUrl: string): ScrapedProduct[] {
    const $ = cheerio.load(html)
    const products: ScrapedProduct[] = []

    $(this.config.selectors.productContainer).each((index, element) => {
      const $element = $(element)

      try {
        const name = this.cleanText($element.find(this.config.selectors.name).text())
        const priceText = $element.find(this.config.selectors.price).text()
        const price = this.parsePrice(priceText)

        if (name && price > 0) {
          const product: ScrapedProduct = {
            name,
            brand: this.cleanText($element.find(this.config.selectors.brand || '').text()) || 'Sin marca',
            price,
            imageUrl: this.getImageUrl($element, baseUrl),
            productUrl: this.getProductUrl($element, baseUrl),
            inStock: this.isInStock($element),
            category: this.extractCategoryFromUrl(baseUrl),
            subcategory: this.extractSubcategoryFromUrl(baseUrl)
          }

          // Verificar si hay descuento
          const originalPrice = this.parseOriginalPrice($element)
          if (originalPrice && originalPrice > price) {
            product.originalPrice = originalPrice
            product.discount = Math.round(((originalPrice - price) / originalPrice) * 100)
          }

          products.push(product)
        }
      } catch (error) {
        logger.warn(`Error parsing product: ${error.message}`)
      }
    })

    return products
  }

  protected async waitForContent(page: any): Promise<void> {
    await page.waitForSelector(this.config.selectors.productContainer, { timeout: 10000 })
  }

  private cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim()
  }

  private parsePrice(priceText: string): number {
    // Manejar diferentes formatos de precio
    const cleanPrice = priceText
      .replace(/[$\s]/g, '')
      .replace(/\./g, '') // Remover puntos de miles
      .replace(',', '.') // Convertir coma decimal
      .replace(/[^\d.]/g, '')

    const price = parseFloat(cleanPrice)
    return isNaN(price) ? 0 : price
  }

  private parseOriginalPrice($element: cheerio.Cheerio): number | null {
    const originalPriceText = $element.find('.old-price, .regular-price').text()
    return originalPriceText ? this.parsePrice(originalPriceText) : null
  }

  private getImageUrl($element: cheerio.Cheerio, baseUrl: string): string | undefined {
    const img = $element.find(this.config.selectors.image || '')
    if (img.length) {
      const src = img.attr('src') || img.attr('data-src')
      if (src) {
        return src.startsWith('http') ? src : new URL(src, baseUrl).toString()
      }
    }
    return undefined
  }

  private getProductUrl($element: cheerio.Cheerio, baseUrl: string): string {
    const link = $element.find('a').attr('href')
    return link ? (link.startsWith('http') ? link : new URL(link, baseUrl).toString()) : baseUrl
  }

  private isInStock($element: cheerio.Cheerio): boolean {
    // Verificar si el producto está disponible
    const outOfStock = $element.find('.out-of-stock, .unavailable').length > 0
    const noPrice = !$element.find(this.config.selectors.price).text().trim()
    return !outOfStock && !noPrice
  }

  private extractCategoryFromUrl(url: string): string | undefined {
    // Extraer categoría de la URL
    const match = url.match(/category\/([^\/]+)/)
    return match ? decodeURIComponent(match[1]) : undefined
  }

  private extractSubcategoryFromUrl(url: string): string | undefined {
    // Extraer subcategoría de la URL
    const match = url.match(/subcategory\/([^\/]+)/)
    return match ? decodeURIComponent(match[1]) : undefined
  }
}

export default CarrefourScraper
```

### Programador de Scraping

```typescript
// scraping/core/scheduler.ts
import cron from 'node-cron'
import { CarrefourScraper } from '../scrapers/carrefour'
import { DiscoScraper } from '../scrapers/disco'
import { JumboScraper } from '../scrapers/jumbo'
import { DiaScraper } from '../scrapers/dia'
import { VeaScraper } from '../scrapers/vea'
import { DataProcessor } from '../processors/dataProcessor'
import logger from '../monitoring/logger'

interface ScrapingJob {
  id: string
  supermarket: string
  scraper: any
  schedule: string
  isActive: boolean
  lastRun?: Date
  nextRun?: Date
}

export class ScrapingScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map()
  private dataProcessor: DataProcessor

  constructor() {
    this.dataProcessor = new DataProcessor()
    this.initializeJobs()
  }

  private initializeJobs(): void {
    const scrapingJobs: ScrapingJob[] = [
      {
        id: 'carrefour-daily',
        supermarket: 'Carrefour',
        scraper: new CarrefourScraper(),
        schedule: '0 9 * * *', // 9 AM daily
        isActive: true
      },
      {
        id: 'disco-daily',
        supermarket: 'Disco',
        scraper: new DiscoScraper(),
        schedule: '0 9 * * *',
        isActive: true
      },
      {
        id: 'jumbo-daily',
        supermarket: 'Jumbo',
        scraper: new JumboScraper(),
        schedule: '0 9 * * *',
        isActive: true
      },
      {
        id: 'dia-daily',
        supermarket: 'Día',
        scraper: new DiaScraper(),
        schedule: '0 9 * * *',
        isActive: true
      },
      {
        id: 'vea-daily',
        supermarket: 'Vea',
        scraper: new VeaScraper(),
        schedule: '0 9 * * *',
        isActive: true
      }
    ]

    scrapingJobs.forEach(job => {
      if (job.isActive) {
        this.scheduleJob(job)
      }
    })
  }

  private scheduleJob(job: ScrapingJob): void {
    const task = cron.schedule(job.schedule, async () => {
      await this.runScrapingJob(job)
    }, {
      scheduled: false // No iniciar automáticamente
    })

    this.jobs.set(job.id, task)
    logger.info(`Scheduled job ${job.id} with cron: ${job.schedule}`)
  }

  private async runScrapingJob(job: ScrapingJob): Promise<void> {
    const startTime = Date.now()
    logger.info(`Starting scraping job: ${job.id}`)

    try {
      // Ejecutar scraping
      const products = await job.scraper.scrape()

      // Procesar datos
      const processedData = await this.dataProcessor.process(products, job.supermarket)

      // Guardar en base de datos
      await this.dataProcessor.saveToDatabase(processedData)

      const duration = Date.now() - startTime
      logger.info(`Scraping job ${job.id} completed successfully. Products: ${products.length}, Duration: ${duration}ms`)

      // Actualizar métricas
      await this.updateJobMetrics(job.id, true, products.length, duration)

    } catch (error) {
      logger.error(`Scraping job ${job.id} failed:`, error)

      // Actualizar métricas de error
      await this.updateJobMetrics(job.id, false, 0, Date.now() - startTime)

      // Enviar alerta
      await this.sendAlert(job, error)
    }
  }

  private async updateJobMetrics(jobId: string, success: boolean, productsCount: number, duration: number): Promise<void> {
    // Actualizar métricas en base de datos o Redis
    // Implementar según necesidades de monitoreo
  }

  private async sendAlert(job: ScrapingJob, error: any): Promise<void> {
    // Enviar alerta por email, Slack, etc.
    logger.error(`Alert sent for job ${job.id}: ${error.message}`)
  }

  // Métodos públicos para control manual
  async startJob(jobId: string): Promise<void> {
    const task = this.jobs.get(jobId)
    if (task) {
      task.start()
      logger.info(`Started job: ${jobId}`)
    } else {
      throw new Error(`Job ${jobId} not found`)
    }
  }

  async stopJob(jobId: string): Promise<void> {
    const task = this.jobs.get(jobId)
    if (task) {
      task.stop()
      logger.info(`Stopped job: ${jobId}`)
    } else {
      throw new Error(`Job ${jobId} not found`)
    }
  }

  async runJobNow(jobId: string): Promise<void> {
    const job = this.getJobById(jobId)
    if (job) {
      await this.runScrapingJob(job)
    } else {
      throw new Error(`Job ${jobId} not found`)
    }
  }

  private getJobById(jobId: string): ScrapingJob | undefined {
    // Buscar job por ID (implementar según estructura de datos)
    return undefined
  }

  getJobStatus(jobId: string): any {
    const task = this.jobs.get(jobId)
    return {
      id: jobId,
      isRunning: task ? task.running : false,
      // Agregar más información de estado
    }
  }

  getAllJobsStatus(): any[] {
    const jobs: any[] = []
    this.jobs.forEach((task, jobId) => {
      jobs.push(this.getJobStatus(jobId))
    })
    return jobs
  }

  async cleanup(): Promise<void> {
    // Detener todos los jobs
    this.jobs.forEach(task => task.stop())
    this.jobs.clear()

    logger.info('Scraping scheduler cleaned up')
  }
}

export default ScrapingScheduler
```

## 📋 Convenciones y Patrones

### Nomenclatura

- *Scrapers*: PascalCase con sufijo Scraper (CarrefourScraper, DiscoScraper)
- *Métodos*: camelCase (scrapePage, parseProducts, handleCaptcha)
- *Selectores*: Objetos con propiedades descriptivas
- *Configuraciones*: Objetos con estructura clara y documentada

### Manejo de Errores

```typescript
// Patrón consistente de manejo de errores
try {
  const products = await scraper.scrape()
  await processor.process(products)
} catch (error) {
  logger.error('Scraping failed:', error)

  // Reintentar según tipo de error
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    await delay(60000) // Esperar 1 minuto
    return retry()
  }

  if (error.code === 'CAPTCHA_DETECTED') {
    await captchaSolver.solve()
    return retry()
  }

  // Notificar error crítico
  await alertSystem.notify(error)
}
```

### Rate Limiting

```typescript
// Implementación de rate limiter
export class RateLimiter {
  private requests: number[] = []

  constructor(private maxRequests: number, private windowMs: number) {}

  async waitForSlot(): Promise<void> {
    const now = Date.now()

    // Limpiar requests antiguos
    this.requests = this.requests.filter(time => now - time < this.windowMs)

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.windowMs - (now - oldestRequest)

      logger.info(`Rate limit reached, waiting ${waitTime}ms`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    this.requests.push(now)
  }
}
```

## 🔧 Configuración

### Variables de Entorno

```env
# Scraping Configuration
SCRAPING_HEADLESS=true
SCRAPING_MAX_CONCURRENT=3
SCRAPING_DELAY_BETWEEN_REQUESTS=2000
SCRAPING_TIMEOUT=30000

# Rate Limiting
RATE_LIMIT_REQUESTS=5
RATE_LIMIT_WINDOW_MINUTES=1

# Proxies
USE_PROXIES=true
PROXY_LIST_URL=https://api.proxies.com/list
PROXY_ROTATION_INTERVAL=300000

# CAPTCHA
CAPTCHA_SOLVER_API_KEY=your-2captcha-key
CAPTCHA_SOLVER_ENABLED=true

# User Agents
USER_AGENT_ROTATION_ENABLED=true
USER_AGENT_UPDATE_INTERVAL=86400000

# Monitoring
SCRAPING_METRICS_ENABLED=true
SCRAPING_ALERTS_ENABLED=true
SCRAPING_LOG_LEVEL=info

# Storage
REDIS_SCRAPING_CACHE_ENABLED=true
SCRAPING_DATA_RETENTION_DAYS=30
```

### Configuración por Supermercado

```typescript
// scraping/config/supermarkets.ts
export const supermarketConfigs = {
  carrefour: {
    baseUrl: 'https://www.carrefour.com.ar',
    selectors: {
      productContainer: '.product-item',
      name: '.product-item-name',
      price: '.price',
      brand: '.product-brand',
      image: '.product-image img',
      nextPage: '.next-page a'
    },
    rateLimit: { requests: 5, period: 1 },
    categories: [
      'bebidas',
      'almacen',
      'limpieza',
      'frescos',
      'congelados'
    ]
  },
  disco: {
    baseUrl: 'https://www.disco.com.ar',
    selectors: {
      productContainer: '.product-card',
      name: '.product-name',
      price: '.product-price',
      brand: '.product-brand',
      image: '.product-image img',
      nextPage: '.pagination-next'
    },
    rateLimit: { requests: 3, period: 1 },
    categories: [
      'bebidas',
      'almacen',
      'limpieza',
      'frescos'
    ]
  }
  // ... otros supermercados
}
```

## 🧪 Testing

### Estructura de Tests

```
scraping/tests/
├── unit/
│   ├── scrapers/
│   │   ├── carrefour.test.ts
│   │   ├── disco.test.ts
│   │   └── base.test.ts
│   ├── utils/
│   │   ├── rateLimiter.test.ts
│   │   └── userAgents.test.ts
│   └── processors/
│       └── dataProcessor.test.ts
├── integration/
│   ├── scraping-flow.test.ts
│   ├── database-integration.test.ts
│   └── api-integration.test.ts
└── mocks/
    ├── html-responses/
    │   ├── carrefour-product-list.html
    │   └── disco-product-list.html
    ├── api-responses/
    │   └── proxy-list.json
    └── browser-mocks/
        └── puppeteer-mock.ts
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test:scraping:unit

# Tests de integración
npm run test:scraping:integration

# Tests con mocks
npm run test:scraping:mock

# Tests de performance
npm run test:scraping:performance

# Tests de un scraper específico
npm run test:scraping -- --grep "Carrefour"
```

## 📝 Notas Importantes

- *Legalidad*: Cumplir con términos de servicio de cada supermercado
- *Rate Limiting*: Respetar límites para evitar bloqueos
- *User Agents*: Rotar user agents para evitar detección
- *Proxies*: Usar proxies residenciales para mejor anonimato
- *CAPTCHAs*: Implementar resolución automática cuando sea necesario
- *Monitoreo*: Alertas automáticas para fallos de scraping
- *Backup*: Mantener respaldo de datos críticos scrapeados
- *Actualización*: Monitorear cambios en estructura de sitios web

## 🔗 Referencias y Documentación

- [Puppeteer Documentation](https://pptr.dev/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [Web Scraping Best Practices](https://blog.apify.com/web-scraping-best-practices/)
- [Legal Web Scraping Guide](https://www.scrapinghub.com/legal-web-scraping-guide)

## 🚧 Roadmap y TODOs

### Próximas Mejoras

- [ ] Implementar machine learning para detección automática de cambios en sitios
- [ ] Agregar soporte para scraping de imágenes de productos
- [ ] Implementar sistema de proxies inteligente con geolocalización
- [ ] Desarrollar dashboard de monitoreo en tiempo real
- [ ] Agregar soporte para scraping de ofertas flash
- [ ] Implementar sistema de notificaciones para cambios de precio
- [ ] Optimizar performance con procesamiento paralelo
- [ ] Agregar soporte para scraping de datos históricos

### Problemas Conocidos

- [ ] Detección de cambios en selectores CSS - Prioridad: Alta
- [ ] Manejo de CAPTCHAs avanzados - Prioridad: Media
- [ ] Rate limiting agresivo en algunos sitios - Prioridad: Alta
- [ ] Procesamiento de imágenes de productos - Prioridad: Baja
