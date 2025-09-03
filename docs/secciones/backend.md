# Backend - API y Lógica de Negocio de Caminando Online

[El Backend es el corazón de la plataforma Caminando Online, responsable de manejar la lógica de negocio, las APIs REST, la autenticación de usuarios, el procesamiento de datos de scraping y la comunicación con la base de datos MongoDB. Proporciona una arquitectura escalable y segura para soportar todas las funcionalidades de la plataforma.]

## 📁 Estructura

```
backend/
├── src/
│   ├── config/               # Configuraciones
│   │   ├── database.ts       # Conexión MongoDB
│   │   ├── environment.ts    # Variables de entorno
│   │   ├── cors.ts          # Configuración CORS
│   │   └── redis.ts         # Configuración Redis (cache)
│   ├── controllers/          # Controladores de rutas
│   │   ├── authController.ts # Autenticación
│   │   ├── productController.ts # Productos
│   │   ├── userController.ts # Usuarios
│   │   ├── scrapingController.ts # Scraping
│   │   └── comparisonController.ts # Comparaciones
│   ├── models/               # Modelos de datos MongoDB
│   │   ├── User.ts          # Modelo de usuario
│   │   ├── Product.ts       # Modelo de producto
│   │   ├── Supermarket.ts   # Modelo de supermercado
│   │   ├── Comparison.ts    # Modelo de comparación
│   │   └── ScrapingLog.ts   # Log de scraping
│   ├── routes/               # Definición de rutas
│   │   ├── auth.ts          # Rutas de autenticación
│   │   ├── products.ts      # Rutas de productos
│   │   ├── users.ts         # Rutas de usuarios
│   │   ├── scraping.ts      # Rutas de scraping
│   │   └── index.ts         # Rutas principales
│   ├── middleware/           # Middlewares personalizados
│   │   ├── auth.ts          # Autenticación JWT
│   │   ├── validation.ts    # Validación de datos
│   │   ├── rateLimit.ts     # Límite de tasa
│   │   ├── cors.ts          # CORS
│   │   └── errorHandler.ts  # Manejo de errores
│   ├── services/             # Lógica de negocio
│   │   ├── authService.ts   # Servicio de autenticación
│   │   ├── productService.ts # Servicio de productos
│   │   ├── scrapingService.ts # Servicio de scraping
│   │   ├── comparisonService.ts # Servicio de comparaciones
│   │   └── emailService.ts  # Servicio de emails
│   ├── utils/                # Utilidades
│   │   ├── logger.ts        # Sistema de logging
│   │   ├── encryption.ts    # Encriptación
│   │   ├── scraper.ts       # Utilidades de scraping
│   │   └── validators.ts    # Validadores
│   ├── jobs/                 # Tareas programadas
│   │   ├── scrapingJob.ts   # Job diario de scraping
│   │   ├── cleanupJob.ts    # Limpieza de datos
│   │   └── emailJob.ts      # Envío de emails
│   ├── types/                # Definiciones TypeScript
│   │   ├── index.ts         # Tipos principales
│   │   ├── api.ts           # Tipos de API
│   │   └── database.ts      # Tipos de base de datos
│   ├── app.ts                # Configuración Express
│   └── server.ts             # Punto de entrada del servidor
├── tests/                    # Tests
│   ├── unit/                # Tests unitarios
│   ├── integration/         # Tests de integración
│   └── e2e/                 # Tests end-to-end
├── scripts/                  # Scripts de utilidad
│   ├── seed.ts              # Poblar base de datos
│   ├── migrate.ts           # Migraciones
│   └── backup.ts            # Backup de datos
├── logs/                     # Archivos de log
├── package.json              # Dependencias
├── tsconfig.json             # Configuración TypeScript
├── nodemon.json              # Configuración Nodemon
├── .env.example              # Ejemplo de variables de entorno
└── README.md                 # Documentación del backend
```

## 🎯 Funcionalidades Principales

