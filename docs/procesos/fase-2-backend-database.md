# Fase 2: Backend Core + Scraping Básico 🚧 EN PROGRESO

[Esta fase desarrolla el backend esencial del MVP más un sistema de scraping básico para 2-3 supermercados principales, permitiendo tener datos reales para las funcionalidades core.]

## 🎯 Objetivos de la Fase

- ✅ Crear API REST funcional para el MVP
- 🚧 Implementar scraping básico de 2-3 supermercados
- ✅ Configurar base de datos con datos reales
- 🚧 Establecer autenticación básica
- 🚧 Preparar datos para las funcionalidades del MVP

## 📋 Tareas Principales

### 2.1 API REST Básica para MVP ✅ COMPLETADA

#### Subtareas:
- **2.1.1** ✅ Configurar estructura base de la API
  - ✅ Middlewares esenciales (CORS, JSON parsing)
  - ✅ Estructura de respuestas consistente
  - ✅ Manejo básico de errores
  - ✅ Variables de entorno configuradas

- **2.1.2** ✅ Endpoints de productos para MVP
  - ✅ GET /api/products - Listado básico de productos
  - ✅ GET /api/products/search - Búsqueda simple
  - ✅ GET /api/products/categories - Categorías disponibles
  - ✅ POST /api/products/compare - Comparación de precios

- **2.1.3** ✅ Endpoints de supermercados
  - ✅ GET /api/supermarkets - Lista de supermercados activos
  - ✅ GET /api/supermarkets/:id/products - Productos por supermercado

- **2.1.4** ✅ Endpoints de comparación
  - ✅ POST /api/comparisons - Crear comparación
  - ✅ GET /api/comparisons/:id - Obtener resultados

### 2.2 Base de Datos para MVP ✅ COMPLETADA

#### Subtareas:
- **2.2.1** ✅ Configurar MongoDB
  - ✅ Conexión básica con Mongoose
  - ✅ Esquemas simples para productos y usuarios
  - ✅ Configuración de índices básicos

- **2.2.2** ✅ Esquemas de datos esenciales
  - ✅ Productos: nombre, precio, supermercado, categoría
  - ✅ Usuarios: email, nombre, contraseña
  - ✅ Comparaciones: productos, resultados, fecha

- **2.2.3** ✅ Poblar datos iniciales
  - ✅ Insertar datos de supermercados
  - ✅ Crear categorías básicas
  - ✅ Preparar estructura para datos scrapeados

### 2.3 Scraping Básico MVP: Categorías y Productos 🚧 EN DESARROLLO

#### Subtareas:
- **2.3.1** 🚧 Análisis de estructuras web de supermercados
  - 🚧 Mapear navegación por categorías de cada supermercado
  - 🚧 Identificar URLs de categorías principales
  - 🚧 Analizar estructura HTML de listados de productos
  - 🚧 Documentar patrones de paginación

- **2.3.2** 🚧 Scraper de categorías por supermercado
  - 🚧 Extraer lista completa de categorías disponibles
  - 🚧 Capturar nombres, URLs y jerarquía de categorías
  - 🚧 Almacenar categorías en base de datos
  - 🚧 Crear mapeo categoría-supermercado

- **2.3.3** 🚧 Scraper de productos por categoría
  - 🚧 Implementar navegación por categoría
  - 🚧 Extraer productos básicos: nombre, precio, imagen
  - 🚧 Manejar paginación automática
  - 🚧 Capturar información esencial por producto

- **2.3.4** 🚧 Procesamiento y almacenamiento de datos
  - 🚧 Normalizar datos de productos scrapeados
  - 🚧 Vincular productos con sus categorías
  - 🚧 Crear índices de búsqueda eficientes
  - 🚧 Generar estadísticas básicas de scraping

### 2.4 Procesamiento y Almacenamiento de Datos

#### Subtareas:
- **2.4.1** Estructura de datos por supermercado
  - Crear esquema de categorías por supermercado
  - Definir estructura de productos con referencias
  - Implementar relaciones categoría-producto
  - Configurar índices para búsquedas eficientes

- **2.4.2** Pipeline de procesamiento básico
  - Limpieza y normalización de nombres de productos
  - Validación de precios y formatos
  - Detección de productos duplicados
  - Asignación automática de categorías

- **2.4.3** Almacenamiento estructurado
  - Insertar categorías scrapeadas en base de datos
  - Almacenar productos con referencias a categorías
  - Mantener consistencia de datos
  - Generar estadísticas de cobertura por categoría

- **2.4.4** Script de actualización manual
  - Comando para ejecutar scraping completo
  - Opción de actualizar categorías específicas
  - Logging detallado de ejecución
  - Reportes de productos y categorías procesadas

### 2.5 Autenticación Básica

#### Subtareas:
- **2.5.1** Sistema de registro/login simple
  - Endpoint POST /api/auth/register
  - Endpoint POST /api/auth/login
  - Hash de contraseñas con bcrypt
  - Generación de JWT básica

- **2.5.2** Middleware de autenticación
  - Verificación de tokens JWT
  - Protección de rutas privadas
  - Extracción de usuario de token
  - Manejo de tokens expirados

- **2.5.3** Endpoints de usuario
  - GET /api/users/profile - Perfil básico
  - PUT /api/users/profile - Actualizar perfil
  - GET /api/users/comparisons - Historial de comparaciones

### 2.6 Servicios de Lógica de Negocio

#### Subtareas:
- **2.6.1** Servicio de comparación de precios
  - Lógica para comparar productos
  - Cálculo de mejores precios
  - Generación de resultados
  - Formato de respuesta para frontend

- **2.6.2** Servicio de búsqueda
  - Búsqueda por texto en productos
  - Filtros básicos por categoría
  - Ordenamiento por precio
  - Paginación simple

- **2.6.3** Servicio de usuarios
  - Gestión básica de perfiles
  - Historial de comparaciones
  - Preferencias simples

## 📊 Criterios de Aceptación

- ✅ API REST básica funcionando
- ✅ Base de datos con categorías y productos de 2-3 supermercados
- ✅ Scraping de categorías operativo
- ✅ Scraping de productos por categoría funcional
- ✅ Autenticación básica implementada
- ✅ Endpoints de comparación funcionales
- ✅ Servicios core probados

## 🔗 Dependencias

- Requiere: Fase 1 completada
- Debe completarse antes de iniciar Fase 3

## 📈 Métricas de Éxito

- API response time: < 500ms
- Categorías scrapeadas: > 50 por supermercado
- Productos scrapeados: > 1000 por supermercado
- Cobertura de categorías: > 80%
- Autenticación funcionando: 100%

## ⚠️ Riesgos y Mitigaciones

- **Riesgo**: Estructuras de navegación complejas
  - **Mitigación**: Enfoque en supermercados con navegación clara

- **Riesgo**: Cambios frecuentes en categorías
  - **Mitigación**: Sistema de detección de cambios básicos

- **Riesgo**: Datos de productos incompletos
  - **Mitigación**: Validaciones y reintentos automáticos

## 📋 Checklist de Verificación

- [ ] API endpoints básicos implementados
- [ ] Base de datos configurada con esquemas de categorías
- [ ] Scrapers de categorías funcionando para 2-3 supermercados
- [ ] Scrapers de productos por categoría operativos
- [ ] Pipeline de procesamiento de datos funcional
- [ ] Autenticación básica operativa
- [ ] Servicio de comparación funcional
- [ ] Servicio de búsqueda operativo
- [ ] Endpoints probados manualmente
- [ ] Datos estructurados disponibles para testing
