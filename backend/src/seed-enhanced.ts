import mongoose from 'mongoose';
import Supermarket from './models/Supermarket';
import Category from './models/Category';
import ProductType from './models/ProductType';
import Filter from './models/Filter';
import SubcategoryRaw from './models/SubcategoryRaw';
import SubcategoryProcessed from './models/SubcategoryProcessed';
import Product from './models/Product';
require('dotenv').config();

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

const productTypes = [
  {
    name: 'Lácteos',
    description: 'Productos lácteos y derivados',
    color: '#4A90E2',
    sortOrder: 1,
    attributes: [
      { name: 'Marca', type: 'string', required: true },
      { name: 'Tipo', type: 'select', required: true, options: ['Entera', 'Descremada', 'Semi-descremada'] },
      { name: 'Peso neto', type: 'number', required: true, unit: 'ml' }
    ]
  },
  {
    name: 'Carnes',
    description: 'Carnes rojas, blancas y procesadas',
    color: '#E94B3C',
    sortOrder: 2,
    attributes: [
      { name: 'Tipo de carne', type: 'select', required: true, options: ['Vacuno', 'Cerdo', 'Pollo', 'Pavo'] },
      { name: 'Corte', type: 'string', required: true },
      { name: 'Peso aproximado', type: 'number', required: true, unit: 'kg' }
    ]
  },
  {
    name: 'Frutas',
    description: 'Frutas frescas y procesadas',
    color: '#7ED321',
    sortOrder: 3,
    attributes: [
      { name: 'Tipo', type: 'select', required: true, options: ['Frescas', 'Secas', 'En conserva'] },
      { name: 'Origen', type: 'string', required: false },
      { name: 'Peso aproximado', type: 'number', required: true, unit: 'kg' }
    ]
  }
];

const filters = [
  {
    name: 'Precio',
    type: 'range',
    field: 'price',
    sortOrder: 1,
    range: { min: 0, max: 100000, step: 100, unit: 'CLP' }
  },
  {
    name: 'Marca',
    type: 'multiselect',
    field: 'brand',
    sortOrder: 2
  },
  {
    name: 'Disponibilidad',
    type: 'select',
    field: 'availability',
    sortOrder: 3,
    options: [
      { label: 'Disponible', value: 'available' },
      { label: 'Agotado', value: 'out_of_stock' },
      { label: 'Limitado', value: 'limited' }
    ]
  },
  {
    name: 'En oferta',
    type: 'boolean',
    field: 'isOnSale',
    sortOrder: 4
  }
];

const subcategoriesRaw = [
  {
    name: 'Leches Enteras',
    url: '/lacteos/leches-enteras',
    parentCategory: 'Lácteos',
    supermarket: 'jumbo',
    rawData: {
      selector: '.product-item',
      totalProducts: 24,
      lastUpdated: new Date()
    },
    isProcessed: false
  },
  {
    name: 'Quesos',
    url: '/lacteos/quesos',
    parentCategory: 'Lácteos',
    supermarket: 'jumbo',
    rawData: {
      selector: '.product-item',
      totalProducts: 18,
      lastUpdated: new Date()
    },
    isProcessed: false
  },
  {
    name: 'Yogures',
    url: '/lacteos/yogures',
    parentCategory: 'Lácteos',
    supermarket: 'jumbo',
    rawData: {
      selector: '.product-item',
      totalProducts: 32,
      lastUpdated: new Date()
    },
    isProcessed: false
  },
  {
    name: 'Carnes Rojas',
    url: '/carnes/carnes-rojas',
    parentCategory: 'Carnes',
    supermarket: 'jumbo',
    rawData: {
      selector: '.product-item',
      totalProducts: 45,
      lastUpdated: new Date()
    },
    isProcessed: false
  }
];

const subcategoriesProcessed = [
  {
    name: 'Leches Enteras',
    slug: 'leches-enteras',
    description: 'Variedad de leches enteras frescas',
    sortOrder: 1,
    isActive: true,
    metadata: { icon: '🥛' }
  },
  {
    name: 'Quesos',
    slug: 'quesos',
    description: 'Quesos frescos y madurados',
    sortOrder: 2,
    isActive: true,
    metadata: { icon: '🧀' }
  },
  {
    name: 'Yogures',
    slug: 'yogures',
    description: 'Yogures naturales y con frutas',
    sortOrder: 3,
    isActive: true,
    metadata: { icon: '🥄' }
  },
  {
    name: 'Carnes Rojas',
    slug: 'carnes-rojas',
    description: 'Cortes de carne vacuna y otros',
    sortOrder: 1,
    isActive: true,
    metadata: { icon: '🥩' }
  }
];

