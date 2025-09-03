# 🛒 Caminando Online - MVP

Plataforma de comparación de precios de supermercados - **Fase 1: Setup y Arquitectura MVP**

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- MongoDB (local o Atlas)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd caminando-online
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copiar `.env.example` a `.env` en la carpeta backend
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
   # Desde la raíz del proyecto
   npm run dev
   ```

   Esto iniciará:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Estructura del Proyecto

```
caminando-online/
├── frontend/          # Next.js App
├── backend/           # Express.js API
├── docs/             # Documentación
└── scripts/          # Scripts útiles
```

## 🔗 Endpoints de la API

### Productos
- `GET /api/products` - Lista de productos con filtros
- `GET /api/products/:id` - Detalles de producto
- `POST /api/products` - Crear producto

### Comparaciones
- `POST /api/comparisons` - Crear comparación de precios
- `GET /api/comparisons` - Historial de comparaciones

### Supermercados
- `GET /api/supermarkets` - Lista de supermercados
- `GET /api/supermarkets/:id` - Detalles de supermercado

## 🛠️ Scripts Disponibles

### Raíz del proyecto
- `npm run dev` - Iniciar frontend y backend
- `npm run dev:frontend` - Solo frontend
- `npm run dev:backend` - Solo backend
- `npm run build` - Build de producción

### Backend
- `npm run dev` - Desarrollo con nodemon
- `npm run build` - Compilar TypeScript
- `npm run start` - Producción
- `npm run seed` - Poblar base de datos

## 📊 Funcionalidades MVP

### ✅ Implementadas en Fase 1
- ✅ Configuración completa del proyecto
- ✅ Frontend básico con Next.js
- ✅ Backend API con Express.js
- ✅ Base de datos MongoDB
- ✅ Modelos de datos (Producto, Usuario, Comparación)
- ✅ Endpoints core operativos
- ✅ Datos de prueba para 4 supermercados
- ✅ Interfaz de búsqueda y comparación

### 🔄 Próximas Fases
- Fase 2: Backend completo + Scraping básico
- Fase 3: Frontend MVP completo
- Fase 4: Testing y lanzamiento
- Fase 5: Scraping avanzado
- Fase 6: Funcionalidades avanzadas

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollador Fullstack**: [Tu Nombre]
- **Proyecto**: Caminando Online MVP
- **Versión**: 1.0.0 - Fase 1

---

**Estado**: 🚧 MVP Fase 1 - Setup Completo
