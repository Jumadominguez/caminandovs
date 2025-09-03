# API Reference - Documentación de la API de Caminando Online

[La API de Caminando Online es el punto de entrada principal para todas las operaciones del sistema. Proporciona endpoints RESTful para gestión de usuarios, productos, scraping, autenticación y funcionalidades administrativas.]

## 📁 Estructura

```
api/
├── v1/                     # Versión 1 de la API
│   ├── auth/               # Endpoints de autenticación
│   │   ├── login.ts        # POST /api/v1/auth/login
│   │   ├── register.ts     # POST /api/v1/auth/register
│   │   ├── logout.ts       # POST /api/v1/auth/logout
│   │   ├── refresh.ts      # POST /api/v1/auth/refresh
│   │   ├── forgot-password.ts # POST /api/v1/auth/forgot-password
│   │   └── reset-password.ts # POST /api/v1/auth/reset-password
│   ├── users/              # Endpoints de usuarios
│   │   ├── profile.ts      # GET/PUT /api/v1/users/profile
│   │   ├── preferences.ts  # GET/PUT /api/v1/users/preferences
│   │   └── accounts.ts     # GET/POST/DELETE /api/v1/users/accounts
│   ├── products/           # Endpoints de productos
│   │   ├── search.ts       # GET /api/v1/products/search
│   │   ├── details.ts      # GET /api/v1/products/:id
│   │   ├── compare.ts      # POST /api/v1/products/compare
│   │   ├── favorites.ts    # GET/POST/DELETE /api/v1/products/favorites
│   │   └── history.ts      # GET /api/v1/products/history
│   ├── supermarkets/       # Endpoints de supermercados
│   │   ├── list.ts         # GET /api/v1/supermarkets
│   │   ├── link.ts         # POST /api/v1/supermarkets/link
│   │   ├── unlink.ts       # DELETE /api/v1/supermarkets/:id/unlink
│   │   └── sync.ts         # POST /api/v1/supermarkets/:id/sync
│   ├── scraping/           # Endpoints de scraping (admin)
│   │   ├── status.ts       # GET /api/v1/scraping/status
│   │   ├── trigger.ts      # POST /api/v1/scraping/trigger
│   │   ├── logs.ts         # GET /api/v1/scraping/logs
│   │   └── config.ts       # GET/PUT /api/v1/scraping/config
│   ├── admin/              # Endpoints administrativos
│   │   ├── users.ts        # GET/PUT/DELETE /api/v1/admin/users
│   │   ├── products.ts     # GET/PUT/DELETE /api/v1/admin/products
│   │   ├── supermarkets.ts # GET/POST/PUT/DELETE /api/v1/admin/supermarkets
│   │   ├── analytics.ts    # GET /api/v1/admin/analytics
│   │   └── system.ts       # GET /api/v1/admin/system
│   ├── public/             # Endpoints públicos
│   │   ├── health.ts       # GET /api/v1/health
│   │   ├── metrics.ts      # GET /api/v1/metrics
│   │   └── supermarkets.ts # GET /api/v1/public/supermarkets
│   └── middleware/         # Middlewares compartidos
│       ├── auth.ts         # Middleware de autenticación
│       ├── validation.ts   # Middleware de validación
│       ├── rate-limit.ts   # Middleware de rate limiting
│       ├── cors.ts         # Middleware CORS
│       └── error-handler.ts # Middleware de manejo de errores
├── docs/                   # Documentación de la API
│   ├── swagger.json        # Especificación OpenAPI
│   ├── postman.json        # Colección Postman
│   ├── examples/           # Ejemplos de uso
│   └── README.md           # Guía de la API
├── utils/                  # Utilidades de la API
│   ├── response.ts         # Utilidades de respuesta
│   ├── validation.ts       # Utilidades de validación
│   ├── pagination.ts       # Utilidades de paginación
│   ├── filtering.ts        # Utilidades de filtrado
│   ├── sorting.ts          # Utilidades de ordenamiento
│   └── caching.ts          # Utilidades de caching
├── types/                  # Tipos TypeScript
│   ├── requests.ts         # Tipos de requests
│   ├── responses.ts        # Tipos de responses
│   ├── models.ts           # Tipos de modelos
│   └── errors.ts           # Tipos de errores
├── tests/                  # Tests de la API
│   ├── unit/               # Tests unitarios
│   ├── integration/        # Tests de integración
│   ├── e2e/                # Tests end-to-end
│   └── performance/        # Tests de rendimiento
├── config/                 # Configuración
│   ├── routes.ts           # Configuración de rutas
│   ├── rate-limits.ts      # Configuración de rate limiting
│   ├── cors.ts             # Configuración CORS
│   └── validation.ts       # Configuración de validación
├── package.json            # Dependencias
└── README.md               # Documentación principal
```

