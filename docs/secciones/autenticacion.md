# Autenticación - Sistema de Usuarios y Seguridad de Caminando Online

[El sistema de autenticación es el componente responsable de gestionar usuarios, sesiones, permisos y seguridad en Caminando Online. Implementa autenticación JWT, vinculación de cuentas de supermercados, recuperación de contraseña y un sistema robusto de autorización para proteger los datos sensibles de los usuarios.]

## 📁 Estructura

```
auth/
├── core/                   # Núcleo del sistema de autenticación
│   ├── authService.ts      # Servicio principal de autenticación
│   ├── jwtService.ts       # Gestión de tokens JWT
│   ├── sessionService.ts   # Gestión de sesiones
│   └── passwordService.ts  # Gestión de contraseñas
├── controllers/            # Controladores de rutas
│   ├── authController.ts   # Controlador de autenticación
│   ├── userController.ts   # Controlador de usuarios
│   └── supermarketController.ts # Controlador de vinculación
├── middleware/             # Middlewares de autenticación
│   ├── auth.ts             # Middleware de autenticación JWT
│   ├── roleAuth.ts         # Middleware de autorización por roles
│   ├── rateLimit.ts        # Middleware de límite de tasa
│   └── cors.ts             # Middleware CORS
├── models/                 # Modelos de datos
│   ├── User.ts             # Modelo de usuario
│   ├── Session.ts          # Modelo de sesión
│   ├── RefreshToken.ts     # Modelo de refresh token
│   └── UserSupermarket.ts  # Modelo de vinculación
├── strategies/             # Estrategias de autenticación
│   ├── localStrategy.ts    # Estrategia local (email/password)
│   ├── jwtStrategy.ts      # Estrategia JWT
│   ├── googleStrategy.ts   # Estrategia Google OAuth
│   └── supermarketStrategy.ts # Estrategia de supermercados
├── validators/             # Validadores de entrada
│   ├── authValidators.ts   # Validadores de autenticación
│   ├── userValidators.ts   # Validadores de usuario
│   └── passwordValidators.ts # Validadores de contraseña
├── services/               # Servicios específicos
│   ├── emailService.ts     # Servicio de envío de emails
│   ├── smsService.ts       # Servicio de envío de SMS
│   ├── otpService.ts       # Servicio de OTP
│   └── auditService.ts     # Servicio de auditoría
├── utils/                  # Utilidades
│   ├── encryption.ts       # Utilidades de encriptación
│   ├── tokenUtils.ts       # Utilidades de tokens
│   ├── passwordUtils.ts    # Utilidades de contraseñas
│   └── securityUtils.ts    # Utilidades de seguridad
├── config/                 # Configuraciones
│   ├── auth.config.ts      # Configuración general
│   ├── jwt.config.ts       # Configuración JWT
│   ├── oauth.config.ts     # Configuración OAuth
│   └── security.config.ts  # Configuración de seguridad
├── tests/                  # Tests
│   ├── unit/               # Tests unitarios
│   ├── integration/        # Tests de integración
│   └── e2e/                # Tests end-to-end
├── docs/                   # Documentación
│   ├── api.md              # Documentación de API
│   ├── security.md         # Guía de seguridad
│   └── flows.md            # Flujos de autenticación
├── scripts/                # Scripts de utilidad
│   ├── seedUsers.ts        # Crear usuarios de prueba
│   ├── cleanupSessions.ts  # Limpiar sesiones expiradas
│   └── migratePasswords.ts # Migrar hashes de contraseña
├── package.json            # Dependencias
└── README.md               # Documentación principal
```

## 🎯 Funcionalidades Principales

- *Registro y Login*: Sistema completo de autenticación con email y contraseña
- *JWT Tokens*: Autenticación stateless con access y refresh tokens
- *Recuperación de Contraseña*: Flujo seguro de reset de contraseña
- *Vinculación de Supermercados*: Conectar cuentas de supermercados de forma segura
- *Autorización por Roles*: Sistema de permisos basado en roles (user, admin)
- *Verificación de Email*: Confirmación de cuentas por email
- *Autenticación de Dos Factores*: 2FA opcional con TOTP
- *Auditoría de Seguridad*: Logging completo de actividades de usuario
- *Gestión de Sesiones*: Control de sesiones activas y revocación
- *OAuth Integration*: Login con Google y otras plataformas

## 🛠 Tecnologías Utilizadas

