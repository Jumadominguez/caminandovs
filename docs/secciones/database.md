# Database - Sistema de Base de Datos de Caminando Online

[La base de datos es el componente central para el almacenamiento y gestión de todos los datos de la plataforma Caminando Online. Utiliza MongoDB como base de datos NoSQL principal, con Redis para caché y optimización de performance. Gestiona productos, usuarios, supermercados, comparaciones y logs de scraping de manera eficiente y escalable.]

## 📁 Estructura

```
database/
├── models/                 # Modelos de datos Mongoose
│   ├── User.ts            # Modelo de usuario
│   ├── Product.ts         # Modelo de producto
│   ├── Supermarket.ts     # Modelo de supermercado
│   ├── Comparison.ts      # Modelo de comparación
│   ├── Category.ts        # Modelo de categorías
│   ├── ScrapingLog.ts     # Log de scraping
│   ├── UserSession.ts     # Sesiones de usuario
│   └── index.ts           # Exportaciones de modelos
├── schemas/                # Esquemas de validación
│   ├── userSchema.ts      # Validaciones de usuario
│   ├── productSchema.ts   # Validaciones de producto
│   ├── comparisonSchema.ts # Validaciones de comparación
│   └── index.ts           # Exportaciones de esquemas
├── migrations/             # Migraciones de datos
│   ├── 001_initial_setup.ts
│   ├── 002_add_indexes.ts
│   ├── 003_seed_categories.ts
│   └── index.ts
├── seeds/                  # Datos iniciales
│   ├── supermarkets.ts    # Datos de supermercados
│   ├── categories.ts      # Datos de categorías
│   ├── users.ts           # Usuarios de prueba
│   └── index.ts
├── repositories/           # Patrón Repository
│   ├── UserRepository.ts  # Operaciones de usuario
│   ├── ProductRepository.ts # Operaciones de producto
│   ├── ComparisonRepository.ts # Operaciones de comparación
│   └── index.ts
├── connections/            # Conexiones de base de datos
│   ├── mongodb.ts         # Conexión MongoDB
│   ├── redis.ts           # Conexión Redis
│   └── index.ts
├── indexes/                # Definiciones de índices
│   ├── productIndexes.ts  # Índices de productos
│   ├── userIndexes.ts     # Índices de usuarios
│   └── index.ts
├── aggregations/           # Pipelines de agregación
│   ├── productAggregations.ts
│   ├── userAggregations.ts
│   ├── analyticsAggregations.ts
│   └── index.ts
├── backup/                 # Scripts de backup
│   ├── mongodb-backup.ts  # Backup de MongoDB
│   ├── redis-backup.ts    # Backup de Redis
│   └── restore.ts         # Restauración
├── monitoring/             # Monitoreo de base de datos
│   ├── health.ts          # Health checks
│   ├── metrics.ts         # Métricas de performance
│   └── alerts.ts          # Sistema de alertas
├── config/                 # Configuraciones
│   ├── database.config.ts # Configuración principal
│   ├── redis.config.ts    # Configuración Redis
│   └── index.ts
├── utils/                  # Utilidades de base de datos
│   ├── validators.ts      # Validadores personalizados
│   ├── transformers.ts    # Transformadores de datos
│   ├── formatters.ts      # Formateadores
│   └── index.ts
├── tests/                  # Tests de base de datos
│   ├── unit/              # Tests unitarios
│   ├── integration/       # Tests de integración
│   └── fixtures/          # Datos de prueba
├── scripts/                # Scripts de mantenimiento
│   ├── cleanup.ts         # Limpieza de datos antiguos
│   ├── optimize.ts        # Optimización de índices
│   ├── analyze.ts         # Análisis de performance
│   └── index.ts
├── docs/                   # Documentación de esquemas
│   ├── api.md             # Documentación de API
│   ├── schemas.md         # Documentación de esquemas
│   └── queries.md         # Consultas comunes
├── package.json            # Dependencias
└── README.md               # Documentación de la base de datos
```