## 🎯 Funcionalidades Principales

- *Autenticación*: Login, registro, refresh tokens, recuperación de contraseña
- *Gestión de Usuarios*: Perfiles, preferencias, cuentas vinculadas
- *Productos*: Búsqueda, comparación, favoritos, historial
- *Supermercados*: Vinculación, sincronización, gestión de cuentas
- *Scraping*: Control administrativo del sistema de scraping
- *Administración*: Gestión de usuarios, productos, supermercados y analytics
- *Público*: Endpoints accesibles sin autenticación

## 🛠 Tecnologías Utilizadas

- *Express.js*: Framework web para Node.js
- *TypeScript*: Tipado estático para JavaScript
- *Joi*: Validación de esquemas
- *Helmet*: Seguridad de headers HTTP
- *CORS*: Cross-Origin Resource Sharing
- *Rate Limiting*: Control de tasa de requests
- *Swagger/OpenAPI*: Documentación de API
- *JWT*: Autenticación stateless
- *Redis*: Caching y sesiones
- *PostgreSQL*: Base de datos relacional
- *MongoDB*: Base de datos NoSQL para productos

## Uso y Ejemplos

### Estructura Base de un Endpoint

```typescript
// api/v1/auth/login.ts
import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { AuthService } from '../../../auth/core/authService'
import { authenticateRateLimit } from '../middleware/rate-limit'
import { asyncHandler } from '../../../utils/asyncHandler'
import { ApiResponse } from '../../../utils/response'

const router = Router()

// Validaciones
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña requerida'),
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('rememberMe debe ser un booleano')
]

// Endpoint de login
router.post('/login',
  authenticateRateLimit,
  loginValidation,
  asyncHandler(async (req: Request, res: Response) => {
    // Validar entrada
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, 'Datos de entrada inválidos', errors.array())
    }

    const { email, password, rememberMe } = req.body

    try {
      // Autenticar usuario
      const authService = new AuthService()
      const result = await authService.login({
        email,
        password,
        rememberMe: rememberMe || false
      }, req.ip, req.get('User-Agent') || '')

      // Responder con éxito
      ApiResponse.success(res, 'Login exitoso', result)

    } catch (error: any) {
      // Manejar errores específicos
      if (error.message === 'Invalid credentials') {
        return ApiResponse.unauthorized(res, 'Credenciales inválidas')
      }

      if (error.message === 'Email not verified') {
        return ApiResponse.forbidden(res, 'Email no verificado')
      }

      // Error genérico
      ApiResponse.error(res, 'Error interno del servidor')
    }
  })
)

export default router
```

### Utilidades de Respuesta

```typescript
// api/utils/response.ts
import { Response } from 'express'

export interface ApiResponseData<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: any[]
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response<ApiResponseData<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId
      }
    })
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any[]
  ): Response<ApiResponseData> {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId
      }
    })
  }

  static badRequest(
    res: Response,
    message: string,
    errors?: any[]
  ): Response<ApiResponseData> {
    return this.error(res, message, 400, errors)
  }

  static unauthorized(
    res: Response,
    message: string = 'No autorizado'
  ): Response<ApiResponseData> {
    return this.error(res, message, 401)
  }

  static forbidden(
    res: Response,
    message: string = 'Acceso denegado'
  ): Response<ApiResponseData> {
    return this.error(res, message, 403)
  }

  static notFound(
    res: Response,
    message: string = 'Recurso no encontrado'
  ): Response<ApiResponseData> {
    return this.error(res, message, 404)
  }

  static conflict(
    res: Response,
    message: string = 'Conflicto de recursos'
  ): Response<ApiResponseData> {
    return this.error(res, message, 409)
  }

  static tooManyRequests(
    res: Response,
    message: string = 'Demasiadas solicitudes'
  ): Response<ApiResponseData> {
    return this.error(res, message, 429)
  }

  static paginated<T>(
    res: Response,
    message: string,
    data: T[],
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    },
    statusCode: number = 200
  ): Response<ApiResponseData<T[]>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId,
        pagination
      }
    })
  }
}
```

