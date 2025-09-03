# Auth Forms - Módulo de Formularios de Autenticación

[El módulo Auth Forms implementa un sistema completo de autenticación con formularios de login, registro, recuperación de contraseña y verificación de email, con validación robusta y experiencia de usuario optimizada.]

## 📁 Estructura del Módulo

```
modules/auth-forms/
├── components/
│   ├── AuthForms.tsx            # Componente principal
│   ├── LoginForm.tsx            # Formulario de login
│   ├── RegisterForm.tsx         # Formulario de registro
│   ├── ForgotPasswordForm.tsx   # Recuperar contraseña
│   ├── ResetPasswordForm.tsx    # Reset de contraseña
│   ├── EmailVerification.tsx    # Verificación de email
│   ├── SocialAuthButtons.tsx    # Botones de auth social
│   ├── AuthModal.tsx            # Modal de autenticación
│   └── FormField.tsx            # Campo de formulario genérico
├── hooks/
│   ├── useAuthForms.ts          # Hook principal
│   ├── useLogin.ts              # Hook de login
│   ├── useRegister.ts           # Hook de registro
│   ├── usePasswordReset.ts      # Hook de reset de contraseña
│   └── useFormValidation.ts     # Hook de validación
├── styles/
│   ├── auth.module.css          # Estilos principales
│   ├── forms.css                # Estilos de formularios
│   ├── buttons.css              # Estilos de botones
│   └── animations.css           # Animaciones
├── types/
│   ├── auth.ts                  # Tipos de autenticación
│   ├── forms.ts                 # Tipos de formularios
│   └── validation.ts            # Tipos de validación
├── utils/
│   ├── authConfig.ts            # Configuración de auth
│   ├── validationRules.ts       # Reglas de validación
│   ├── authHelpers.ts           # Helpers de autenticación
│   └── formHelpers.ts           # Helpers de formularios
├── index.ts                     # Export principal
└── README.md                    # Documentación
```

## 🎯 Funcionalidades

- **Login Seguro**: Autenticación con email/contraseña
- **Registro Completo**: Formulario con validación robusta
- **Recuperación de Contraseña**: Flujo completo de reset
- **Verificación de Email**: Confirmación de cuenta
- **Autenticación Social**: Google, Facebook, etc.
- **Validación en Tiempo Real**: Feedback inmediato
- **Gestión de Sesiones**: Persistencia y renovación
- **Seguridad Avanzada**: Protección contra ataques

## 🛠 Tecnologías Utilizadas

- **React**: Componentes con estado complejo
- **TypeScript**: Tipado fuerte para formularios
- **Tailwind CSS**: Estilos responsivos
- **React Hook Form**: Gestión avanzada de formularios
- **Zod**: Validación de esquemas
- **React Context**: Estado global de autenticación
- **JWT**: Gestión de tokens de sesión

## 📋 Componentes Principales

### AuthForms (Componente Principal)

