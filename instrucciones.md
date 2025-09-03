# 📚 Caminando Online - Plataforma de Comparación de Precios de Supermercados Argentinos

## 🎯 OBJETIVO PRINCIPAL

Desarrollar una plataforma web moderna y responsive de comparación de precios de supermercados argentinos que permita a los usuarios comparar productos en tiempo real, encontrar los mejores precios y optimizar sus compras. La plataforma se enfocará en 5 cadenas principales: Carrefour, Disco, Jumbo, Día y Vea.

### Funcionalidades Clave:
- **🔍 Comparación Inteligente**: Mostrar el mejor precio por producto entre los 5 supermercados
- **💰 Cálculo de Ahorro**: Calcular automáticamente el ahorro total y porcentual
- **🛒 Compra Unificada**: Facilitar compras combinadas entre supermercados
- **🔗 Vinculación de Cuentas**: Conectar cuentas de supermercados para una experiencia personalizada
- **🤖 Scraping Automatizado**: Actualización diaria de precios mediante web scraping (sin APIs oficiales)

## 👤 PERFIL DEL DESARROLLADOR

- **Nombre**: Juan
- **Nivel Técnico**: Básico
- **Necesidad**: Acompañamiento técnico completo y detallado
- **Herramientas**: GitHub para control de versiones

## � SISTEMA DE NOMENCLATURA DE VERSIONADO

### 🎯 Formato de Commits
```
[tipo/]v[MAJOR].[MINOR].[PATCH]: Descripción del cambio
```

### 📋 Tipos de Cambios
- **`feat/`** - Nueva funcionalidad
- **`fix/`** - Corrección de bugs
- **`refactor/`** - Refactorización de código
- **`docs/`** - Cambios en documentación
- **`style/`** - Cambios de estilo/formato
- **`test/`** - Cambios en tests
- **`chore/`** - Cambios de mantenimiento

### 🔢 Versionado Semántico
- **`MAJOR`** - Cambios incompatibles (breaking changes)
- **`MINOR`** - Nuevas funcionalidades compatibles
- **`PATCH`** - Correcciones de bugs y mejoras menores

### 💡 Ejemplos Prácticos
```
feat/v1.0.0: Implementar menú desplegable jerárquico
fix/v1.0.1: Corregir subfiltros dinámicos
refactor/v1.1.0: Optimizar rendimiento de filtros
docs/v1.1.1: Actualizar documentación de API
chore/v1.1.2: Actualizar dependencias de seguridad
```

### 🎯 Beneficios
- **📍 Referenciación fácil**: "Vuelve a v1.0.0" o "Avanza a v1.1.0"
- **📊 Seguimiento de progreso**: Identificar claramente el estado del proyecto
- **🔄 Reversión controlada**: Poder revertir a versiones específicas
- **📈 Historial organizado**: Commits categorizados por tipo de cambio

### 📊 Estado Actual del Proyecto
- **Versión actual**: v1.0.0
- **Último commit**: `feat/v1.0.0: Implementar subfiltros dinámicos basados en tipo de producto`
- **Rama principal**: `checkpoints`

## �📖 DOCUMENTACIÓN TÉCNICA COMPLETA

> [!IMPORTANT]
> **📚 Documentación Principal**: Consulta `docs/README.md` para visión general completa
> **🛠️ Guía de Inicio**: Lee `docs/README.md` para setup y primeros pasos

### 📋 Documentos Técnicos Disponibles

| Documento | Descripción | Ubicación |
|-----------|-------------|-----------|
| **� README Principal** | Arquitectura, tecnologías, instalación | `docs/README.md` |
| **🎨 Frontend** | Next.js, componentes, UI/UX | `docs/secciones/frontend.md` |
| **⚙️ Backend** | Node.js, Express, API REST | `docs/secciones/backend.md` |
| **🗄️ Base de Datos** | PostgreSQL, MongoDB, esquemas | `docs/secciones/database.md` |
| **🕷️ Web Scraping** | Puppeteer, estrategias, automatización | `docs/secciones/scraping.md` |
| **🔐 Autenticación** | JWT, OAuth, seguridad | `docs/secciones/autenticacion.md` |
| **🚀 Despliegue** | Docker, Kubernetes, CI/CD | `docs/secciones/despliegue.md` |
| **📡 API Reference** | Endpoints, requests, responses | `docs/secciones/api.md` |