- *API RESTful*: Endpoints para productos, usuarios, comparaciones y scraping
- *Autenticación JWT*: Sistema seguro de login y registro con tokens
- *Gestión de Productos*: CRUD completo de productos con filtros avanzados
- *Sistema de Scraping*: Automatización de recolección de datos de supermercados
- *Comparaciones Inteligentes*: Lógica para encontrar mejores precios y calcular ahorros
- *Dashboard de Usuario*: APIs para estadísticas y análisis personalizados
- *Sistema de Caché*: Redis para optimizar performance de consultas frecuentes
- *Logging y Monitoreo*: Seguimiento completo de operaciones y errores

## 🛠 Tecnologías Utilizadas

- *Node.js*: Runtime de JavaScript del lado del servidor
- *Express.js*: Framework web minimalista y flexible
- *MongoDB*: Base de datos NoSQL para almacenamiento de datos
- *Mongoose*: ODM para MongoDB con validaciones y esquemas
- *TypeScript*: Tipado estático para mayor robustez y mantenibilidad
- *JWT*: Autenticación basada en tokens JSON Web Tokens
- *Bcrypt*: Hashing seguro de contraseñas
- *Redis*: Sistema de caché en memoria para optimizar performance
- *Puppeteer*: Automatización de navegadores para web scraping
- *Cheerio*: Parsing rápido de HTML para scraping
- *Nodemailer*: Envío de emails transaccionales
- *Winston*: Sistema avanzado de logging
- *Joi*: Validación de datos de entrada
- *Helmet*: Seguridad de headers HTTP
- *Rate Limiting*: Control de tasa de solicitudes
- *CORS*: Configuración de Cross-Origin Resource Sharing

## Uso y Ejemplos

### Configuración del Servidor Express

```typescript
// src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { errorHandler } from './middleware/errorHandler'
import { connectDB } from './config/database'
import routes from './routes'

const app = express()

// Conectar a MongoDB
connectDB()

// Middlewares de seguridad
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.'
})
app.use('/api/', limiter)

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan('combined'))

// Rutas
app.use('/api', routes)

// Middleware de manejo de errores
app.use(errorHandler)

export default app
```

### Modelo de Producto con Mongoose

```typescript
// src/models/Product.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  brand: string
  category: string
  subcategory: string
  productType: string
  supermarkets: {
    supermarketId: mongoose.Types.ObjectId
    price: number
    url: string
    lastUpdated: Date
    inStock: boolean
  }[]
  specifications: {
    size?: string
    weight?: string
    package?: string
    variety?: string
  }
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['bebidas', 'almacen', 'limpieza', 'frescos', 'congelados']
  },
  subcategory: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true
  },
  supermarkets: [{
    supermarketId: {
      type: Schema.Types.ObjectId,
      ref: 'Supermarket',
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    url: {
      type: String,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }],
  specifications: {
    size: String,
    weight: String,
    package: String,
    variety: String
  },
  imageUrl: String
}, {
  timestamps: true
})

// Índices para optimizar consultas
ProductSchema.index({ name: 'text', brand: 'text' })
ProductSchema.index({ category: 1, subcategory: 1 })
ProductSchema.index({ 'supermarkets.price': 1 })

// Método para obtener el mejor precio
ProductSchema.methods.getBestPrice = function(): { price: number, supermarket: string } | null {
  if (this.supermarkets.length === 0) return null

  const bestPrice = this.supermarkets
    .filter(s => s.inStock)
    .sort((a, b) => a.price - b.price)[0]

  return bestPrice ? {
    price: bestPrice.price,
    supermarket: bestPrice.supermarketId.toString()
  } : null
}

export default mongoose.model<IProduct>('Product', ProductSchema)
```

### Controlador de Productos