### Middleware de Rate Limiting

```typescript
// api/v1/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'

// Rate limiting general
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por windowMs
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta más tarde',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting para health checks
    return req.path === '/health' || req.path === '/metrics'
  }
})

// Rate limiting para autenticación
export const authenticateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos de login por windowMs
  message: {
    success: false,
    message: 'Demasiados intentos de login, intenta más tarde',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
  keyGenerator: (req: Request) => {
    // Usar email como key para rate limiting
    return req.body.email || req.ip
  }
})

// Rate limiting para API de productos
export const productsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // límite de 30 requests por minuto
  message: {
    success: false,
    message: 'Demasiadas solicitudes a la API de productos',
    retryAfter: '1 minuto'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiting para scraping (admin)
export const scrapingRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // límite de 10 requests por minuto
  message: {
    success: false,
    message: 'Demasiadas solicitudes a la API de scraping',
    retryAfter: '1 minuto'
  },
  standardHeaders: true,
  legacyHeaders: false
})
```

### Validación de Datos

```typescript
// api/utils/validation.ts
import Joi from 'joi'

// Esquemas de validación reutilizables
export const userSchemas = {
  register: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email inválido',
        'any.required': 'Email es requerido'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'La contraseña debe contener mayúsculas, minúsculas y números',
        'any.required': 'Contraseña es requerida'
      }),
    firstName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre debe tener máximo 50 caracteres',
        'any.required': 'Nombre es requerido'
      }),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido debe tener máximo 50 caracteres',
        'any.required': 'Apellido es requerido'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
    rememberMe: Joi.boolean()
      .default(false)
  }),

  updateProfile: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50),
    lastName: Joi.string()
      .min(2)
      .max(50),
    preferences: Joi.object({
      notifications: Joi.boolean(),
      language: Joi.string().valid('es', 'en'),
      currency: Joi.string().valid('EUR', 'USD')
    })
  })
}

export const productSchemas = {
  search: Joi.object({
    query: Joi.string()
      .min(2)
      .max(100)
      .required(),
    supermarket: Joi.string()
      .uuid(),
    category: Joi.string()
      .max(50),
    minPrice: Joi.number()
      .min(0),
    maxPrice: Joi.number()
      .min(0),
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20),
    sortBy: Joi.string()
      .valid('price', 'name', 'rating', 'date')
      .default('price'),
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('asc')
  }),

  compare: Joi.object({
    productIds: Joi.array()
      .items(Joi.string().uuid())
      .min(2)
      .max(10)
      .required()
      .messages({
        'array.min': 'Se requieren al menos 2 productos para comparar',
        'array.max': 'Máximo 10 productos para comparar'
      })
  })
}

export const supermarketSchemas = {
  link: Joi.object({
    supermarketId: Joi.string()
      .uuid()
      .required(),
    username: Joi.string()
      .required(),
    password: Joi.string()
      .required()
  }),

  sync: Joi.object({
    fullSync: Joi.boolean()
      .default(false),
    categories: Joi.array()
      .items(Joi.string())
  })
}

// Función helper para validar
export const validateRequest = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  })

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }))

    return { isValid: false, errors, value: null }
  }

  return { isValid: true, errors: null, value }
}
```

## 📋 Endpoints de la API

### Autenticación

#### POST /api/v1/auth/register
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "SecurePass123",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "verificationToken": "token"
  }
}
```

#### POST /api/v1/auth/login
Inicia sesión de un usuario.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "SecurePass123",
  "rememberMe": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "user"
    }
  }
}
```

#### POST /api/v1/auth/refresh
Renueva el access token usando el refresh token.

**Headers:**
```
Authorization: Bearer refresh-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "data": {
    "accessToken": "new-jwt-token",
    "refreshToken": "new-refresh-token",
    "expiresIn": 900
  }
}
```

### Productos

#### GET /api/v1/products/search
Busca productos en los supermercados.

**Query Parameters:**
- `query`: Término de búsqueda (requerido)
- `supermarket`: ID del supermercado (opcional)
- `category`: Categoría del producto (opcional)
- `minPrice`: Precio mínimo (opcional)
- `maxPrice`: Precio máximo (opcional)
- `page`: Página (opcional, default: 1)
- `limit`: Límite por página (opcional, default: 20)
- `sortBy`: Campo de ordenamiento (opcional, default: price)
- `sortOrder`: Orden (opcional, default: asc)