- *JWT (JSON Web Tokens)*: Estándar para tokens de acceso
- *bcrypt*: Hashing seguro de contraseñas
- *crypto*: Módulo de Node.js para encriptación
- *nodemailer*: Envío de emails transaccionales
- *passport.js*: Middleware de autenticación flexible
- *express-rate-limit*: Control de tasa de requests
- *helmet*: Seguridad de headers HTTP
- *express-validator*: Validación de entrada de datos
- *redis*: Almacenamiento de sesiones y tokens
- *speakeasy*: Generación de códigos TOTP para 2FA
- *joi*: Validación avanzada de esquemas

## Uso y Ejemplos

### Servicio de Autenticación Principal

```typescript
// auth/core/authService.ts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { Session } from '../models/Session'
import { RefreshToken } from '../models/RefreshToken'
import { EmailService } from '../services/emailService'
import { AuditService } from '../services/auditService'
import logger from '../../utils/logger'

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export class AuthService {
  private jwtSecret: string
  private jwtRefreshSecret: string
  private emailService: EmailService
  private auditService: AuditService

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret'
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
    this.emailService = new EmailService()
    this.auditService = new AuditService()
  }

  async register(userData: RegisterData): Promise<{ user: any, verificationToken: string }> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        throw new Error('User already exists')
      }

      // Crear nuevo usuario
      const user = new User({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isEmailVerified: false
      })

      // Generar token de verificación
      const verificationToken = this.generateVerificationToken()

      // Guardar usuario con token de verificación
      user.emailVerificationToken = verificationToken
      await user.save()

      // Enviar email de verificación
      await this.emailService.sendVerificationEmail(user.email, verificationToken)

      // Auditar registro
      await this.auditService.logEvent({
        userId: user._id,
        action: 'USER_REGISTERED',
        ip: '', // Se obtiene del request
        userAgent: '', // Se obtiene del request
        metadata: { email: user.email }
      })

      logger.info(`User registered successfully: ${user.email}`)
      return { user: user.toPublicProfile(), verificationToken }

    } catch (error) {
      logger.error('Registration failed:', error)
      throw error
    }
  }

  async login(credentials: LoginCredentials, ip: string, userAgent: string): Promise<TokenPair & { user: any }> {
    try {
      // Buscar usuario
      const user = await User.findOne({ email: credentials.email }).select('+password')
      if (!user) {
        throw new Error('Invalid credentials')
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(credentials.password)
      if (!isPasswordValid) {
        // Auditar intento fallido
        await this.auditService.logEvent({
          userId: user._id,
          action: 'LOGIN_FAILED',
          ip,
          userAgent,
          metadata: { reason: 'INVALID_PASSWORD' }
        })
        throw new Error('Invalid credentials')
      }

      // Verificar si el email está verificado
      if (!user.isEmailVerified) {
        throw new Error('Email not verified')
      }

      // Generar tokens
      const tokens = await this.generateTokens(user)

      // Crear sesión
      await this.createSession(user._id, ip, userAgent, credentials.rememberMe)

      // Actualizar último login
      user.lastLogin = new Date()
      await user.save()

      // Auditar login exitoso
      await this.auditService.logEvent({
        userId: user._id,
        action: 'LOGIN_SUCCESS',
        ip,
        userAgent,
        metadata: {}
      })

      logger.info(`User logged in: ${user.email}`)
      return {
        ...tokens,
        user: user.toPublicProfile()
      }

    } catch (error) {
      logger.error('Login failed:', error)
      throw error
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      // Verificar refresh token
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as any

      // Buscar refresh token en base de datos
      const storedToken = await RefreshToken.findOne({
        token: refreshToken,
        userId: decoded.userId,
        isRevoked: false
      })

      if (!storedToken) {
        throw new Error('Invalid refresh token')
      }

      // Verificar expiración
      if (storedToken.expiresAt < new Date()) {
        throw new Error('Refresh token expired')
      }

      // Buscar usuario
      const user = await User.findById(decoded.userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Generar nuevos tokens
      const tokens = await this.generateTokens(user)

      // Revocar token anterior y crear nuevo
      storedToken.isRevoked = true
      await storedToken.save()

      return tokens

    } catch (error) {
      logger.error('Token refresh failed:', error)
      throw error
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    try {
      // Revocar refresh token si se proporciona
      if (refreshToken) {
        await RefreshToken.updateOne(
          { token: refreshToken },
          { isRevoked: true }
        )
      }

      // Cerrar todas las sesiones del usuario
      await Session.updateMany(
        { userId, isActive: true },
        { isActive: false, endedAt: new Date() }
      )

      logger.info(`User logged out: ${userId}`)

    } catch (error) {
      logger.error('Logout failed:', error)
      throw error
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        // No revelar si el email existe o no por seguridad
        return
      }

      // Generar token de reset
      const resetToken = this.generateResetToken()
      user.passwordResetToken = resetToken
      user.passwordResetExpires = new Date(Date.now() + 3600000) // 1 hora
      await user.save()

      // Enviar email de reset
      await this.emailService.sendPasswordResetEmail(user.email, resetToken)

      logger.info(`Password reset requested for: ${email}`)

    } catch (error) {
      logger.error('Password reset request failed:', error)
      throw error
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      })

      if (!user) {
        throw new Error('Invalid or expired reset token')
      }

      // Actualizar contraseña
      user.password = newPassword
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save()

      // Cerrar todas las sesiones
      await this.logout(user._id.toString())

      logger.info(`Password reset successful for: ${user.email}`)

    } catch (error) {
      logger.error('Password reset failed:', error)
      throw error
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const user = await User.findOne({
        emailVerificationToken: token,
        isEmailVerified: false
      })

      if (!user) {
        throw new Error('Invalid verification token')
      }

      user.isEmailVerified = true
      user.emailVerificationToken = undefined
      await user.save()

      logger.info(`Email verified for: ${user.email}`)

    } catch (error) {
      logger.error('Email verification failed:', error)
      throw error
    }
  }

  private async generateTokens(user: any): Promise<TokenPair> {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    }

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    })

    const refreshToken = jwt.sign(
      { userId: user._id },
      this.jwtRefreshSecret,
      { expiresIn: '7d' }
    )

    // Guardar refresh token en base de datos
    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    })
    await refreshTokenDoc.save()

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 // 15 minutos en segundos
    }
  }

  private async createSession(userId: string, ip: string, userAgent: string, rememberMe = false): Promise<void> {
    const session = new Session({
      userId,
      ip,
      userAgent,
      rememberMe,
      expiresAt: rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
        : new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 día
    })

    await session.save()
  }

  private generateVerificationToken(): string {
    return require('crypto').randomBytes(32).toString('hex')
  }

  private generateResetToken(): string {
    return require('crypto').randomBytes(32).toString('hex')
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any
      const user = await User.findById(decoded.userId)

      if (!user) {
        throw new Error('User not found')
      }

      return {
        userId: user._id,
        email: user.email,
        role: user.role
      }
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}

export default AuthService
```