```typescript
// src/controllers/productController.ts
import { Request, Response, NextFunction } from 'express'
import Product from '../models/Product'
import { validationResult } from 'express-validator'

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      productType,
      supermarkets,
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query

    // Construir query
    const query: any = {}

    if (category) query.category = category
    if (subcategory) query.subcategory = subcategory
    if (productType) query.productType = productType

    if (supermarkets) {
      const supermarketIds = Array.isArray(supermarkets) ? supermarkets : [supermarkets]
      query['supermarkets.supermarketId'] = { $in: supermarketIds }
    }

    if (search) {
      query.$text = { $search: search }
    }

    // Ejecutar consulta con paginación
    const products = await Product.find(query)
      .populate('supermarkets.supermarketId', 'name logo')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id)
      .populate('supermarkets.supermarketId', 'name logo')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    res.json({
      success: true,
      data: product
    })

  } catch (error) {
    next(error)
  }
}

export const compareProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productIds, supermarkets } = req.body

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren IDs de productos'
      })
    }

    const products = await Product.find({
      _id: { $in: productIds }
    }).populate('supermarkets.supermarketId', 'name logo')

    // Lógica de comparación
    const comparison = products.map(product => {
      const availablePrices = product.supermarkets
        .filter(s => supermarkets.includes(s.supermarketId.toString()) && s.inStock)
        .sort((a, b) => a.price - b.price)

      return {
        product: product.name,
        brand: product.brand,
        bestPrice: availablePrices[0]?.price || null,
        bestSupermarket: availablePrices[0]?.supermarketId?.name || null,
        allPrices: availablePrices.map(s => ({
          supermarket: s.supermarketId.name,
          price: s.price,
          url: s.url
        }))
      }
    })

    // Calcular totales
    const totals = supermarkets.map(supermarketId => {
      const supermarket = products[0]?.supermarkets.find(s => s.supermarketId.toString() === supermarketId)
      const total = comparison.reduce((sum, item) => {
        const price = item.allPrices.find(p => p.supermarket === supermarket?.supermarketId?.name)?.price || 0
        return sum + price
      }, 0)

      return {
        supermarket: supermarket?.supermarketId?.name || 'Desconocido',
        total
      }
    })

    res.json({
      success: true,
      data: {
        products: comparison,
        totals,
        savings: calculateSavings(totals)
      }
    })

  } catch (error) {
    next(error)
  }
}

function calculateSavings(totals: any[]): { amount: number, percentage: number } {
  if (totals.length === 0) return { amount: 0, percentage: 0 }

  const sortedTotals = totals.sort((a, b) => a.total - b.total)
  const bestTotal = sortedTotals[0].total
  const averageTotal = totals.reduce((sum, t) => sum + t.total, 0) / totals.length
  const savings = averageTotal - bestTotal
  const percentage = averageTotal > 0 ? (savings / averageTotal) * 100 : 0

  return {
    amount: Math.round(savings * 100) / 100,
    percentage: Math.round(percentage * 100) / 100
  }
}
```

### Servicio de Scraping

