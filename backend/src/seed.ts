import mongoose from 'mongoose';
import Supermarket from './models/Supermarket';
import Category from './models/Category';

const supermarkets = [
  {
    name: 'Jumbo',
    code: 'jumbo',
    baseUrl: 'https://www.jumbo.cl',
    isActive: true
  },
  {
    name: 'Líder',
    code: 'lider',
    baseUrl: 'https://www.lider.cl',
    isActive: true
  }
];

const categories = [
  { name: 'Almacén', level: 0, url: '/almacen' },
  { name: 'Frutas y Verduras', level: 0, url: '/frutas-y-verduras' }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/caminando-online');
    console.log('✅ Conectado a MongoDB');

    await Supermarket.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Datos anteriores eliminados');

    const createdSupermarkets = await Supermarket.insertMany(supermarkets);
    console.log('🏪 Supermercados creados:', createdSupermarkets.length);

    const jumbo = createdSupermarkets.find(s => s.code === 'jumbo');
    if (jumbo) {
      const categoriesWithSupermarket = categories.map(cat => ({
        ...cat,
        supermarket: jumbo._id,
        url: `${jumbo.baseUrl}${cat.url}`
      }));

      await Category.insertMany(categoriesWithSupermarket);
      console.log('📂 Categorías creadas para Jumbo:', categories.length);
    }

    console.log('🎉 Base de datos poblada exitosamente');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