async function seedEnhancedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caminando-online');
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await Supermarket.deleteMany({});
    await Category.deleteMany({});
    await ProductType.deleteMany({});
    await Filter.deleteMany({});
    await SubcategoryRaw.deleteMany({});
    await SubcategoryProcessed.deleteMany({});
    await Product.deleteMany({});
    
    // Eliminar colecciones antiguas sin sufijo
    if (mongoose.connection.db) {
      try {
        await mongoose.connection.db.dropCollection('categories');
        console.log('🗑️  Colección "categories" eliminada');
      } catch (error) {
        console.log('ℹ️  Colección "categories" no existía o ya fue eliminada');
      }
      
      try {
        await mongoose.connection.db.dropCollection('filters');
        console.log('🗑️  Colección "filters" eliminada');
      } catch (error) {
        console.log('ℹ️  Colección "filters" no existía o ya fue eliminada');
      }
      
      try {
        await mongoose.connection.db.dropCollection('products');
        console.log('🗑️  Colección "products" eliminada');
      } catch (error) {
        console.log('ℹ️  Colección "products" no existía o ya fue eliminada');
      }
      
      try {
        await mongoose.connection.db.dropCollection('producttypes');
        console.log('🗑️  Colección "producttypes" eliminada');
      } catch (error) {
        console.log('ℹ️  Colección "producttypes" no existía o ya fue eliminada');
      }
    }
    
    console.log('🗑️  Datos anteriores eliminados');

    // Crear supermercados
    const createdSupermarkets = await Supermarket.insertMany(supermarkets);
    console.log('🏪 Supermercados creados:', createdSupermarkets.length);

    // Crear tipos de producto (processed)
    const createdProductTypes = await ProductType.insertMany(productTypes);
    console.log('🏷️  Tipos de producto procesados creados:', createdProductTypes.length);

    // Crear filtros (processed)
    const createdFilters = await Filter.insertMany(filters);
    console.log('🔍 Filtros procesados creados:', createdFilters.length);

    // Crear subcategorías raw
    const createdSubcategoriesRaw = await SubcategoryRaw.insertMany(subcategoriesRaw);
    console.log('📂 Subcategorías raw creadas:', createdSubcategoriesRaw.length);

    // Crear categorías para Jumbo
    const jumbo = createdSupermarkets.find(s => s.code === 'jumbo');
    if (jumbo) {
      const categories = [
        { name: 'Almacén', level: 0, url: '/almacen', supermarket: jumbo._id },
        { name: 'Lácteos', level: 0, url: '/lacteos', supermarket: jumbo._id },
        { name: 'Carnes', level: 0, url: '/carnes', supermarket: jumbo._id },
        { name: 'Frutas y Verduras', level: 0, url: '/frutas-y-verduras', supermarket: jumbo._id }
      ];

      await Category.insertMany(categories);
      console.log('📂 Categorías creadas para Jumbo');
      
      // Crear subcategorías procesadas con referencias a categorías
      const lacteosCategory = await Category.findOne({ name: 'Lácteos', supermarket: jumbo._id });
      const carnesCategory = await Category.findOne({ name: 'Carnes', supermarket: jumbo._id });
      
      if (lacteosCategory && carnesCategory) {
        const processedSubcategories = [
          { ...subcategoriesProcessed[0], parentCategory: lacteosCategory._id, supermarket: jumbo._id },
          { ...subcategoriesProcessed[1], parentCategory: lacteosCategory._id, supermarket: jumbo._id },
          { ...subcategoriesProcessed[2], parentCategory: lacteosCategory._id, supermarket: jumbo._id },
          { ...subcategoriesProcessed[3], parentCategory: carnesCategory._id, supermarket: jumbo._id }
        ];
        
        await SubcategoryProcessed.insertMany(processedSubcategories);
        console.log('📂 Subcategorías procesadas creadas para Jumbo');
      }
    }

    console.log('🎉 Base de datos mejorada poblada exitosamente');

    // Mostrar resumen
    const stats = {
      supermarkets: await Supermarket.countDocuments(),
      categories: await Category.countDocuments(),
      productTypes: await ProductType.countDocuments(),
      filters: await Filter.countDocuments(),
      subcategoriesRaw: await SubcategoryRaw.countDocuments(),
      subcategoriesProcessed: await SubcategoryProcessed.countDocuments()
    };

    console.log('\n📊 Resumen de la nueva arquitectura:');
    console.log(`🏪 Supermercados: ${stats.supermarkets}`);
    console.log(`📂 Categorías procesadas: ${stats.categories}`);
    console.log(`🏷️  Tipos de producto procesados: ${stats.productTypes}`);
    console.log(`🔍 Filtros procesados: ${stats.filters}`);
    console.log(`📂 Subcategorías raw: ${stats.subcategoriesRaw}`);
    console.log(`📂 Subcategorías procesadas: ${stats.subcategoriesProcessed}`);

  } catch (error) {
    console.error('❌ Error poblando BD mejorada:', error);
  } finally {
    await mongoose.disconnect();
  }
}

export default seedEnhancedDatabase;