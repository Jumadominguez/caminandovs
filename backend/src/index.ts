import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importar rutas
import productRoutes from './routes/products';
import comparisonRoutes from './routes/comparisons';
import supermarketRoutes from './routes/supermarkets';

// Importar middlewares
import { apiResponse, errorHandler } from './middlewares/apiMiddleware';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares esenciales
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware para respuestas API consistentes
app.use(apiResponse);

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/caminando-online';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/supermarkets', supermarketRoutes);

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Caminando Online - MVP Fase 2',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      products: '/api/products',
      'products/search': '/api/products/search',
      'products/categories': '/api/products/categories',
      'products/compare': '/api/products/compare',
      comparisons: '/api/comparisons',
      supermarkets: '/api/supermarkets',
      health: '/health'
    }
  });
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📱 Frontend: http://localhost:3000`);
    console.log(`🔗 API: http://localhost:${PORT}`);
    console.log(`📚 Documentación: http://localhost:${PORT}`);
  });
};

startServer().catch(console.error);