### Middleware de Autenticación

```typescript
// auth/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../core/authService'

interface AuthenticatedRequest extends Request {
  user?: any
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      })
      return
    }

    const token = authHeader.substring(7) // Remove 'Bearer '
    const authService = new AuthService()
    const userData = await authService.validateToken(token)

    req.user = userData
    next()

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      })
      return
    }

    next()
  }
}

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const authService = new AuthService()
      const userData = await authService.validateToken(token)
      req.user = userData
    }

    next()
  } catch (error) {
    // Ignorar errores de autenticación opcional
    next()
  }
}
```

### Servicio de Vinculación de Supermercados

```typescript
// auth/services/supermarketLinkService.ts
import puppeteer from 'puppeteer'
import { User } from '../models/User'
import { Supermarket } from '../../database/models/Supermarket'
import logger from '../../utils/logger'

interface SupermarketCredentials {
  username: string
  password: string
}

interface LinkResult {
  success: boolean
  message: string
  data?: any
}

export class SupermarketLinkService {
  async linkSupermarket(
    userId: string,
    supermarketId: string,
    credentials: SupermarketCredentials
  ): Promise<LinkResult> {
    try {
      // Verificar que el supermercado existe
      const supermarket = await Supermarket.findById(supermarketId)
      if (!supermarket) {
        return {
          success: false,
          message: 'Supermercado no encontrado'
        }
      }

      // Verificar que el usuario no tenga ya vinculada esta cuenta
      const user = await User.findById(userId)
      const existingLink = user?.linkedSupermarkets.find(
        link => link.supermarketId.toString() === supermarketId
      )

      if (existingLink && existingLink.isActive) {
        return {
          success: false,
          message: 'Esta cuenta de supermercado ya está vinculada'
        }
      }

      // Intentar login en el supermercado
      const loginResult = await this.attemptSupermarketLogin(supermarket, credentials)

      if (!loginResult.success) {
        return {
          success: false,
          message: 'Credenciales inválidas o error de conexión'
        }
      }

      // Actualizar vinculación del usuario
      if (existingLink) {
        existingLink.isActive = true
        existingLink.lastSync = new Date()
      } else {
        user?.linkedSupermarkets.push({
          supermarketId,
          username: credentials.username,
          isActive: true,
          lastSync: new Date()
        })
      }

      await user?.save()

      // Iniciar scraping de datos personales si es necesario
      await this.scrapeUserData(userId, supermarket, credentials)

      logger.info(`Supermarket linked successfully: ${user?.email} - ${supermarket.name}`)

      return {
        success: true,
        message: 'Cuenta vinculada exitosamente',
        data: {
          supermarket: supermarket.name,
          lastSync: new Date()
        }
      }

    } catch (error) {
      logger.error('Supermarket linking failed:', error)
      return {
        success: false,
        message: 'Error interno del servidor'
      }
    }
  }

  private async attemptSupermarketLogin(
    supermarket: any,
    credentials: SupermarketCredentials
  ): Promise<{ success: boolean, sessionData?: any }> {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    try {
      // Navegar a la página de login
      await page.goto(supermarket.scrapingConfig.loginUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Completar formulario de login
      await page.type(supermarket.scrapingConfig.selectors.username, credentials.username)
      await page.type(supermarket.scrapingConfig.selectors.password, credentials.password)

      // Hacer click en login
      await page.click(supermarket.scrapingConfig.selectors.loginButton)

      // Esperar a que cargue la página después del login
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })

      // Verificar si el login fue exitoso
      const loginSuccess = await this.verifyLoginSuccess(page, supermarket)

      if (loginSuccess) {
        // Extraer datos de sesión si es necesario
        const sessionData = await this.extractSessionData(page)
        return { success: true, sessionData }
      } else {
        return { success: false }
      }

    } catch (error) {
      logger.error('Login attempt failed:', error)
      return { success: false }
    } finally {
      await browser.close()
    }
  }

  private async verifyLoginSuccess(page: any, supermarket: any): Promise<boolean> {
    // Verificar diferentes indicadores de login exitoso
    const successSelectors = [
      supermarket.scrapingConfig.selectors.dashboard,
      supermarket.scrapingConfig.selectors.userMenu,
      supermarket.scrapingConfig.selectors.welcomeMessage
    ]

    for (const selector of successSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 })
        return true
      } catch (error) {
        // Continuar con el siguiente selector
      }
    }

    // Verificar URL de redirección
    const currentUrl = page.url()
    if (currentUrl.includes('dashboard') || currentUrl.includes('account')) {
      return true
    }

    return false
  }

  private async extractSessionData(page: any): Promise<any> {
    // Extraer cookies y datos de sesión
    const cookies = await page.cookies()
    const localStorage = await page.evaluate(() => {
      const items: any = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          items[key] = localStorage.getItem(key)
        }
      }
      return items
    })

    return {
      cookies,
      localStorage,
      extractedAt: new Date()
    }
  }

  private async scrapeUserData(
    userId: string,
    supermarket: any,
    credentials: SupermarketCredentials
  ): Promise<void> {
    // Implementar scraping de datos personales del usuario
    // como historial de compras, preferencias, etc.
    logger.info(`Starting user data scraping for user ${userId} in ${supermarket.name}`)
    // TODO: Implementar lógica de scraping de datos personales
  }

  async unlinkSupermarket(userId: string, supermarketId: string): Promise<LinkResult> {
    try {
      const user = await User.findById(userId)
      const linkIndex = user?.linkedSupermarkets.findIndex(
        link => link.supermarketId.toString() === supermarketId
      )

      if (linkIndex === undefined || linkIndex === -1) {
        return {
          success: false,
          message: 'Vinculación no encontrada'
        }
      }

      user!.linkedSupermarkets[linkIndex].isActive = false
      await user!.save()

      logger.info(`Supermarket unlinked: ${user?.email} - ${supermarketId}`)

      return {
        success: true,
        message: 'Cuenta desvinculada exitosamente'
      }

    } catch (error) {
      logger.error('Supermarket unlinking failed:', error)
      return {
        success: false,
        message: 'Error interno del servidor'
      }
    }
  }

  async getLinkedSupermarkets(userId: string): Promise<any[]> {
    try {
      const user = await User.findById(userId).populate('linkedSupermarkets.supermarketId')
      return user?.linkedSupermarkets || []
    } catch (error) {
      logger.error('Failed to get linked supermarkets:', error)
      return []
    }
  }

  async syncSupermarketData(userId: string, supermarketId: string): Promise<LinkResult> {
    try {
      // Implementar sincronización de datos actualizados
      logger.info(`Syncing data for user ${userId} with supermarket ${supermarketId}`)

      // TODO: Implementar lógica de sincronización

      return {
        success: true,
        message: 'Datos sincronizados exitosamente'
      }

    } catch (error) {
      logger.error('Data sync failed:', error)
      return {
        success: false,
        message: 'Error al sincronizar datos'
      }
    }
  }
}

export default SupermarketLinkService
```