### 🚀 Inicio Rápido

```bash
# 1. Leer documentación principal
cat docs/README.md

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
cp .env.example .env.local

# 4. Iniciar desarrollo
npm run dev
```

## �🏗️ ARQUITECTURA GENERAL

### Arquitectura de Alto Nivel

```
Caminando Online/
├── 🎨 Frontend/           # Next.js + TypeScript + Tailwind
├── ⚙️ Backend/           # Node.js + Express + TypeScript
├── 🗄️ Database/          # PostgreSQL + MongoDB + Redis
├── 🕷️ Scraping/          # Puppeteer + Cheerio
└── 🚀 DevOps/            # Docker + Kubernetes + CI/CD
```

### Tecnologías Principales

#### Frontend
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript para type safety
- **Estilos**: Tailwind CSS con diseño mobile-first
- **Estado**: React Query para server state
- **Formularios**: React Hook Form con validación

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js con TypeScript
- **Base de Datos**: PostgreSQL (relacional) + MongoDB (productos)
- **Cache**: Redis para sesiones y datos
- **Autenticación**: JWT con refresh tokens
- **Scraping**: Puppeteer/Cheerio para web scraping

#### DevOps
- **Contenedorización**: Docker + Docker Compose
- **Orquestación**: Kubernetes para producción
- **CI/CD**: GitHub Actions
- **Monitoreo**: Prometheus + Grafana
- **Infraestructura**: Terraform + AWS/GCP

## 📱 FLUJOS DE USUARIO PRINCIPALES

### 1. Flujo de Comparación de Productos

```
Usuario llega a index →
Selecciona supermercados (5 por defecto) →
Aplica filtros (categoría → subcategoría → tipo) →
Selecciona productos en tabla-productos →
Agrega a tabla productos-a-comparar →
Click "Comparar Productos" →
Ve resultados en /productos-comparados
```

### 2. Flujo de Vinculación de Cuentas

```
Usuario se registra/loguea →
Va a Dashboard →
Vincula cuentas de supermercados →
Sistema scrapea datos personales →
Mejora recomendaciones y experiencia
```

## 🎨 REQUISITOS DE DISEÑO

- **Profesional y Moderno**: Interfaz limpia y intuitiva
- **Responsive**: Optimizado para mobile (app mobile futura)
- **Accesible**: Cumple estándares de accesibilidad web
- **Performance**: Carga rápida y navegación fluida

## 🔧 FUNCIONALIDADES DETALLADAS

### Sección "Elegir Supermercados"
- 5 logos de supermercados (Carrefour, Disco, Jumbo, Día, Vea)
- Todos seleccionados por defecto
- Click para deseleccionar (logo en blanco y negro)
- Estado visual claro de selección

### Sección "Filtros"
- **Categorías**: Menú desplegable con categorías principales
  - Bebidas, Almacén, Limpieza, etc.
- **Subcategorías**: Se habilita al seleccionar categoría
  - Gaseosas, Aceites, Detergentes, etc.
- **Tipos de Producto**: Se habilita al seleccionar subcategoría
  - "Gaseosas de litro", "Aceites de girasol", etc.
- **Subfiltros Dinámicos**: Aparecen al seleccionar tipo
  - Marca, Variedad, Envase, Tamaño, etc.
- **Botón Reset**: Limpia todos los filtros

### Sección "Tabla Productos"
- Lista productos del tipo seleccionado
- Columnas: Nombre, Marca, Variedad, Envase, Tamaño, etc.
- Animación al hover/click para indicar selección
- Estado visual de productos seleccionados
- Click agrega a "productos-a-comparar"

### Sección "Productos a Comparar"
- Lista productos seleccionados
- Contador de unidades por producto
- Botón eliminar por producto
- Botón "Eliminar Todos"
- Botón "Comparar Productos" → navega a /productos-comparados

### Página "Productos Comparados"
- **Botón "Volver Atrás"**: Regresa sin perder selección
- **Tabla Comparativa**:
  - Columna: Nombre producto
  - Columnas: Precio por supermercado
  - Resaltado: Mejor precio
  - Columna "Caminando Online": Mejor precio con fuente
- **Sección Resultados Totales**:
  - Suma total por supermercado
  - Total "Caminando Online" (lógica de preferencia)