```typescript
// modules/auth-forms/components/AuthForms.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthForms } from '../hooks/useAuthForms'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import ResetPasswordForm from './ResetPasswordForm'
import EmailVerification from './EmailVerification'
import SocialAuthButtons from './SocialAuthButtons'
import styles from '../styles/auth.module.css'

interface AuthFormsProps {
  initialMode?: 'login' | 'register' | 'forgot' | 'reset' | 'verify'
  onSuccess?: (user: User) => void
  onError?: (error: AuthError) => void
  className?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  emailVerified: boolean
  createdAt: string
}

export interface AuthError {
  code: string
  message: string
  field?: string
}

const AuthForms: React.FC<AuthFormsProps> = ({
  initialMode = 'login',
  onSuccess,
  onError,
  className = ''
}) => {
  const [currentMode, setCurrentMode] = useState(initialMode)
  const [emailForReset, setEmailForReset] = useState('')
  const [resetToken, setResetToken] = useState('')

  const {
    login,
    register,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    socialLogin,
    isLoading,
    errors
  } = useAuthForms()

  const handleModeChange = (mode: typeof currentMode) => {
    setCurrentMode(mode)
  }

  const handleLogin = async (data: LoginData) => {
    try {
      const user = await login(data)
      onSuccess?.(user)
    } catch (error) {
      onError?.(error as AuthError)
    }
  }

  const handleRegister = async (data: RegisterData) => {
    try {
      const user = await register(data)
      setCurrentMode('verify')
      onSuccess?.(user)
    } catch (error) {
      onError?.(error as AuthError)
    }
  }

  const handleForgotPassword = async (email: string) => {
    try {
      await requestPasswordReset(email)
      setEmailForReset(email)
      setCurrentMode('reset')
    } catch (error) {
      onError?.(error as AuthError)
    }
  }

  const handleResetPassword = async (data: ResetPasswordData) => {
    try {
      await resetPassword({ ...data, token: resetToken })
      setCurrentMode('login')
    } catch (error) {
      onError?.(error as AuthError)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      const user = await socialLogin(provider)
      onSuccess?.(user)
    } catch (error) {
      onError?.(error as AuthError)
    }
  }

  return (
    <div className={`${styles.authContainer} ${className}`}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            {currentMode === 'login' && 'Iniciar Sesión'}
            {currentMode === 'register' && 'Crear Cuenta'}
            {currentMode === 'forgot' && 'Recuperar Contraseña'}
            {currentMode === 'reset' && 'Nueva Contraseña'}
            {currentMode === 'verify' && 'Verificar Email'}
          </h1>
        </div>

        <div className={styles.authContent}>
          <AnimatePresence mode="wait">
            {currentMode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm
                  onSubmit={handleLogin}
                  onForgotPassword={() => handleModeChange('forgot')}
                  isLoading={isLoading}
                  error={errors.login}
                />

                <div className={styles.authDivider}>
                  <span>o</span>
                </div>

                <SocialAuthButtons
                  onSocialLogin={handleSocialLogin}
                  disabled={isLoading}
                />

                <div className={styles.authFooter}>
                  <p>
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeChange('register')}
                      className={styles.authLink}
                    >
                      Regístrate
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {currentMode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterForm
                  onSubmit={handleRegister}
                  isLoading={isLoading}
                  error={errors.register}
                />

                <div className={styles.authFooter}>
                  <p>
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeChange('login')}
                      className={styles.authLink}
                    >
                      Inicia sesión
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {currentMode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ForgotPasswordForm
                  onSubmit={handleForgotPassword}
                  isLoading={isLoading}
                  error={errors.forgotPassword}
                />

                <div className={styles.authFooter}>
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className={styles.authLink}
                  >
                    ← Volver al login
                  </button>
                </div>
              </motion.div>
            )}

            {currentMode === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ResetPasswordForm
                  email={emailForReset}
                  onSubmit={handleResetPassword}
                  isLoading={isLoading}
                  error={errors.resetPassword}
                />
              </motion.div>
            )}

            {currentMode === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EmailVerification
                  onResend={() => verifyEmail()}
                  onVerified={() => setCurrentMode('login')}
                  isLoading={isLoading}
                  error={errors.verifyEmail}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthForms
```

### LoginForm

```typescript
// modules/auth-forms/components/LoginForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { loginSchema } from '../utils/validationRules'
import FormField from './FormField'
import styles from '../styles/forms.css'

interface LoginFormProps {
  onSubmit: (data: LoginData) => void
  onForgotPassword: () => void
  isLoading: boolean
  error?: AuthError
}

export interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  isLoading,
  error
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.authForm}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {error && (
        <motion.div
          className={styles.errorAlert}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error.message}
        </motion.div>
      )}

      <FormField
        label="Email"
        type="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <FormField
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className={styles.formOptions}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            {...register('rememberMe')}
          />
          <span>Recordarme</span>
        </label>

        <button
          type="button"
          onClick={onForgotPassword}
          className={styles.forgotLink}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <motion.button
        type="submit"
        className={`${styles.submitButton} ${!isValid ? styles.disabled : ''}`}
        disabled={!isValid || isLoading}
        whileHover={!isLoading && isValid ? { scale: 1.02 } : {}}
        whileTap={!isLoading && isValid ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner} />
        ) : (
          'Iniciar Sesión'
        )}
      </motion.button>
    </motion.form>
  )
}

export default LoginForm
```

