const mongoose = require('mongoose');

async function checkCategories() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Jumbo');

    const CategorySchema = new mongoose.Schema({
      Nombre: String,
      type: String,
      hasSubcategories: Boolean,
      subcategories: Array,
      parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    });

    const Category = mongoose.model('Category', CategorySchema, 'categories');

    const categories = await Category.find({ type: 'categoria_principal', isActive: true });

    console.log('=== CATEGORÍAS PRINCIPALES Y SUS SUBCATEGORÍAS ===');
    for (const cat of categories) {
      const subcategories = await Category.find({ type: 'subcategoria', parent: cat._id });
      console.log(`${cat.Nombre} - Subcategorías: ${subcategories.length}`);
    }

    // Find categories without subcategories
    const categoriesWithoutSubs = [];
    for (const cat of categories) {
      const subCount = await Category.countDocuments({ type: 'subcategoria', parent: cat._id });
      if (subCount === 0) {
        categoriesWithoutSubs.push(cat.Nombre);
      }
    }

    console.log(`\n=== CATEGORÍAS SIN SUBCATEGORÍAS: ${categoriesWithoutSubs.length} ===`);
    categoriesWithoutSubs.forEach(name => console.log(`- ${name}`));

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCategories();