- **Mensaje de Ahorro**:
  - "¡Felicitaciones! Estás ahorrando $X (Y% menos)"
- **Botón "Compra Caminando"**: Deshabilitado temporalmente

## 🔄 SISTEMA DE SCRAPING

### Programación
- **Frecuencia**: Una vez al día a las 9:00 AM
- **Alcance**: Precios y productos de los 5 supermercados
- **Almacenamiento**: MongoDB con historial de precios

### Tecnologías de Scraping
- **Puppeteer**: Para sitios con JavaScript
- **Cheerio**: Para parsing HTML
- **MongoDB**: Almacenamiento de datos scrapeados

### Estructura de Datos
```javascript
{
  producto: {
    nombre: String,
    marca: String,
    categoria: String,
    supermercado: String,
    precio: Number,
    fecha_scraping: Date,
    url_imagen: String
  }
}
```

## 👥 ENTORNOS DEL FRONTEND

### Entorno Público
- **Index**: Página principal con comparación
- **Productos Comparados**: Resultados de comparación

### Entorno Privado (Requiere Login)
- **Dashboard**: Panel principal del usuario
- **Vinculación Supermercados**: Conectar cuentas
- **Análisis Compras**: Historial y estadísticas
- **Panel de Control**: Configuración de cuenta

### Entorno Operativos
- **TOS**: Términos de Servicio
- **404**: Página de error
- **Contacto**: Formulario de contacto
- **FAQ**: Preguntas frecuentes

## 🔐 AUTENTICACIÓN Y SEGURIDAD

### Sistema de Usuarios
- Registro con email/verificación
- Login con JWT
- Recuperación de contraseña
- Vinculación de cuentas de supermercados

### Seguridad de Scraping
- Rate limiting para evitar bloqueos
- User agents rotativos
- Manejo de CAPTCHAs
- Almacenamiento seguro de credenciales

## 📊 ANÁLISIS Y REPORTES

### Dashboard de Usuario
- Historial de compras
- Ahorro total acumulado
- Supermercados más usados
- Productos favoritos

### Métricas del Sistema
- Número de usuarios activos
- Productos más comparados
- Tasa de conversión
- Rendimiento del scraping

## 🚀 DEPLOYMENT Y ESCALABILIDAD

### Infraestructura
- **Frontend**: Vercel/Netlify para hosting estático
- **Backend**: Heroku/Railway para Node.js
- **Database**: MongoDB Atlas
- **Scraping**: VPS dedicado con cron jobs

### Dominio
- **URL**: https://caminando.online
- **SSL**: Certificado válido
- **CDN**: Para assets estáticos

## � PLAN DE DESARROLLO

### Fase 1: MVP (1-2 meses)
- [ ] Estructura base Frontend/Backend
- [ ] Sistema de scraping básico
- [ ] Página index con comparación simple
- [ ] Autenticación básica

### Fase 2: Funcionalidades Core (2-3 meses)
- [ ] Filtros avanzados
- [ ] Sistema de comparación completo
- [ ] Dashboard de usuario
- [ ] Vinculación de cuentas

### Fase 3: Optimización (1 mes)
- [ ] Mobile app
- [ ] Optimización de performance
- [ ] Analytics avanzado
- [ ] Sistema de notificaciones

## ⚠️ LIMITACIONES Y CONSIDERACIONES

### Limitaciones Técnicas
- **Sin APIs Oficiales**: Dependencia total de web scraping
- **Cambio de Sitios**: Riesgo de cambios en estructura web
- **Rate Limiting**: Posibles bloqueos por scraping intensivo

### Consideraciones Legales
- **Términos de Servicio**: Cumplir con TOS de supermercados
- **Derechos de Autor**: No copiar contenido protegido
- **Privacidad**: Manejo seguro de datos de usuarios

### Riesgos
- **Bloqueos de IP**: Supermercados pueden bloquear scrapers
- **Cambios en Precios**: Precios pueden cambiar durante el día
- **Disponibilidad**: Productos pueden agotarse

## 📞 SOPORTE Y MANTENIMIENTO

### Monitoreo
- **Uptime**: Monitoreo 24/7 del sitio
- **Performance**: Métricas de carga y respuesta
- **Errores**: Logging de errores del sistema

### Actualizaciones
- **Scraping**: Actualización diaria de datos
- **Sistema**: Deployments semanales
- **Seguridad**: Parches de seguridad mensuales