### RegisterForm

```typescript
// modules/auth-forms/components/RegisterForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { registerSchema } from '../utils/validationRules'
import FormField from './FormField'
import styles from '../styles/forms.css'

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void
  isLoading: boolean
  error?: AuthError
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  acceptMarketing: boolean
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  })

  const password = watch('password')

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.authForm}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {error && (
        <motion.div
          className={styles.errorAlert}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error.message}
        </motion.div>
      )}

      <FormField
        label="Nombre completo"
        type="text"
        placeholder="Tu nombre"
        error={errors.name?.message}
        {...register('name')}
      />

      <FormField
        label="Email"
        type="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <FormField
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <FormField
        label="Confirmar contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div className={styles.formOptions}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            {...register('acceptTerms')}
          />
          <span>
            Acepto los{' '}
            <a href="/terms" className={styles.link}>
              términos y condiciones
            </a>
          </span>
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            {...register('acceptMarketing')}
          />
          <span>Recibir ofertas y novedades</span>
        </label>
      </div>

      <motion.button
        type="submit"
        className={`${styles.submitButton} ${!isValid ? styles.disabled : ''}`}
        disabled={!isValid || isLoading}
        whileHover={!isLoading && isValid ? { scale: 1.02 } : {}}
        whileTap={!isLoading && isValid ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner} />
        ) : (
          'Crear Cuenta'
        )}
      </motion.button>
    </motion.form>
  )
}

export default RegisterForm
```

## 🎣 Hooks Personalizados

### useAuthForms

```typescript
// modules/auth-forms/hooks/useAuthForms.ts
import { useState } from 'react'
import { useLogin } from './useLogin'
import { useRegister } from './useRegister'
import { usePasswordReset } from './usePasswordReset'
import { useFormValidation } from './useFormValidation'

export const useAuthForms = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    login: null,
    register: null,
    forgotPassword: null,
    resetPassword: null,
    verifyEmail: null
  })

  const { login } = useLogin()
  const { register } = useRegister()
  const { requestPasswordReset, resetPassword } = usePasswordReset()
  const { validateForm } = useFormValidation()

  const clearErrors = () => {
    setErrors({
      login: null,
      register: null,
      forgotPassword: null,
      resetPassword: null,
      verifyEmail: null
    })
  }

  const handleAsyncOperation = async (operation: () => Promise<any>, errorType: keyof typeof errors) => {
    setIsLoading(true)
    clearErrors()

    try {
      const result = await operation()
      return result
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [errorType]: error
      }))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (data: LoginData) => {
    return handleAsyncOperation(
      () => login(data),
      'login'
    )
  }

  const handleRegister = async (data: RegisterData) => {
    return handleAsyncOperation(
      () => register(data),
      'register'
    )
  }

  const handleRequestPasswordReset = async (email: string) => {
    return handleAsyncOperation(
      () => requestPasswordReset(email),
      'forgotPassword'
    )
  }

  const handleResetPassword = async (data: ResetPasswordData) => {
    return handleAsyncOperation(
      () => resetPassword(data),
      'resetPassword'
    )
  }

  const handleVerifyEmail = async (token: string) => {
    return handleAsyncOperation(
      () => verifyEmail(token),
      'verifyEmail'
    )
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    return handleAsyncOperation(
      () => socialLogin(provider),
      'login'
    )
  }

  return {
    login: handleLogin,
    register: handleRegister,
    requestPasswordReset: handleRequestPasswordReset,
    resetPassword: handleResetPassword,
    verifyEmail: handleVerifyEmail,
    socialLogin: handleSocialLogin,
    isLoading,
    errors,
    clearErrors
  }
}
```

### useFormValidation

```typescript
// modules/auth-forms/hooks/useFormValidation.ts
import { useCallback } from 'react'
import { z } from 'zod'

export const useFormValidation = () => {
  const validateField = useCallback((schema: z.ZodSchema, value: any) => {
    try {
      schema.parse(value)
      return { isValid: true, error: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || 'Error de validación'
        }
      }
      return { isValid: false, error: 'Error desconocido' }
    }
  }, [])

  const validateForm = useCallback((schema: z.ZodSchema, data: any) => {
    try {
      schema.parse(data)
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        return { isValid: false, errors: fieldErrors }
      }
      return { isValid: false, errors: { general: 'Error de validación' } }
    }
  }, [])

  return {
    validateField,
    validateForm
  }
}
```