## 🎯 Funcionalidades Principales

- *Modelado de Datos*: Esquemas robustos para productos, usuarios y supermercados
- *Sistema de Índices*: Optimización de consultas con índices compuestos y de texto
- *Caché Redis*: Aceleración de consultas frecuentes y sesiones de usuario
- *Aggregations Avanzadas*: Análisis complejo de datos con pipelines de MongoDB
- *Backup Automático*: Estrategias de respaldo y recuperación de datos
- *Monitoreo en Tiempo Real*: Health checks y métricas de performance
- *Migraciones de Datos*: Actualizaciones seguras del esquema de base de datos
- *Validación de Datos*: Reglas de negocio implementadas a nivel de base de datos

## 🛠 Tecnologías Utilizadas

- *MongoDB*: Base de datos NoSQL principal para datos flexibles y escalables
- *Mongoose*: ODM para MongoDB con esquemas, validaciones y middleware
- *Redis*: Sistema de caché en memoria para sesiones y datos frecuentes
- *MongoDB Atlas*: Servicio cloud para hosting y backup automático
- *Redis Cloud*: Servicio managed para Redis en producción
- *MongoDB Compass*: GUI para administración y consultas visuales
- *mongoose-paginate-v2*: Paginación automática de resultados
- *mongoose-aggregate-paginate-v2*: Paginación de agregaciones complejas

## Uso y Ejemplos

### Conexión a MongoDB

```typescript
// database/connections/mongodb.ts
import mongoose from 'mongoose'
import logger from '../../utils/logger'

interface MongoConfig {
  uri: string
  options: {
    maxPoolSize: number
    serverSelectionTimeoutMS: number
    socketTimeoutMS: number
    family: number
  }
}

class MongoConnection {
  private config: MongoConfig
  private isConnected: boolean = false

  constructor() {
    this.config = {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/caminando-online',
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      }
    }
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.config.uri, this.config.options)

      mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected successfully')
        this.isConnected = true
      })

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected')
        this.isConnected = false
      })

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect()
        process.exit(0)
      })

    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close()
      logger.info('MongoDB disconnected successfully')
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error)
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }

  async healthCheck(): Promise<boolean> {
    try {
      await mongoose.connection.db.admin().ping()
      return true
    } catch (error) {
      logger.error('MongoDB health check failed:', error)
      return false
    }
  }
}

export default new MongoConnection()
```

### Modelo de Usuario

```typescript
// database/models/User.ts
import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'user' | 'admin'
  isEmailVerified: boolean
  emailVerificationToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  linkedSupermarkets: {
    supermarketId: mongoose.Types.ObjectId
    username: string
    isActive: boolean
    lastSync: Date
  }[]
  preferences: {
    currency: string
    language: string
    notifications: boolean
  }
  profile: {
    avatar?: string
    phone?: string
    address?: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  stats: {
    totalComparisons: number
    totalSavings: number
    favoriteCategories: string[]
  }
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // No incluir en queries por defecto
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  linkedSupermarkets: [{
    supermarketId: {
      type: Schema.Types.ObjectId,
      ref: 'Supermarket',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastSync: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    currency: {
      type: String,
      default: 'ARS',
      enum: ['ARS', 'USD']
    },
    language: {
      type: String,
      default: 'es',
      enum: ['es', 'en']
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  profile: {
    avatar: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Argentina'
      }
    }
  },
  stats: {
    totalComparisons: {
      type: Number,
      default: 0
    },
    totalSavings: {
      type: Number,
      default: 0
    },
    favoriteCategories: [{
      type: String,
      enum: ['bebidas', 'almacen', 'limpieza', 'frescos', 'congelados']
    }]
  },
  lastLogin: Date
}, {
  timestamps: true
})

// Índices para optimizar consultas
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ 'linkedSupermarkets.supermarketId': 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ createdAt: -1 })

// Middleware para hash de contraseña
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Método para obtener perfil público
UserSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    preferences: this.preferences,
    profile: this.profile,
    stats: this.stats,
    createdAt: this.createdAt
  }
}

// Virtual para nombre completo
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

export default mongoose.model<IUser>('User', UserSchema)
```

