# 🛒 Caminando Online - MVP

Plataforma de comparación de precios de supermercados - **Estado Actual: Fase 1 ✅ COMPLETADA | Fase 2 🚧 EN PROGRESO | Fase 3 🚧 EN PROGRESO**

## 📊 Estado del Proyecto

### ✅ **Fase 1: Setup y Arquitectura MVP - COMPLETADA**
- ✅ Repositorio Git configurado y funcional
- ✅ Frontend Next.js con TypeScript inicializado
- ✅ Backend Express.js con TypeScript configurado
- ✅ Base de datos MongoDB conectada
- ✅ API REST completa implementada
- ✅ Estructura del index MVP completamente funcional

### 🚧 **Fase 2: Backend Core + Scraping - EN PROGRESO**
- ✅ API REST básica para MVP completada
- ✅ Base de datos para MVP completada
- 🚧 Scraping básico MVP en desarrollo

### 🚧 **Fase 3: Frontend MVP - EN PROGRESO**
- ✅ Index completamente funcional con comparación de precios
- ✅ Sistema de filtros jerárquico implementado
- ✅ Componentes modulares creados
- 🚧 Página de productos comparados pendiente
- 🚧 Dashboard básico pendiente

## 🎯 Funcionalidades Implementadas

### ✅ **Index Principal (Página de Comparación)**
- 🏪 **Selector de Supermercados**: 5 logos (Carrefour, Disco, Jumbo, Dia, Vea) con estados visuales
- � **Sistema de Filtros Jerárquico**:
  - Categorías → Subcategorías → Tipos de producto
  - Subfiltros dinámicos (Marca, Variedad, Envase, Tamaño)
  - Botón de resetear filtros
- 📊 **Tabla de Productos**: Lista interactiva con selección de productos
- 🛒 **Carrito de Comparación**:
  - Contadores de unidades (+/-)
  - Eliminación individual y global
  - Cálculo de totales
  - Botón "Comparar Productos"

### ✅ **API REST Completa**
- `GET /api/products` - Listado de productos
- `GET /api/products/search` - Búsqueda avanzada
- `GET /api/products/categories` - Categorías disponibles
- `POST /api/products/compare` - Comparación específica
- `GET /api/supermarkets` - Lista de supermercados
- `GET /api/supermarkets/:id/products` - Productos por supermercado
- `POST /api/comparisons` - Crear comparación
- `GET /api/comparisons/:id` - Obtener comparación específica

### ✅ **Arquitectura Técnica**
- 🎨 **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- ⚙️ **Backend**: Express.js + TypeScript + MongoDB + Mongoose
- 🔧 **Middlewares**: CORS, JSON parsing, respuestas consistentes
- 📱 **Responsive**: Diseño adaptable a móviles y desktop
- 🎭 **Componentes**: Arquitectura modular y reutilizable

## �🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- MongoDB (local o Atlas)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Jumadominguez/caminandovs.git
   cd caminando-online
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copiar `.env.example` a `backend/.env`
   - Configurar `MONGODB_URI` con tu conexión a MongoDB

4. **Iniciar MongoDB**
   ```bash
   # Si usas MongoDB local
   mongod
   ```

5. **Poblar base de datos con datos de prueba**
   ```bash
   cd backend
   npm run seed
   ```

6. **Iniciar el proyecto**
   ```bash
   # Opción 1: Iniciar ambos servicios
   npm run dev

   # Opción 2: Iniciar servicios individualmente
   cd frontend && npm run dev  # Frontend: http://localhost:3001
   cd backend && npm run dev   # Backend: http://localhost:5000
   ```

## 🌐 Acceder a la Aplicación

- **Frontend (Interfaz de Usuario)**: http://localhost:3001
- **Backend (API)**: http://localhost:5000
- **Documentación API**: http://localhost:5000 (Swagger próximamente)

## 📁 Estructura del Proyecto

```
caminando-online/
├── frontend/                 # 🖥️ Aplicación Next.js
│   ├── src/
│   │   ├── app/             # Páginas y layouts
│   │   ├── components/      # Componentes reutilizables
│   │   └── data/            # Datos de ejemplo
│   └── package.json
├── backend/                  # ⚙️ API Express.js
│   ├── src/
│   │   ├── controllers/     # Controladores de la API
│   │   ├── models/          # Modelos de MongoDB
│   │   ├── routes/          # Definición de rutas
│   │   ├── middlewares/     # Middlewares personalizados
│   │   └── index.ts         # Punto de entrada
│   └── package.json
├── docs/                     # 📚 Documentación
│   └── procesos/             # Documentación de fases
├── scripts/                  # 🔧 Scripts de automatización
└── README.md
```

## 🛠️ Scripts Disponibles

### Proyecto Raíz
```bash
npm run dev          # Inicia frontend y backend
npm run build        # Construye ambos servicios
npm run lint         # Ejecuta linting
```

### Frontend
```bash
cd frontend
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint
```

### Backend
```bash
cd backend
npm run dev          # Inicia con nodemon
npm run build        # Compila TypeScript
npm run start        # Inicia servidor compilado
npm run seed         # Pobla base de datos con datos de prueba
```

## � Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **React Query** - Gestión de estado del servidor

### Backend
- **Express.js** - Framework web para Node.js
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### DevOps & Tools
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Git** - Control de versiones
- **npm workspaces** - Gestión de monorepos

## � Próximos Pasos

### 🚧 **Fase 2: Backend Core + Scraping (En Progreso)**
- [ ] Implementar scraping básico de supermercados
- [ ] Sistema de autenticación básico
- [ ] Procesamiento y almacenamiento de datos scrapeados

### 🚧 **Fase 3: Frontend MVP (En Progreso)**
- [ ] Página de productos comparados
- [ ] Dashboard básico de usuario
- [ ] Sistema de autenticación en frontend

### 📋 **Fase 4: Testing y Lanzamiento**
- [ ] Testing funcional completo
- [ ] Optimizaciones de performance
- [ ] Despliegue en producción

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## � Contacto

- **Proyecto**: Caminando Online MVP
- **Repositorio**: [GitHub](https://github.com/Jumadominguez/caminandovs)
- **Estado**: Desarrollo Activo

---

**Última actualización**: Septiembre 2025
**Versión**: MVP Fase 1.2 (Fase 2 y 3 en progreso)