## 🎨 Estilos del Módulo

### auth.module.css

```css
/* modules/auth-forms/styles/auth.module.css */
.authContainer {
  @apply min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4;
}

.authCard {
  @apply bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden;
}

.authHeader {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white;
}

.authTitle {
  @apply text-2xl font-bold text-center;
}

.authContent {
  @apply p-6;
}

.authDivider {
  @apply relative my-6;
}

.authDivider::before {
  @apply absolute inset-0 flex items-center;
  content: '';
}

.authDivider::before {
  @apply border-t border-gray-300;
}

.authDivider span {
  @apply relative bg-white px-4 text-sm text-gray-500;
}

.authFooter {
  @apply text-center mt-6;
}

.authLink {
  @apply text-blue-600 hover:text-blue-800 font-medium transition-colors;
}
```

### forms.css

```css
/* modules/auth-forms/styles/forms.css */
.authForm {
  @apply space-y-4;
}

.errorAlert {
  @apply bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm;
}

.formField {
  @apply space-y-2;
}

.formLabel {
  @apply block text-sm font-medium text-gray-700;
}

.formInput {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.formInput.error {
  @apply border-red-300 focus:ring-red-500 focus:border-red-500;
}

.fieldError {
  @apply text-red-600 text-sm mt-1;
}

.formOptions {
  @apply flex items-center justify-between;
}

.checkbox {
  @apply flex items-center space-x-2 text-sm;
}

.checkbox input {
  @apply rounded border-gray-300 text-blue-600 focus:ring-blue-500;
}

.forgotLink {
  @apply text-blue-600 hover:text-blue-800 text-sm font-medium;
}

.submitButton {
  @apply w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200;
}

.submitButton.disabled {
  @apply bg-gray-300 cursor-not-allowed hover:bg-gray-300;
}

.loadingSpinner {
  @apply inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin;
}
```

## 🔧 Utilidades

### validationRules.ts

```typescript
// modules/auth-forms/utils/validationRules.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rememberMe: z.boolean().optional()
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  confirmPassword: z.string(),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones'),
  acceptMarketing: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export const emailVerificationSchema = z.object({
  code: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos')
    .regex(/^\d{6}$/, 'El código debe contener solo números')
})
```

### authHelpers.ts

```typescript
// modules/auth-forms/utils/authHelpers.ts
import { AuthError } from '../types/auth'

export const handleAuthError = (error: any): AuthError => {
  // Mapeo de errores comunes
  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'El email ya está registrado',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/invalid-email': 'Email inválido',
    'auth/user-disabled': 'Cuenta deshabilitada',
    'auth/too-many-requests': 'Demasiados intentos, intenta más tarde',
    'auth/network-request-failed': 'Error de conexión',
    'auth/requires-recent-login': 'Debes iniciar sesión nuevamente'
  }

  const code = error.code || 'auth/unknown-error'
  const message = errorMap[code] || error.message || 'Error desconocido'

  return {
    code,
    message,
    field: getFieldFromError(code)
  }
}

const getFieldFromError = (code: string): string | undefined => {
  const fieldMap: Record<string, string> = {
    'auth/invalid-email': 'email',
    'auth/email-already-in-use': 'email',
    'auth/weak-password': 'password',
    'auth/wrong-password': 'password'
  }

  return fieldMap[code]
}

export const validatePasswordStrength = (password: string): {
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Usa al menos 8 caracteres')
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Agrega letras minúsculas')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Agrega letras mayúsculas')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Agrega números')
  }

  if (/[^a-zA-Z\d]/.test(password)) {
    score += 1
  } else {
    feedback.push('Agrega caracteres especiales')
  }

  return { score, feedback }
}

export const generateSecurePassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'

  const allChars = lowercase + uppercase + numbers + symbols
  let password = ''

  // Asegurar al menos un caracter de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Completar hasta 12 caracteres
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Mezclar los caracteres
  return password.split('').sort(() => Math.random() - 0.5).join('')
}
```