### Modelo de Producto

```typescript
// database/models/Product.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  brand: string
  description?: string
  category: string
  subcategory: string
  productType: string
  barcode?: string
  imageUrl?: string
  specifications: {
    size?: string
    weight?: string
    package?: string
    variety?: string
    ingredients?: string[]
    nutritionalInfo?: object
  }
  supermarkets: {
    supermarketId: mongoose.Types.ObjectId
    price: number
    originalPrice?: number
    discount?: number
    url: string
    lastUpdated: Date
    inStock: boolean
    stockQuantity?: number
  }[]
  tags: string[]
  averageRating?: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
  getBestPrice(): { price: number, supermarket: string, discount?: number } | null
  getPriceHistory(supermarketId?: string): any[]
  isOnSale(): boolean
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    text: true // Para búsqueda de texto
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    text: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['bebidas', 'almacen', 'limpieza', 'frescos', 'congelados', 'cuidado-personal', 'electrodomesticos']
  },
  subcategory: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true
  },
  barcode: {
    type: String,
    sparse: true,
    unique: true
  },
  imageUrl: String,
  specifications: {
    size: String,
    weight: String,
    package: String,
    variety: String,
    ingredients: [String],
    nutritionalInfo: Schema.Types.Mixed
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
    originalPrice: Number,
    discount: {
      type: Number,
      min: 0,
      max: 100
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
    },
    stockQuantity: Number
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Índices para optimizar consultas
ProductSchema.index({ name: 'text', brand: 'text', description: 'text' })
ProductSchema.index({ category: 1, subcategory: 1, productType: 1 })
ProductSchema.index({ barcode: 1 }, { sparse: true })
ProductSchema.index({ 'supermarkets.price': 1 })
ProductSchema.index({ 'supermarkets.supermarketId': 1 })
ProductSchema.index({ tags: 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ averageRating: -1 })

// Método para obtener el mejor precio
ProductSchema.methods.getBestPrice = function(): { price: number, supermarket: string, discount?: number } | null {
  if (this.supermarkets.length === 0) return null

  const availablePrices = this.supermarkets
    .filter(s => s.inStock)
    .sort((a, b) => a.price - b.price)

  const bestPrice = availablePrices[0]
  return bestPrice ? {
    price: bestPrice.price,
    supermarket: bestPrice.supermarketId.toString(),
    discount: bestPrice.discount
  } : null
}

// Método para verificar si está en oferta
ProductSchema.methods.isOnSale = function(): boolean {
  return this.supermarkets.some(s => s.discount && s.discount > 0)
}

// Método para obtener historial de precios
ProductSchema.methods.getPriceHistory = function(supermarketId?: string): any[] {
  // Esta sería una consulta a una colección separada de historial de precios
  // Por simplicidad, retornamos los precios actuales
  return this.supermarkets
    .filter(s => !supermarketId || s.supermarketId.toString() === supermarketId)
    .map(s => ({
      supermarket: s.supermarketId,
      price: s.price,
      date: s.lastUpdated
    }))
}

// Virtual para precio promedio
ProductSchema.virtual('averagePrice').get(function() {
  if (this.supermarkets.length === 0) return 0
  const total = this.supermarkets.reduce((sum, s) => sum + s.price, 0)
  return total / this.supermarkets.length
})

// Middleware para actualizar tags automáticamente
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('brand') || this.isModified('category')) {
    this.tags = [
      ...this.name.toLowerCase().split(' '),
      ...this.brand.toLowerCase().split(' '),
      this.category.toLowerCase(),
      this.subcategory.toLowerCase()
    ].filter((tag, index, arr) => arr.indexOf(tag) === index) // Remover duplicados
  }
  next()
})

export default mongoose.model<IProduct>('Product', ProductSchema)
```

### Modelo de Supermercado

