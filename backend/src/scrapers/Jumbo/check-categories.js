const mongoose = require('mongoose');

async function checkCategories() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Jumbo');

    const CategorySchema = new mongoose.Schema({
      Nombre: String,
      type: String,
      hasSubcategories: Boolean,
      subcategories: Array
    });

    const Category = mongoose.model('Category', CategorySchema, 'categories');

    const categories = await Category.find({ type: 'categoria_principal', isActive: true });

    console.log('=== CATEGORÍAS PRINCIPALES ===');
    categories.forEach((cat, i) => {
      const subCount = cat.subcategories ? cat.subcategories.length : 0;
      console.log(`${i+1}. ${cat.Nombre} - Subcategorías: ${subCount}`);
    });

    const withoutSubs = categories.filter(cat => !cat.subcategories || cat.subcategories.length === 0);
    console.log(`\n=== CATEGORÍAS SIN SUBCATEGORÍAS: ${withoutSubs.length} ===`);
    withoutSubs.forEach(cat => console.log(`- ${cat.Nombre}`));

    // Also check subcategories in database
    const subcategories = await Category.find({ type: 'subcategoria' });
    console.log(`\n=== TOTAL SUBCATEGORÍAS EN DB: ${subcategories.length} ===`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCategories();