## 📋 Tipos TypeScript

### auth.ts

```typescript
// modules/auth-forms/types/auth.ts
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  emailVerified: boolean
  createdAt: string
  lastLogin?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  language: string
  currency: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  dataSharing: boolean
  analytics: boolean
}

export interface AuthError {
  code: string
  message: string
  field?: string
  details?: any
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  acceptMarketing?: boolean
}

export interface ResetPasswordData {
  password: string
  confirmPassword: string
  token: string
}

export interface SocialAuthProvider {
  id: 'google' | 'facebook' | 'github' | 'twitter'
  name: string
  icon: string
  color: string
}
```

### forms.ts

```typescript
// modules/auth-forms/types/forms.ts
export interface FormFieldProps {
  label: string
  type: 'text' | 'email' | 'password' | 'tel' | 'url'
  placeholder?: string
  value?: string
  error?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
}

export interface FormState {
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
  validator?: (value: any) => boolean
}

export interface FormConfig {
  fields: FormFieldConfig[]
  validation: 'onChange' | 'onBlur' | 'onSubmit'
  submitOnEnter?: boolean
  resetOnSubmit?: boolean
}

export interface FormFieldConfig {
  name: string
  label: string
  type: FormFieldProps['type']
  placeholder?: string
  validation: ValidationRule[]
  autoComplete?: string
  defaultValue?: any
}
```

## 🧪 Testing

### Tests de Validación

```typescript
// modules/auth-forms/__tests__/validationRules.test.ts
import { loginSchema, registerSchema, resetPasswordSchema } from '../utils/validationRules'

describe('Validation Rules', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      }

      expect(() => loginSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      }

      expect(() => loginSchema.parse(invalidData)).toThrow()
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123'
      }

      expect(() => loginSchema.parse(invalidData)).toThrow()
    })
  })

  describe('registerSchema', () => {
    it('should validate correct register data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        acceptTerms: true,
        acceptMarketing: false
      }

      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
        acceptTerms: true
      }

      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    it('should reject unaccepted terms', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        acceptTerms: false
      }

      expect(() => registerSchema.parse(invalidData)).toThrow()
    })
  })

  describe('resetPasswordSchema', () => {
    it('should validate correct reset password data', () => {
      const validData = {
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!'
      }

      expect(() => resetPasswordSchema.parse(validData)).not.toThrow()
    })

    it('should reject weak password', () => {
      const invalidData = {
        password: 'weak',
        confirmPassword: 'weak'
      }

      expect(() => resetPasswordSchema.parse(invalidData)).toThrow()
    })
  })
})
```

## 🚀 Integración

### Uso en la Aplicación

```typescript
// src/components/AuthModal.tsx
import AuthForms from '@/modules/auth-forms'

const AuthModal = ({ isOpen, onClose, initialMode }) => {
  const handleAuthSuccess = (user) => {
    // Guardar usuario en contexto global
    // Cerrar modal
    // Redirigir a dashboard
  }

  const handleAuthError = (error) => {
    // Mostrar notificación de error
    console.error('Auth error:', error)
  }

  if (!isOpen) return null

  return (
    <AuthForms
      initialMode={initialMode}
      onSuccess={handleAuthSuccess}
      onError={handleAuthError}
    />
  )
}
```

## 📝 Notas Importantes

- **Seguridad**: Validación robusta y sanitización de inputs
- **UX**: Transiciones suaves y feedback visual
- **Accesibilidad**: Navegación por teclado completa
- **Responsive**: Diseño adaptativo para móviles
- **i18n**: Soporte para múltiples idiomas
- **Analytics**: Tracking de conversiones de registro

## 🔄 Próximas Mejoras

- [ ] Autenticación biométrica (Face ID, Touch ID)
- [ ] Magic links para login sin contraseña
- [ ] Integración con wallets cripto
- [ ] Verificación de teléfono
- [ ] Autenticación multifactor (2FA)
- [ ] Single Sign-On (SSO) empresarial