```typescript
// database/models/Supermarket.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface ISupermarket extends Document {
  name: string
  code: string // 'carrefour', 'disco', 'jumbo', 'dia', 'vea'
  logo: string
  website: string
  apiEndpoint?: string
  scrapingConfig: {
    baseUrl: string
    loginRequired: boolean
    selectors: {
      productContainer: string
      name: string
      price: string
      brand?: string
      image?: string
      pagination?: string
    }
    rateLimit: {
      requests: number
      period: number // en minutos
    }
  }
  isActive: boolean
  supportedRegions: string[]
  businessHours: {
    monday: { open: string, close: string }
    tuesday: { open: string, close: string }
    wednesday: { open: string, close: string }
    thursday: { open: string, close: string }
    friday: { open: string, close: string }
    saturday: { open: string, close: string }
    sunday: { open: string, close: string }
  }
  contactInfo: {
    phone?: string
    email?: string
    address?: string
  }
  stats: {
    totalProducts: number
    lastScraping: Date
    scrapingSuccess: boolean
    averagePrice: number
  }
  createdAt: Date
  updatedAt: Date
}

const SupermarketSchema = new Schema<ISupermarket>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    enum: ['carrefour', 'disco', 'jumbo', 'dia', 'vea']
  },
  logo: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  apiEndpoint: String,
  scrapingConfig: {
    baseUrl: {
      type: String,
      required: true
    },
    loginRequired: {
      type: Boolean,
      default: false
    },
    selectors: {
      productContainer: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      },
      brand: String,
      image: String,
      pagination: String
    },
    rateLimit: {
      requests: {
        type: Number,
        default: 10
      },
      period: {
        type: Number,
        default: 1
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  supportedRegions: [{
    type: String,
    enum: ['caba', 'gba', 'interior']
  }],
  businessHours: {
    monday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '22:00' }
    },
    tuesday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '22:00' }
    },
    wednesday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '22:00' }
    },
    thursday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '22:00' }
    },
    friday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '22:00' }
    },
    saturday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '22:00' }
    },
    sunday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '22:00' }
    }
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  stats: {
    totalProducts: {
      type: Number,
      default: 0
    },
    lastScraping: Date,
    scrapingSuccess: {
      type: Boolean,
      default: true
    },
    averagePrice: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Índices
SupermarketSchema.index({ code: 1 }, { unique: true })
SupermarketSchema.index({ isActive: 1 })
SupermarketSchema.index({ supportedRegions: 1 })

// Método para verificar si está abierto
SupermarketSchema.methods.isOpen = function(): boolean {
  const now = new Date()
  const dayOfWeek = now.toLocaleLowerCase('en-US', { weekday: 'long' })
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM

  const todayHours = this.businessHours[dayOfWeek as keyof typeof this.businessHours]
  if (!todayHours) return false

  return currentTime >= todayHours.open && currentTime <= todayHours.close
}

// Método para obtener configuración de scraping
SupermarketSchema.methods.getScrapingConfig = function() {
  return {
    ...this.scrapingConfig,
    supermarketId: this._id,
    supermarketCode: this.code
  }
}

export default mongoose.model<ISupermarket>('Supermarket', SupermarketSchema)
```

### Repositorio de Productos