**Headers:**
```
Authorization: Bearer access-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Productos encontrados",
  "data": [
    {
      "id": "uuid",
      "name": "Producto Ejemplo",
      "description": "Descripción del producto",
      "price": 15.99,
      "originalPrice": 19.99,
      "discount": 20,
      "imageUrl": "https://...",
      "supermarket": {
        "id": "uuid",
        "name": "Supermercado Ejemplo",
        "logoUrl": "https://..."
      },
      "category": "Alimentos",
      "brand": "Marca Ejemplo",
      "unit": "kg",
      "availability": "available",
      "lastUpdated": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### GET /api/v1/products/:id
Obtiene detalles de un producto específico.

**Headers:**
```
Authorization: Bearer access-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto encontrado",
  "data": {
    "id": "uuid",
    "name": "Producto Ejemplo",
    "description": "Descripción detallada del producto",
    "price": 15.99,
    "originalPrice": 19.99,
    "discount": 20,
    "images": ["https://...", "https://..."],
    "supermarket": {
      "id": "uuid",
      "name": "Supermercado Ejemplo",
      "logoUrl": "https://...",
      "location": "Madrid"
    },
    "category": "Alimentos",
    "subcategory": "Frutas y Verduras",
    "brand": "Marca Ejemplo",
    "unit": "kg",
    "weight": 1.5,
    "ingredients": ["Ingrediente 1", "Ingrediente 2"],
    "nutritionFacts": {
      "calories": 150,
      "protein": 5,
      "carbs": 20,
      "fat": 8
    },
    "availability": "available",
    "stock": 50,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/v1/products/compare
Compara múltiples productos.

**Request Body:**
```json
{
  "productIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Headers:**
```
Authorization: Bearer access-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Comparación realizada",
  "data": {
    "products": [
      {
        "id": "uuid1",
        "name": "Producto 1",
        "price": 15.99,
        "supermarket": "Supermercado A",
        "rating": 4.5
      },
      {
        "id": "uuid2",
        "name": "Producto 2",
        "price": 17.99,
        "supermarket": "Supermercado B",
        "rating": 4.2
      }
    ],
    "comparison": {
      "priceDifference": 2.00,
      "cheapest": "uuid1",
      "bestRating": "uuid1",
      "recommendation": "Producto 1 es más económico y mejor valorado"
    }
  }
}
```

### Supermercados

#### GET /api/v1/supermarkets
Obtiene la lista de supermercados disponibles.

**Response (200):**
```json
{
  "success": true,
  "message": "Supermercados obtenidos",
  "data": [
    {
      "id": "uuid",
      "name": "Mercadona",
      "logoUrl": "https://...",
      "country": "Spain",
      "categories": ["Alimentos", "Bebidas", "Limpieza"],
      "features": ["delivery", "pickup", "online"],
      "isActive": true
    }
  ]
}
```

#### POST /api/v1/supermarkets/link
Vincula una cuenta de supermercado al usuario.

**Request Body:**
```json
{
  "supermarketId": "uuid",
  "username": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Headers:**
```
Authorization: Bearer access-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cuenta vinculada exitosamente",
  "data": {
    "supermarket": "Mercadona",
    "lastSync": "2024-01-01T00:00:00.000Z",
    "status": "active"
  }
}
```

### Administración

#### GET /api/v1/admin/analytics
Obtiene métricas y analytics del sistema (solo admin).

**Headers:**
```
Authorization: Bearer access-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Analytics obtenidos",
  "data": {
    "users": {
      "total": 1250,
      "active": 980,
      "newToday": 15,
      "growth": 8.5
    },
    "products": {
      "total": 50000,
      "updatedToday": 1200,
      "bySupermarket": {
        "Mercadona": 15000,
        "Carrefour": 12000,
        "Dia": 8000
      }
    },
    "scraping": {
      "lastRun": "2024-01-01T02:00:00.000Z",
      "duration": 1800,
      "productsScraped": 2500,
      "errors": 5
    },
    "performance": {
      "avgResponseTime": 245,
      "errorRate": 0.02,
      "uptime": 99.9
    }
  }
}
```

## 📋 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autorizado |
| 403 | Forbidden - Acceso denegado |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto de recursos |
| 422 | Unprocessable Entity - Validación fallida |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error interno |

## 🔧 Configuración

### Variables de Entorno

```env
# API Configuration
API_VERSION=v1
API_PREFIX=/api
API_PORT=3000
API_HOST=localhost

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://caminando.online
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5
PRODUCTS_RATE_LIMIT_MAX=30

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# Caching
CACHE_TTL=300
CACHE_PREFIX=caminando:

# Security
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
BCRYPT_ROUNDS=12
```

### Configuración de Rutas

```typescript
// api/config/routes.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

// Importar rutas
import authRoutes from '../v1/auth'
import userRoutes from '../v1/users'
import productRoutes from '../v1/products'
import supermarketRoutes from '../v1/supermarkets'
import adminRoutes from '../v1/admin'
import publicRoutes from '../v1/public'

// Middlewares
import { generalRateLimit } from '../v1/middleware/rate-limit'
import { errorHandler } from '../v1/middleware/error-handler'
import { requestLogger } from '../v1/middleware/logger'
import { corsOptions } from './cors'

export const configureRoutes = (app: express.Application): void => {
  // Middlewares de seguridad
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }))

  // CORS
  app.use(cors(corsOptions))

  // Compresión
  app.use(compression())

  // Rate limiting general
  app.use(generalRateLimit)

  // Logging
  app.use(requestLogger)

  // Body parsing
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // Health check (sin rate limiting)
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1'
    })
  })

  // API routes
  const apiRouter = express.Router()

  // Versionado de API
  apiRouter.use('/v1', [
    authRoutes,
    userRoutes,
    productRoutes,
    supermarketRoutes,
    adminRoutes,
    publicRoutes
  ])

  app.use('/api', apiRouter)

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
      path: req.originalUrl,
      method: req.method
    })
  })

  // Error handler (debe ser el último)
  app.use(errorHandler)
}
```

## 🧪 Testing

### Tests de API

```typescript
// api/tests/integration/auth.test.ts
import request from 'supertest'
import { app } from '../../../app'
import { User } from '../../../models/User'
import { setupTestDb, teardownTestDb } from '../../utils/testUtils'

describe('Auth API', () => {
  beforeAll(async () => {
    await setupTestDb()
  })

  afterAll(async () => {
    await teardownTestDb()
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.firstName).toBe(userData.firstName)
    })

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User'
      }

      // Crear usuario primero
      await User.create(userData)

      // Intentar registrar de nuevo
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('already exists')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({})
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })
  })

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      await User.create({
        email: 'login@example.com',
        password: 'LoginPass123',
        firstName: 'Login',
        lastName: 'Test'
      })
    })

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'LoginPass123'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
      expect(response.body.data.user.email).toBe(loginData.email)
    })

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPass123'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Credenciales inválidas')
    })
  })
})
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test:api:unit

# Tests de integración
npm run test:api:integration

# Tests end-to-end
npm run test:api:e2e

# Tests de rendimiento
npm run test:api:performance

# Tests con coverage
npm run test:api:coverage

# Tests de contrato
npm run test:api:contract
```

## 📝 Notas Importantes

- *Versionado*: Usar versionado semántico (v1, v2, etc.)
- *Autenticación*: JWT con refresh tokens para mejor UX
- *Rate Limiting*: Proteger contra abuso y ataques DoS
- *Validación*: Validar todas las entradas con Joi
- *Paginación*: Implementar paginación consistente en listas
- *Caching*: Usar Redis para cache de responses
- *Logging*: Loggear todas las requests y errores
- *Documentación*: Mantener Swagger/OpenAPI actualizado
- *Testing*: Cobertura de tests > 80%
- *Monitoreo*: Métricas de performance y errores

## 🔗 Referencias y Documentación

- [Express.js Documentation](https://expressjs.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Joi Validation](https://joi.dev/)
- [JWT.io](https://jwt.io/)
- [REST API Design Best Practices](https://restfulapi.net/)

## 🚧 Roadmap y TODOs

### Próximas Mejoras

- [ ] Implementar GraphQL como alternativa a REST
- [ ] Agregar API versioning automático
- [ ] Implementar HATEOAS
- [ ] Agregar soporte para webhooks
- [ ] Implementar rate limiting adaptativo
- [ ] Agregar compresión de responses
- [ ] Implementar API caching avanzado
- [ ] Agregar soporte para bulk operations

### Problemas Conocidos

- [ ] Optimización de queries complejas - Prioridad: Media
- [ ] Mejora en manejo de timeouts - Prioridad: Baja
- [ ] Implementación de retry logic - Prioridad: Media
- [ ] Testing de carga completo - Prioridad: Alta
- [ ] Documentación de errores más detallada - Prioridad: Baja
