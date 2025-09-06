/**
 * Verificador de Categorías de Jumbo
 *
 * Este script verifica que las categorías de Jumbo se hayan guardado correctamente
 * en la base de datos y muestra un resumen de los datos almacenados.
 *
 * Uso:
 * node checkCategoriesJumbo.js
 */

const mongoose = require('mongoose');

async function checkJumboCategories() {
  try {
    console.log('🔍 Verificando categorías en base de datos Jumbo...');

    // Conectar a la base de datos Jumbo (con mayúscula)
    await mongoose.connect('mongodb://localhost:27017/Jumbo');
    console.log('✅ Conectado a base de datos Jumbo');

    const db = mongoose.connection.db;
    const categoriesCollection = db.collection('categories');

    // Contar documentos
    const count = await categoriesCollection.countDocuments();
    console.log(`📊 Total de categorías: ${count}`);

    if (count > 0) {
      // Mostrar las primeras categorías
      const categories = await categoriesCollection.find({}).limit(5).toArray();

      console.log('\n📋 Primeras categorías encontradas:');
      categories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.Nombre || cat.name}`);
        console.log(`     - Nombre simplificado: ${cat['Nombre simplificado']}`);
        console.log(`     - Type: ${cat.type}`);
        console.log(`     - URL: ${cat.URL}`);
        console.log(`     - Selector: ${cat.Selector}`);
        console.log(`     - Level: ${cat.level}`);
        console.log(`     - hasSubcategories: ${cat.hasSubcategories}`);
        console.log(`     - productCount: ${cat.productCount}`);
        console.log(`     - isActive: ${cat.isActive}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

checkJumboCategories();