## 📋 Convenciones y Patrones

### Nomenclatura

- *Servicios*: PascalCase con sufijo Service (AuthService, EmailService)
- *Controladores*: camelCase con sufijo Controller (authController, userController)
- *Middlewares*: camelCase descriptivo (authenticate, authorize)
- *Modelos*: PascalCase (User, Session, RefreshToken)

### Manejo de Errores

```typescript
// Patrón consistente de manejo de errores
export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message)
    this.name = 'AuthError'
  }
}

// En servicios
throw new AuthError('Invalid credentials', 401)

// En controladores
try {
  const result = await authService.login(credentials)
  res.json(result)
} catch (error) {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    })
  } else {
    logger.error('Unexpected error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
```

### Validación de Datos

```typescript
// Validadores con express-validator
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener mayúsculas, minúsculas y números'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
]
```

## 🔧 Configuración

### Variables de Entorno

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Password Security
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=8
PASSWORD_RESET_TOKEN_EXPIRES=1h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@caminando.online

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=https://caminando.online/auth/google/callback

# Security
SESSION_TIMEOUT=24h
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=15m
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100

# 2FA Configuration
TOTP_ISSUER=Caminando Online
TOTP_WINDOW=1

# Audit Configuration
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION=90d
AUDIT_SENSITIVE_DATA_MASKED=true
```

### Configuración de Seguridad

```typescript
// auth/config/security.config.ts
export const securityConfig = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    preventCommonPasswords: true,
    maxConsecutiveChars: 3
  },

  sessionConfig: {
    cookieName: 'caminando_session',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  },

  rateLimitConfig: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 requests por windowMs
    message: {
      success: false,
      message: 'Demasiadas solicitudes, intenta más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
  },

  corsConfig: {
    origin: [
      'http://localhost:3000',
      'https://caminando.online',
      'https://www.caminando.online'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
}
```

## 🧪 Testing

### Estructura de Tests

```
auth/tests/
├── unit/
│   ├── services/
│   │   ├── authService.test.ts
│   │   ├── jwtService.test.ts
│   │   └── emailService.test.ts
│   ├── middleware/
│   │   ├── auth.test.ts
│   │   └── rateLimit.test.ts
│   └── utils/
│       ├── passwordUtils.test.ts
│       └── tokenUtils.test.ts
├── integration/
│   ├── auth-flow.test.ts
│   ├── user-registration.test.ts
│   ├── password-reset.test.ts
│   └── supermarket-linking.test.ts
└── e2e/
    ├── login-logout.test.ts
    ├── user-management.test.ts
    └── security-tests.test.ts
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test:auth:unit

# Tests de integración
npm run test:auth:integration

# Tests end-to-end
npm run test:auth:e2e

# Tests de seguridad específicos
npm run test:auth:security

# Tests con coverage
npm run test:auth:coverage
```

## 📝 Notas Importantes

- *Seguridad*: Usar HTTPS en producción, validar todas las entradas
- *Passwords*: Implementar políticas robustas de contraseña
- *Sessions*: Gestionar sesiones de forma segura con expiración
- *Tokens*: Implementar refresh tokens para mejor UX
- *Rate Limiting*: Proteger contra ataques de fuerza bruta
- *Auditoría*: Mantener logs detallados de actividades de seguridad
- *2FA*: Ofrecer autenticación de dos factores opcional
- *OAuth*: Integrar proveedores externos para facilitar registro

## 🔗 Referencias y Documentación

- [JWT.io](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://owasp.org/www-pdf-archive/OWASP_Application_Security_FAQ_-_Authentication.pdf)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)

## 🚧 Roadmap y TODOs

### Próximas Mejoras

- [ ] Implementar OAuth con Facebook y Apple
- [ ] Agregar autenticación biométrica
- [ ] Implementar SSO (Single Sign-On)
- [ ] Mejorar sistema de auditoría con análisis de patrones
- [ ] Agregar soporte para magic links
- [ ] Implementar revocación de tokens por dispositivo
- [ ] Agregar análisis de riesgo de login
- [ ] Implementar notificaciones de seguridad

### Problemas Conocidos

- [ ] Optimización de consultas de validación de tokens - Prioridad: Media
- [ ] Mejorar manejo de sesiones concurrentes - Prioridad: Baja
- [ ] Implementar rate limiting más granular - Prioridad: Media
- [ ] Testing completo de flujos de recuperación de contraseña - Prioridad: Alta