```typescript
// database/repositories/ProductRepository.ts
import { Model } from 'mongoose'
import { IProduct } from '../models/Product'

interface ProductFilters {
  category?: string
  subcategory?: string
  productType?: string
  supermarkets?: string[]
  priceRange?: { min: number, max: number }
  brands?: string[]
  inStock?: boolean
  onSale?: boolean
  search?: string
}

interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export class ProductRepository {
  constructor(private productModel: Model<IProduct>) {}

  async findByFilters(filters: ProductFilters, pagination: PaginationOptions) {
    const query: any = {}

    // Filtros básicos
    if (filters.category) query.category = filters.category
    if (filters.subcategory) query.subcategory = filters.subcategory
    if (filters.productType) query.productType = filters.productType

    // Filtro por supermercados
    if (filters.supermarkets && filters.supermarkets.length > 0) {
      query['supermarkets.supermarketId'] = { $in: filters.supermarkets }
    }

    // Filtro por rango de precios
    if (filters.priceRange) {
      query['supermarkets.price'] = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max
      }
    }

    // Filtro por marcas
    if (filters.brands && filters.brands.length > 0) {
      query.brand = { $in: filters.brands }
    }

    // Filtro por stock
    if (filters.inStock !== undefined) {
      query['supermarkets.inStock'] = filters.inStock
    }

    // Filtro por ofertas
    if (filters.onSale) {
      query['supermarkets.discount'] = { $exists: true, $gt: 0 }
    }

    // Búsqueda de texto
    if (filters.search) {
      query.$text = { $search: filters.search }
    }

    const sortOption = {}
    sortOption[pagination.sortBy || 'createdAt'] = pagination.sortOrder === 'desc' ? -1 : 1

    const products = await this.productModel
      .find(query)
      .populate('supermarkets.supermarketId', 'name code logo')
      .sort(sortOption)
      .limit(pagination.limit)
      .skip((pagination.page - 1) * pagination.limit)
      .select('-__v')

    const total = await this.productModel.countDocuments(query)

    return {
      products,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    }
  }

  async findById(id: string): Promise<IProduct | null> {
    return this.productModel
      .findById(id)
      .populate('supermarkets.supermarketId', 'name code logo')
  }

  async findByBarcode(barcode: string): Promise<IProduct | null> {
    return this.productModel.findOne({ barcode })
  }

  async create(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new this.productModel(productData)
    return product.save()
  }

  async update(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    return this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('supermarkets.supermarketId', 'name code logo')
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id)
    return !!result
  }

  async getCategories(): Promise<string[]> {
    return this.productModel.distinct('category')
  }

  async getSubcategories(category?: string): Promise<string[]> {
    const query = category ? { category } : {}
    return this.productModel.distinct('subcategory', query)
  }

  async getProductTypes(subcategory?: string): Promise<string[]> {
    const query = subcategory ? { subcategory } : {}
    return this.productModel.distinct('productType', query)
  }

  async getBrands(): Promise<string[]> {
    return this.productModel.distinct('brand')
  }

  async updateSupermarketPrice(
    productId: string,
    supermarketId: string,
    priceData: { price: number, url: string, inStock: boolean }
  ): Promise<IProduct | null> {
    return this.productModel.findOneAndUpdate(
      { _id: productId, 'supermarkets.supermarketId': supermarketId },
      {
        $set: {
          'supermarkets.$.price': priceData.price,
          'supermarkets.$.url': priceData.url,
          'supermarkets.$.inStock': priceData.inStock,
          'supermarkets.$.lastUpdated': new Date()
        }
      },
      { new: true }
    )
  }

  async getPriceComparison(productIds: string[], supermarketIds: string[]) {
    const products = await this.productModel
      .find({ _id: { $in: productIds } })
      .populate('supermarkets.supermarketId', 'name code')

    return products.map(product => ({
      productId: product._id,
      name: product.name,
      brand: product.brand,
      prices: product.supermarkets
        .filter(s => supermarketIds.includes(s.supermarketId.toString()))
        .map(s => ({
          supermarket: s.supermarketId.name,
          price: s.price,
          inStock: s.inStock,
          discount: s.discount
        }))
    }))
  }
}

export default ProductRepository
```

## 📋 Convenciones y Patrones

### Nomenclatura

- *Colecciones*: Plural y lowercase (users, products, supermarkets)
- *Campos*: camelCase para campos simples (firstName, email)
- *Referencias*: ObjectId con nombres descriptivos (userId, productId)
- *Enums*: Valores en lowercase separados por guion (user-role, product-status)
- *Índices*: Prefijo con colección (user_email_idx, product_category_idx)

### Estructura de Documentos

