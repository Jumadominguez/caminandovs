import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importar rutas
import productRoutes from './routes/products';
import comparisonRoutes from './routes/comparisons';
import supermarketRoutes from './routes/supermarkets';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

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
    message: '🚀 API de Caminando Online - MVP Fase 1',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      products: '/api/products',
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