```typescript
// src/services/scrapingService.ts
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import Product from '../models/Product'
import logger from '../utils/logger'

interface ScrapingConfig {
  supermarketId: string
  baseUrl: string
  selectors: {
    productContainer: string
    name: string
    price: string
    brand?: string
    image?: string
  }
  pagination?: {
    nextButton: string
    maxPages: number
  }
}

export class ScrapingService {
  private browser: any = null

  async initializeBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    })
  }

  async scrapeSupermarket(config: ScrapingConfig): Promise<void> {
    try {
      if (!this.browser) {
        await this.initializeBrowser()
      }

      const page = await this.browser.newPage()

      // Configurar user agent para evitar detección
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

      let currentUrl = config.baseUrl
      let pageNum = 1
      const maxPages = config.pagination?.maxPages || 5

      while (currentUrl && pageNum <= maxPages) {
        logger.info(`Scraping page ${pageNum} for ${config.supermarketId}`)

        await page.goto(currentUrl, { waitUntil: 'networkidle2' })

        const content = await page.content()
        const products = await this.parseProducts(content, config)

        await this.saveProducts(products, config.supermarketId)

        // Buscar siguiente página
        if (config.pagination) {
          const nextButton = await page.$(config.pagination.nextButton)
          if (nextButton) {
            currentUrl = await page.evaluate((btn: any) => btn.href, nextButton)
            pageNum++
          } else {
            currentUrl = null
          }
        } else {
          currentUrl = null
        }

        // Delay para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      await page.close()

    } catch (error) {
      logger.error(`Error scraping ${config.supermarketId}:`, error)
      throw error
    }
  }

  private async parseProducts(html: string, config: ScrapingConfig): Promise<any[]> {
    const $ = cheerio.load(html)
    const products: any[] = []

    $(config.selectors.productContainer).each((index, element) => {
      const $element = $(element)

      const name = $element.find(config.selectors.name).text().trim()
      const priceText = $element.find(config.selectors.price).text().trim()
      const price = this.parsePrice(priceText)

      if (name && price > 0) {
        products.push({
          name,
          price,
          brand: config.selectors.brand ? $element.find(config.selectors.brand).text().trim() : null,
          imageUrl: config.selectors.image ? $element.find(config.selectors.image).attr('src') : null,
          url: $element.find('a').attr('href')
        })
      }
    })

    return products
  }

  private parsePrice(priceText: string): number {
    // Remover símbolos de moneda y convertir a número
    const cleanPrice = priceText
      .replace(/[$\s]/g, '')
      .replace(',', '.')
      .replace(/[^\d.]/g, '')

    return parseFloat(cleanPrice) || 0
  }

  private async saveProducts(products: any[], supermarketId: string): Promise<void> {
    for (const productData of products) {
      try {
        // Buscar producto existente por nombre y marca
        let product = await Product.findOne({
          name: productData.name,
          brand: productData.brand || 'Sin marca'
        })

        if (product) {
          // Actualizar precio para este supermercado
          const supermarketIndex = product.supermarkets.findIndex(
            s => s.supermarketId.toString() === supermarketId
          )

          if (supermarketIndex >= 0) {
            product.supermarkets[supermarketIndex] = {
              ...product.supermarkets[supermarketIndex],
              price: productData.price,
              url: productData.url,
              lastUpdated: new Date(),
              inStock: true
            }
          } else {
            product.supermarkets.push({
              supermarketId,
              price: productData.price,
              url: productData.url,
              lastUpdated: new Date(),
              inStock: true
            })
          }

          await product.save()
        } else {
          // Crear nuevo producto
          const newProduct = new Product({
            name: productData.name,
            brand: productData.brand || 'Sin marca',
            category: 'pending', // Categorizar después
            subcategory: 'pending',
            productType: 'pending',
            supermarkets: [{
              supermarketId,
              price: productData.price,
              url: productData.url,
              lastUpdated: new Date(),
              inStock: true
            }],
            imageUrl: productData.imageUrl
          })

          await newProduct.save()
        }

      } catch (error) {
        logger.error(`Error saving product ${productData.name}:`, error)
      }
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

export default new ScrapingService()
```

## 📋 Convenciones y Patrones

### Nomenclatura

- *Archivos*: camelCase para servicios y utilidades (productService.ts, authController.ts)
- *Variables*: camelCase para variables y funciones (userData, validatePassword)
- *Clases*: PascalCase para clases y constructores (UserService, ProductController)
- *Interfaces*: PascalCase con prefijo I (IUser, IProduct, IApiResponse)
- *Tipos*: PascalCase para tipos complejos (UserRole, ProductStatus)

### Estructura de Archivos

- *Controller*: Maneja requests/responses, validación básica, llamadas a servicios
- *Service*: Contiene lógica de negocio, llamadas a base de datos, integraciones externas
- *Model*: Define esquemas de datos, métodos de instancia, middlewares
- *Route*: Define endpoints, middlewares específicos de ruta, documentación
- *Middleware*: Funciones reutilizables que procesan requests
- *Utils*: Funciones helper puras, constantes, configuraciones