---

## 🔗 REFERENCIAS A DOCUMENTACIÓN TÉCNICA

| Sección | Documento Técnico | Estado |
|---------|-------------------|--------|
| **Arquitectura General** | `docs/README.md` | ✅ Completo |
| **Frontend Detallado** | `docs/secciones/frontend.md` | ✅ Completo |
| **Backend y API** | `docs/secciones/backend.md` + `docs/secciones/api.md` | ✅ Completo |
| **Base de Datos** | `docs/secciones/database.md` | ✅ Completo |
| **Sistema de Scraping** | `docs/secciones/scraping.md` | ✅ Completo |
| **Autenticación** | `docs/secciones/autenticacion.md` | ✅ Completo |
| **Despliegue** | `docs/secciones/despliegue.md` | ✅ Completo |

### 📚 Próximos Pasos Recomendados

1. **📖 Leer documentación principal**: `docs/README.md`
2. **🛠️ Configurar entorno**: Seguir guía de instalación
3. **🎨 Familiarizarse con frontend**: `docs/secciones/frontend.md`
4. **⚙️ Entender backend**: `docs/secciones/backend.md`
5. **📡 Revisar API**: `docs/secciones/api.md`
6. **🚀 Planear despliegue**: `docs/secciones/despliegue.md`

---

*📅 Documento original: Septiembre 2025*
*🔄 Última actualización: Enero 2024*
*📚 Documentación técnica completa agregada*

```
Usuario llega a index →
Selecciona supermercados (5 por defecto) →
Aplica filtros (categoría → subcategoría → tipo) →
Selecciona productos en tabla-productos →
Agrega a tabla productos-a-comparar →
Click "Comparar Productos" →
Ve resultados en /productos-comparados
```

### 2. Flujo de Vinculación de Cuentas

```
Usuario se registra/loguea →
Va a Dashboard →
Vincula cuentas de supermercados →
Sistema scrapea datos personales →
Mejora recomendaciones y experiencia
```

## 🎨 REQUISITOS DE DISEÑO

- **Profesional y Moderno**: Interfaz limpia y intuitiva
- **Responsive**: Optimizado para mobile (app mobile futura)
- **Accesible**: Cumple estándares de accesibilidad web
- **Performance**: Carga rápida y navegación fluida

## 🔧 FUNCIONALIDADES DETALLADAS

### Sección "Elegir Supermercados"
- 5 logos de supermercados (Carrefour, Disco, Jumbo, Día, Vea)
- Todos seleccionados por defecto
- Click para deseleccionar (logo en blanco y negro)
- Estado visual claro de selección

### Sección "Filtros"
- **Categorías**: Menú desplegable con categorías principales
  - Bebidas, Almacén, Limpieza, etc.
- **Subcategorías**: Se habilita al seleccionar categoría
  - Gaseosas, Aceites, Detergentes, etc.
- **Tipos de Producto**: Se habilita al seleccionar subcategoría
  - "Gaseosas de litro", "Aceites de girasol", etc.
- **Subfiltros Dinámicos**: Aparecen al seleccionar tipo
  - Marca, Variedad, Envase, Tamaño, etc.
- **Botón Reset**: Limpia todos los filtros

### Sección "Tabla Productos"
- Lista productos del tipo seleccionado
- Columnas: Nombre, Marca, Variedad, Envase, Tamaño, etc.
- Animación al hover/click para indicar selección
- Estado visual de productos seleccionados
- Click agrega a "productos-a-comparar"

### Sección "Productos a Comparar"
- Lista productos seleccionados
- Contador de unidades por producto
- Botón eliminar por producto
- Botón "Eliminar Todos"
- Botón "Comparar Productos" → navega a /productos-comparados

### Página "Productos Comparados"
- **Botón "Volver Atrás"**: Regresa sin perder selección
- **Tabla Comparativa**:
  - Columna: Nombre producto
  - Columnas: Precio por supermercado
  - Resaltado: Mejor precio
  - Columna "Caminando Online": Mejor precio con fuente
- **Sección Resultados Totales**:
  - Suma total por supermercado
  - Total "Caminando Online" (lógica de preferencia)
- **Mensaje de Ahorro**:
  - "¡Felicitaciones! Estás ahorrando $X (Y% menos)"
- **Botón "Compra Caminando"**: Deshabilitado temporalmente

