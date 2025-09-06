/**
 * Scraper de Categorías de Jumbo
 *
 * Este script extrae automáticamente las categorías del menú principal de Jumbo
 * y las guarda en la base de datos "Jumbo" en la colección "categories".
 *
 * Funcionalidades:
 * - Navega a www.jumbo.com.ar en modo headless
 * - Realiza hover sobre el menú de categorías
 * - Extrae todas las categorías disponibles
 * - Guarda en MongoDB con estructura completa
 *
 * Uso:
 * node scraperCategoryJumbo.js
 *
 * Campos guardados:
 * - _id: ObjectId generado automáticamente
 * - Nombre: Nombre original de la categoría
 * - Nombre simplificado: Para URLs limpias
 * - type: "categoria_principal"
 * - URL: URL completa de la categoría
 * - Selector: Selector CSS único
 * - level: 0 (nivel raíz)
 * - hasSubcategories: true
 * - productCount: 0
 * - isActive: true
 * - subcategories: []
 */

const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

async function hoverJumboCategories() {
  console.log('🚀 Iniciando extracción de categorías de Jumbo...');

  let browser;
  try {
    // Conectar a la base de datos Jumbo
    console.log('📡 Conectando a base de datos Jumbo...');
    await mongoose.connect('mongodb://localhost:27017/Jumbo');
    console.log('✅ Conectado a MongoDB - Base de datos: Jumbo');
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    console.log('📍 Cargando Jumbo...');
    await page.goto('https://www.jumbo.com.ar', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('✅ Página cargada');

    // Esperar a que se cargue el contenido
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Buscar el elemento del menú de categorías
    const menuSelectors = [
      '.vtex-menu-2-x-menuItem--category-menu',
      '.vtex-menu-2-x-menuItem--header-category',
      '.vtex-menu-2-x-styledLink--header-category',
      'button[aria-label*="Categorías"]',
      'button[aria-label*="Menú"]'
    ];

    let menuElement = null;
    let foundSelector = '';

    for (const selector of menuSelectors) {
      try {
        menuElement = await page.$(selector);
        if (menuElement) {
          foundSelector = selector;
          console.log(`🎯 Elemento encontrado con selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Continuar con el siguiente selector
      }
    }

    if (!menuElement) {
      console.log('❌ No se encontró el elemento del menú de categorías');
      console.log('💡 Intenta inspeccionar manualmente la página para encontrar el selector correcto');
      return;
    }

    // Hacer hover sobre el elemento
    console.log('🖱️  Realizando hover...');
    await menuElement.hover();

    // Esperar a que aparezca el menú desplegable
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('✅ Hover completado');

    // Verificar si se desplegó el menú
    const dropdown = await page.$('.dropdown-menu, .submenu, .mega-menu, .flyout-menu, .categories-list');
    if (dropdown) {
      console.log('🎉 ¡Menú desplegado exitosamente!');
    } else {
      console.log('⚠️  Hover realizado pero no se detectó menú desplegado');
    }

    // Extraer categorías del menú desplegado
    console.log('📋 Extrayendo categorías del menú desplegado...');
    const categories = await extractCategoriesFromMenu(page);

    if (categories.length > 0) {
      console.log(`✅ Se encontraron ${categories.length} categorías`);

      // Guardar categorías en la base de datos
      await saveCategoriesToDatabase(categories);
    } else {
      console.log('⚠️  No se encontraron categorías en el menú desplegado');
    }

    console.log(`🎯 Selector usado: ${foundSelector}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Navegador cerrado');
    }
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Función para extraer categorías del menú desplegado
async function extractCategoriesFromMenu(page) {
  try {
    // Selectores comunes para elementos de menú en VTEX
    const categorySelectors = [
      '.vtex-menu-2-x-submenuItem',
      '.vtex-menu-2-x-submenuItem a',
      '.vtex-menu-2-x-styledLink',
      '.menu-item a',
      '.category-link',
      '.submenu-link',
      '[data-testid="menu-item"] a',
      '.dropdown-item a'
    ];

    const categories = [];

    for (const selector of categorySelectors) {
      try {
        const elements = await page.$$(selector);

        if (elements.length > 0) {
          console.log(`🔍 Encontrados ${elements.length} elementos con selector: ${selector}`);

          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            // Extraer información de la categoría
            const categoryInfo = await page.evaluate((el, index) => {
              const text = el.textContent?.trim();
              const href = el.getAttribute('href');
              const className = el.className;

              // Generar un selector único basado en la posición
              const uniqueSelector = `${el.tagName.toLowerCase()}:nth-of-type(${index + 1})`;

              return {
                name: text,
                url: href,
                selector: uniqueSelector,
                className: className,
                tagName: el.tagName.toLowerCase()
              };
            }, element, i);

            // Solo agregar si tiene nombre y URL válidos
            if (categoryInfo.name && categoryInfo.url && categoryInfo.name.length > 1) {
              categories.push(categoryInfo);
            }
          }

          // Si encontramos elementos con este selector, probablemente sea el correcto
          if (categories.length > 0) {
            break;
          }
        }
      } catch (error) {
        // Continuar con el siguiente selector
        continue;
      }
    }

    // Filtrar duplicados por nombre
    const uniqueCategories = categories.filter((cat, index, self) =>
      index === self.findIndex(c => c.name === cat.name)
    );

    return uniqueCategories;

  } catch (error) {
    console.error('❌ Error extrayendo categorías:', error.message);
    return [];
  }
}

// Función para guardar categorías en la base de datos
async function saveCategoriesToDatabase(categories) {
  try {
    console.log('💾 Guardando categorías en la base de datos...');

    // Obtener la colección Categories
    const db = mongoose.connection.db;
    const categoriesCollection = db.collection('categories');

    // Crear objetos con la estructura especificada
    const categoryObjects = categories.map((category, index) => ({
      _id: new mongoose.Types.ObjectId(),
      Nombre: category.name,
      'Nombre simplificado': category.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      type: 'categoria_principal',
      URL: `https://www.jumbo.com.ar${category.url}`,
      Selector: category.selector,
      level: 0,
      hasSubcategories: true,
      productCount: 0,
      isActive: true,
      subcategories: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    console.log(`📝 Preparando ${categoryObjects.length} objetos para insertar...`);

    // Mostrar preview de los primeros objetos
    categoryObjects.slice(0, 3).forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.Nombre} -> ${cat['Nombre simplificado']}`);
      console.log(`     URL: ${cat.URL}`);
      console.log(`     Level: ${cat.level}, hasSubcategories: ${cat.hasSubcategories}`);
    });

    // Limpiar colección antes de insertar (para evitar duplicados)
    console.log('🧹 Limpiando colección categories...');
    await categoriesCollection.deleteMany({});

    // Insertar categorías en la base de datos
    const result = await categoriesCollection.insertMany(categoryObjects);

    console.log(`✅ ¡Éxito! ${result.insertedCount} categorías guardadas en la base de datos`);
    console.log(`📊 IDs generados: ${result.insertedIds ? Object.keys(result.insertedIds).length : 'N/A'}`);

    // Verificar que se guardaron correctamente
    const savedCount = await categoriesCollection.countDocuments();
    console.log(`🔍 Verificación: ${savedCount} documentos en la colección 'categories'`);

  } catch (error) {
    console.error('❌ Error guardando en la base de datos:', error.message);
    throw error;
  }
}

// Ejecutar el script
hoverJumboCategories();