### Manejo de Errores

```typescript
// Patrón consistente de manejo de errores
try {
  // Lógica de negocio
  const result = await someOperation()
  res.json({ success: true, data: result })
} catch (error) {
  logger.error('Operation failed:', error)
  next(error) // Pasar al middleware de errores
}

// Middleware de errores global
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500
  let message = 'Internal Server Error'

  if (error.name === 'ValidationError') {
    statusCode = 400
    message = 'Datos de entrada inválidos'
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401
    message = 'No autorizado'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
}
```

## 🔧 Configuración

### Variables de Entorno

```env
# .env
NODE_ENV=development
PORT=3001

# Base de datos
MONGODB_URI=mongodb://localhost:27017/caminando-online
REDIS_URL=redis://localhost:6379

# Autenticación
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Scraping
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
SCRAPING_DELAY=2000
MAX_CONCURRENT_SCRAPERS=3

# APIs externas
GOOGLE_MAPS_API_KEY=your-google-maps-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Dependencias Principales

```json
{
  "name": "caminando-online-backend",
  "version": "1.0.0",
  "main": "src/server.ts",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "seed": "ts-node scripts/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "puppeteer": "^21.6.1",
    "cheerio": "^1.0.0-rc.12",
    "nodemailer": "^6.9.7",
    "winston": "^3.11.0",
    "redis": "^4.6.11",
    "joi": "^17.11.0",
    "dotenv": "^16.3.1",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "@types/nodemailer": "^6.4.14",
    "@types/compression": "^1.7.5",
    "typescript": "^5.3.3",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  }
}
```

## 🧪 Testing

### Estructura de Tests

```
tests/
├── unit/
│   ├── controllers/
│   │   ├── productController.test.ts
│   │   └── authController.test.ts
│   ├── services/
│   │   ├── productService.test.ts
│   │   └── scrapingService.test.ts
│   └── utils/
│       ├── validators.test.ts
│       └── formatters.test.ts
├── integration/
│   ├── auth.test.ts
│   ├── products.test.ts
│   └── scraping.test.ts
└── e2e/
    ├── user-journey.test.ts
    └── api-endpoints.test.ts
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests end-to-end
npm run test:e2e

# Todos los tests
npm test

# Con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📝 Notas Importantes

- *Seguridad*: Usar HTTPS en producción, validar todas las entradas, sanitizar datos
- *Performance*: Implementar caché Redis, optimizar consultas MongoDB, usar índices
- *Escalabilidad*: Arquitectura stateless, posibilidad de microservicios futuros
- *Monitoreo*: Logs detallados, métricas de performance, alertas automáticas
- *Backup*: Estrategia de backup automático de base de datos
- *Rate Limiting*: Protección contra ataques DoS y abuso de API
- *Validación*: Validar todos los inputs con Joi y express-validator

## 🔗 Referencias y Documentación

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Puppeteer Documentation](https://pptr.dev/)
- [JWT.io](https://jwt.io/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

## 🚧 Roadmap y TODOs

### Próximas Mejoras

- [ ] Implementar GraphQL para queries más eficientes
- [ ] Agregar sistema de caché distribuido con Redis Cluster
- [ ] Implementar WebSockets para actualizaciones en tiempo real
- [ ] Agregar sistema de notificaciones push
- [ ] Optimizar scraping con proxies rotativos
- [ ] Implementar API versioning
- [ ] Agregar sistema de analytics avanzado

### Problemas Conocidos

- [ ] Optimización de consultas MongoDB complejas - Prioridad: Alta
- [ ] Manejo de rate limiting en scraping - Prioridad: Alta
- [ ] Sistema de backup automático - Prioridad: Media
- [ ] Testing de integración completo - Prioridad: Media