- *Campos requeridos*: Siempre al inicio del esquema
- *Campos opcionales*: Después de los requeridos
- *Subdocumentos*: Objetos anidados con estructura clara
- *Arrays*: Para relaciones uno-a-muchos
- *Referencias*: Usar ObjectId para relaciones entre colecciones

### Validaciones

```typescript
// Validaciones a nivel de esquema
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
      },
      message: 'Please enter a valid email'
    }
  }
})
```

## 🔧 Configuración

### Variables de Entorno

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/caminando-online
MONGODB_TEST_URI=mongodb://localhost:27017/caminando-online-test

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Database Options
DB_POOL_SIZE=10
DB_CONNECT_TIMEOUT=5000
DB_SOCKET_TIMEOUT=45000

# Backup
DB_BACKUP_SCHEDULE=0 2 * * *  # Daily at 2 AM
DB_BACKUP_RETENTION=30        # Keep 30 days
DB_BACKUP_PATH=/backups/mongodb

# Monitoring
DB_SLOW_QUERY_THRESHOLD=100   # ms
DB_ENABLE_PROFILING=true
```

### Configuración de MongoDB

```typescript
// database/config/database.config.ts
export const databaseConfig = {
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/caminando-online',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      // Debug options
      loggerLevel: 'info',
      // Performance options
      bufferMaxEntries: 0,
      bufferCommands: false
    }
  },
  production: {
    uri: process.env.MONGODB_URI,
    options: {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
      family: 4,
      // Security options
      ssl: true,
      sslValidate: true,
      // Performance options
      bufferMaxEntries: 0,
      bufferCommands: false,
      // Monitoring
      loggerLevel: 'warn'
    }
  },
  test: {
    uri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/caminando-test',
    options: {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 1000,
      // Drop database after tests
      dropDatabase: true
    }
  }
}
```

## 🧪 Testing

### Estructura de Tests

```
database/tests/
├── unit/
│   ├── models/
│   │   ├── User.test.ts
│   │   ├── Product.test.ts
│   │   └── Supermarket.test.ts
│   ├── repositories/
│   │   ├── UserRepository.test.ts
│   │   └── ProductRepository.test.ts
│   └── utils/
│       └── validators.test.ts
├── integration/
│   ├── database-connection.test.ts
│   ├── crud-operations.test.ts
│   └── aggregations.test.ts
└── fixtures/
    ├── users.json
    ├── products.json
    └── supermarkets.json
```

### Ejecutar Tests

```bash
# Tests unitarios de modelos
npm run test:db:unit

# Tests de integración
npm run test:db:integration

# Tests con base de datos de prueba
npm run test:db:e2e

# Tests de performance
npm run test:db:performance
```

## 📝 Notas Importantes

- *Índices*: Crear índices apropiados para consultas frecuentes
- *Referencias*: Usar populate() para evitar consultas N+1
- *Validación*: Implementar validaciones tanto en esquema como en aplicación
- *Transacciones*: Usar transacciones para operaciones críticas
- *Backup*: Implementar estrategia de backup regular
- *Monitoreo*: Configurar alertas para uso de recursos y errores
- *Migraciones*: Documentar cambios en esquema con versiones

## 🔗 Referencias y Documentación

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Database Design Best Practices](https://www.mongodb.com/blog/post/database-design-best-practices)

## 🚧 Roadmap y TODOs

### Próximas Mejoras

- [ ] Implementar sharding para escalabilidad horizontal
- [ ] Agregar sistema de réplicas para alta disponibilidad
- [ ] Implementar compresión de datos
- [ ] Optimizar índices con compound indexes
- [ ] Agregar sistema de analytics en tiempo real
- [ ] Implementar backup incremental
- [ ] Agregar encriptación de datos sensibles

### Problemas Conocidos

- [ ] Optimización de consultas de agregación compleja - Prioridad: Alta
- [ ] Manejo de conexiones en alta concurrencia - Prioridad: Media
- [ ] Sistema de migraciones automático - Prioridad: Media
- [ ] Monitoreo de performance en producción - Prioridad: Alta