## 🔄 SISTEMA DE SCRAPING

### Programación
- **Frecuencia**: Una vez al día a las 9:00 AM
- **Alcance**: Precios y productos de los 5 supermercados
- **Almacenamiento**: MongoDB con historial de precios

### Tecnologías de Scraping
- **Puppeteer**: Para sitios con JavaScript
- **Cheerio**: Para parsing HTML
- **MongoDB**: Almacenamiento de datos scrapeados

### Estructura de Datos
```javascript
{
  producto: {
    nombre: String,
    marca: String,
    categoria: String,
    supermercado: String,
    precio: Number,
    fecha_scraping: Date,
    url_imagen: String
  }
}
```

## 👥 ENTORNOS DEL FRONTEND

### Entorno Público
- **Index**: Página principal con comparación
- **Productos Comparados**: Resultados de comparación

### Entorno Privado (Requiere Login)
- **Dashboard**: Panel principal del usuario
- **Vinculación Supermercados**: Conectar cuentas
- **Análisis Compras**: Historial y estadísticas
- **Panel de Control**: Configuración de cuenta

### Entorno Operativos
- **TOS**: Términos de Servicio
- **404**: Página de error
- **Contacto**: Formulario de contacto
- **FAQ**: Preguntas frecuentes

## 🔐 AUTENTICACIÓN Y SEGURIDAD

### Sistema de Usuarios
- Registro con email/verificación
- Login con JWT
- Recuperación de contraseña
- Vinculación de cuentas de supermercados

### Seguridad de Scraping
- Rate limiting para evitar bloqueos
- User agents rotativos
- Manejo de CAPTCHAs
- Almacenamiento seguro de credenciales

## 📊 ANÁLISIS Y REPORTES

### Dashboard de Usuario
- Historial de compras
- Ahorro total acumulado
- Supermercados más usados
- Productos favoritos

### Métricas del Sistema
- Número de usuarios activos
- Productos más comparados
- Tasa de conversión
- Rendimiento del scraping

## 🚀 DEPLOYMENT Y ESCALABILIDAD

### Infraestructura
- **Frontend**: Vercel/Netlify para hosting estático
- **Backend**: Heroku/Railway para Node.js
- **Database**: MongoDB Atlas
- **Scraping**: VPS dedicado con cron jobs

### Dominio
- **URL**: https://caminando.online
- **SSL**: Certificado válido
- **CDN**: Para assets estáticos

## 📋 PLAN DE DESARROLLO

### Fase 1: MVP (1-2 meses)
- [ ] Estructura base Frontend/Backend
- [ ] Sistema de scraping básico
- [ ] Página index con comparación simple
- [ ] Autenticación básica

### Fase 2: Funcionalidades Core (2-3 meses)
- [ ] Filtros avanzados
- [ ] Sistema de comparación completo
- [ ] Dashboard de usuario
- [ ] Vinculación de cuentas

### Fase 3: Optimización (1 mes)
- [ ] Mobile app
- [ ] Optimización de performance
- [ ] Analytics avanzado
- [ ] Sistema de notificaciones

## ⚠️ LIMITACIONES Y CONSIDERACIONES

### Limitaciones Técnicas
- **Sin APIs Oficiales**: Dependencia total de web scraping
- **Cambio de Sitios**: Riesgo de cambios en estructura web
- **Rate Limiting**: Posibles bloqueos por scraping intensivo

### Consideraciones Legales
- **Términos de Servicio**: Cumplir con TOS de supermercados
- **Derechos de Autor**: No copiar contenido protegido
- **Privacidad**: Manejo seguro de datos de usuarios

### Riesgos
- **Bloqueos de IP**: Supermercados pueden bloquear scrapers
- **Cambios en Precios**: Precios pueden cambiar durante el día
- **Disponibilidad**: Productos pueden agotarse

## 📞 SOPORTE Y MANTENIMIENTO

### Monitoreo
- **Uptime**: Monitoreo 24/7 del sitio
- **Performance**: Métricas de carga y respuesta
- **Errores**: Logging de errores del sistema

### Actualizaciones
- **Scraping**: Actualización diaria de datos
- **Sistema**: Deployments semanales
- **Seguridad**: Parches de seguridad mensuales

---

*Documento creado: Septiembre 2025*
*Última actualización: Septiembre 2025*
