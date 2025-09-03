import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';

// Cargar variables de entorno
dotenv.config();

// Datos de prueba para el MVP
const sampleProducts = [
  // Productos de Carrefour
  {
    name: 'Leche Entera La Serenísima 1L',
    price: 250,
    supermarket: 'Carrefour',
    category: 'Lácteos',
    unit: '1L'
  },
  {
    name: 'Pan Lactal Bimbo 500g',
    price: 180,
    supermarket: 'Carrefour',
    category: 'Panadería',
    unit: '500g'
  },
  {
    name: 'Arroz Gallo Oro 1kg',
    price: 220,
    supermarket: 'Carrefour',
    category: 'Almacén',
    unit: '1kg'
  },

  // Productos de Disco
  {
    name: 'Leche Entera La Serenísima 1L',
    price: 245,
    supermarket: 'Disco',
    category: 'Lácteos',
    unit: '1L'
  },
  {
    name: 'Pan Lactal Bimbo 500g',
    price: 175,
    supermarket: 'Disco',
    category: 'Panadería',
    unit: '500g'
  },
  {
    name: 'Arroz Gallo Oro 1kg',
    price: 215,
    supermarket: 'Disco',
    category: 'Almacén',
    unit: '1kg'
  },

  // Productos de Jumbo
  {
    name: 'Leche Entera La Serenísima 1L',
    price: 255,
    supermarket: 'Jumbo',
    category: 'Lácteos',
    unit: '1L'
  },
  {
    name: 'Pan Lactal Bimbo 500g',
    price: 185,
    supermarket: 'Jumbo',
    category: 'Panadería',
    unit: '500g'
  },
  {
    name: 'Arroz Gallo Oro 1kg',
    price: 225,
    supermarket: 'Jumbo',
    category: 'Almacén',
    unit: '1kg'
  },

  // Productos de Dia
  {
    name: 'Leche Entera La Serenísima 1L',
    price: 240,
    supermarket: 'Dia',
    category: 'Lácteos',
    unit: '1L'
  },
  {
    name: 'Pan Lactal Bimbo 500g',
    price: 170,
    supermarket: 'Dia',
    category: 'Panadería',
    unit: '500g'
  },
  {
    name: 'Arroz Gallo Oro 1kg',
    price: 210,
    supermarket: 'Dia',
    category: 'Almacén',
    unit: '1kg'
  }
];

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/caminando-online';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await Product.deleteMany({});
    console.log('🧹 Base de datos limpiada');

    // Insertar datos de prueba
    await Product.insertMany(sampleProducts);
    console.log(`✅ Insertados ${sampleProducts.length} productos de prueba`);

    // Mostrar estadísticas
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$supermarket',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    console.log('\n📊 Estadísticas por supermercado:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} productos, precio promedio: $${stat.avgPrice.toFixed(2)}`);
    });

    console.log('\n🎉 Seeding completado exitosamente!');
    console.log('💡 Puedes probar la API en: http://localhost:5000');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar seeding
seedDatabase();
