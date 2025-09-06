const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Conectar a MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Jumbo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB (base de datos: Jumbo)');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Modelo de Categoría
const CategorySchema = new mongoose.Schema({
  Nombre: String,
  'Nombre simplificado': String,
  type: String,
  URL: String,
  Selector: String,
  level: Number,
  hasSubcategories: Boolean,
  productCount: Number,
  isActive: Boolean,
  subcategories: Array,
});

const Category = mongoose.model('Category', CategorySchema, 'categories');

// Función para extraer subcategorías de una URL
async function extractSubcategories(url, categoryName) {
  console.log(`🔍 Extrayendo subcategorías de: ${categoryName}`);
  console.log(`🌐 URL: ${url}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
      defaultViewport: null
    });

    const page = await browser.newPage();

    // Configurar user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Ir a la URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Esperar a que cargue el contenido
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('🔍 Buscando contenedor de Sub-Categoría...');

    // Buscar el contenedor de Sub-Categoría por su título con más precisión
    const subcategoryContainer = await page.evaluate(() => {
      const containers = document.querySelectorAll('.vtex-search-result-3-x-filter__container');
      console.log(`📊 Encontrados ${containers.length} contenedores de filtro`);

      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const titleElement = container.querySelector('.vtex-search-result-3-x-filterTitle span');
        if (titleElement) {
          const titleText = titleElement.textContent.trim();
          console.log(`📋 Contenedor ${i + 1}: "${titleText}"`);

          if (titleText === 'Sub-Categoría') {
            console.log(`✅ Sub-Categoría encontrada en contenedor ${i + 1}`);
            return {
              className: container.className,
              index: i + 1
            };
          }
        }
      }
      return null;
    });

    if (!subcategoryContainer) {
      console.log('⚠️ No se encontró el contenedor de Sub-Categoría');
      return [];
    }

    console.log('✅ Contenedor de Sub-Categoría encontrado:', subcategoryContainer.className);
    console.log('📊 Posición del contenedor:', subcategoryContainer.index);

    // Verificar si la categoría está expandida
    const isExpanded = await page.evaluate((containerClass) => {
      // Usar el primer segmento de la clase para evitar problemas con espacios
      const firstClass = containerClass.split(' ')[0];
      const container = document.querySelector(`.${firstClass}`);
      if (!container) return false;
      const content = container.querySelector('.vtex-search-result-3-x-filterTemplateOverflow');
      return content && content.getAttribute('aria-hidden') === 'false';
    }, subcategoryContainer.className);

    console.log('📂 Estado de expansión:', isExpanded ? 'Expandido' : 'Colapsado');

    // Si no está expandido, hacer click para expandir
    if (!isExpanded) {
      console.log('🔄 Expandiendo categoría Sub-Categoría...');
      await page.evaluate((containerClass) => {
        const firstClass = containerClass.split(' ')[0];
        const titleElement = document.querySelector(`.${firstClass} .vtex-search-result-3-x-filterTitle`);
        if (titleElement) {
          titleElement.click();
        }
      }, subcategoryContainer.className);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Hacer scroll hasta el contenedor de subcategorías
    console.log('📜 Scrolleando hasta el contenedor...');
    await page.evaluate((containerClass) => {
      const firstClass = containerClass.split(' ')[0];
      const container = document.querySelector(`.${firstClass}`);
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, subcategoryContainer.className);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Hacer scroll hasta el final del contenedor específicamente
    console.log('📜 Scrolleando hasta el final del contenedor...');
    await page.evaluate((containerClass) => {
      const firstClass = containerClass.split(' ')[0];
      const container = document.querySelector(`.${firstClass}`);
      if (container) {
        const overflowElement = container.querySelector('.vtex-search-result-3-x-filterTemplateOverflow');
        if (overflowElement) {
          overflowElement.scrollTop = overflowElement.scrollHeight;
        }
      }
    }, subcategoryContainer.className);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Buscar el botón "Mostrar más" con selector más específico
    console.log('🔍 Buscando botón "Mostrar más"...');
    const containerSelector = `.${subcategoryContainer.className.replace(/\s+/g, '.')}`;
    console.log(`📍 Selector del contenedor: ${containerSelector}`);

    // Buscar el botón dentro del contenedor específico
    let showMoreButton = await page.$(`${containerSelector} .vtex-search-result-3-x-seeMoreButton`);

    if (!showMoreButton) {
      console.log('⚠️ No se encontró botón "Mostrar más" en el contenedor específico, buscando por texto...');
      // Buscar por texto del botón
      showMoreButton = await page.$(`button:has-text("Mostrar 58 más")`);
    }

    if (!showMoreButton) {
      console.log('⚠️ No se encontró botón "Mostrar 58 más", buscando "Mostrar más"...');
      showMoreButton = await page.$(`button:has-text("Mostrar más")`);
    }

    if (!showMoreButton) {
      console.log('⚠️ No se encontró botón en el contenedor específico, buscando en toda la página...');
      showMoreButton = await page.$('.vtex-search-result-3-x-seeMoreButton');
    }

    if (showMoreButton) {
      console.log('✅ Botón "Mostrar más" encontrado, haciendo click...');

      // Contar elementos antes del click
      const elementsBefore = await page.evaluate((containerClass) => {
        const firstClass = containerClass.split(' ')[0];
        return document.querySelectorAll(`.${firstClass} .vtex-search-result-3-x-filterItem`).length;
      }, subcategoryContainer.className);

      console.log(`📊 Elementos antes del click: ${elementsBefore}`);

      // Hacer click usando page.click() que es más confiable
      const buttonSelector = `${containerSelector} .vtex-search-result-3-x-seeMoreButton`;
      try {
        await page.click(buttonSelector);
        console.log('✅ Click realizado exitosamente');
      } catch (error) {
        console.log('⚠️ Error con page.click(), intentando con evaluate...');
        await page.evaluate((selector) => {
          const button = document.querySelector(selector);
          if (button) {
            button.click();
          }
        }, buttonSelector);
      }

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verificar si cargaron más elementos
      const elementsAfter = await page.evaluate((containerSelector) => {
        const container = document.querySelector(containerSelector);
        if (container) {
          return container.querySelectorAll('.vtex-search-result-3-x-filterItem').length;
        }
        return 0;
      }, containerSelector);

      console.log(`📊 Elementos después del primer click: ${elementsAfter}`);

      // Si no aumentaron significativamente, intentar múltiples clicks
      if (elementsAfter <= elementsBefore + 5) { // Solo si aumentaron menos de 5 elementos
        console.log('🔄 Intentando múltiples clicks en "Mostrar más"...');
        for (let i = 0; i < 3; i++) {
          try {
            const buttonStillExists = await page.$(`${containerSelector} .vtex-search-result-3-x-seeMoreButton`);
            if (buttonStillExists) {
              await page.click(buttonSelector);
              await new Promise(resolve => setTimeout(resolve, 1500));

              const currentElements = await page.evaluate((containerSelector) => {
                const container = document.querySelector(containerSelector);
                if (container) {
                  return container.querySelectorAll('.vtex-search-result-3-x-filterItem').length;
                }
                return 0;
              }, containerSelector);

              console.log(`📊 Elementos después del click ${i + 2}: ${currentElements}`);

              if (currentElements > elementsAfter) {
                console.log(`✅ Más elementos cargados en el intento ${i + 2}`);
                break;
              }
            } else {
              console.log('ℹ️ Botón "Mostrar más" ya no existe');
              break;
            }
          } catch (error) {
            console.log(`⚠️ Error en click ${i + 2}: ${error.message}`);
          }
        }
      }

      console.log('⏳ Esperando que se carguen todas las subcategorías...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log('ℹ️ No se encontró botón "Mostrar más"');
    }

    // Extraer las subcategorías
    console.log('📋 Extrayendo subcategorías...');

    // Contar elementos antes de extraer
    const totalElements = await page.evaluate((containerSelector) => {
      const container = document.querySelector(containerSelector);
      if (container) {
        return container.querySelectorAll('.vtex-search-result-3-x-filterItem').length;
      }
      return 0;
    }, containerSelector);

    console.log(`📊 Total de elementos encontrados en el DOM: ${totalElements}`);

    const subcategories = await page.evaluate((containerSelector) => {
      try {
        const container = document.querySelector(containerSelector);
        if (!container) {
          console.log('❌ Contenedor no encontrado en evaluate');
          return [];
        }

        const results = [];
        const filterItems = container.querySelectorAll('.vtex-search-result-3-x-filterItem');

        console.log(`📊 Procesando ${filterItems.length} elementos de filtro en evaluate`);

        filterItems.forEach((item, index) => {
          const label = item.querySelector('.vtex-checkbox__label');
          const input = item.querySelector('input[type="checkbox"]');

          if (label && input) {
            const name = input.getAttribute('name') || '';
            const value = input.getAttribute('value') || '';
            const text = label.textContent?.trim() || '';

            if (name && value) {
              results.push({
                index: index + 1,
                name: name,
                value: value,
                text: text,
                selector: `.vtex-search-result-3-x-filterItem:nth-child(${index + 1}) .vtex-checkbox__label`
              });
            }
          } else {
            // Log elementos sin checkboxes para debugging
            const textContent = item.textContent?.trim() || '';
            if (textContent && index < 5) { // Solo log los primeros 5 para no saturar
              console.log(`⚠️ Elemento ${index + 1} sin checkbox: "${textContent.substring(0, 50)}..."`);
            }
          }
        });

        console.log(`✅ Encontradas ${results.length} subcategorías válidas en evaluate`);
        return results;
      } catch (error) {
        console.log(`❌ Error en evaluate: ${error.message}`);
        return [];
      }
    }, containerSelector);

    console.log(`✅ Encontradas ${subcategories.length} subcategorías para ${categoryName}`);

    return subcategories;

  } catch (error) {
    console.error(`❌ Error extrayendo subcategorías de ${categoryName}:`, error.message);
    console.log('🔍 Manteniendo el navegador abierto para debugging del error...');
    return [];
  } finally {
    // No cerrar el navegador aquí para permitir debugging
    // if (browser) {
    //   await browser.close();
    // }
  }
}

// Función principal
async function main() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todas las categorías de Jumbo (solo la primera para testing)
    const categories = await Category.find({ type: 'categoria_principal', isActive: true })
      .sort({ Nombre: 1 })
      .limit(1); // Solo procesar la primera categoría para testing

    console.log(`📊 Encontradas ${categories.length} categorías principales (limitado a 1 para testing)`);

    const results = [];

    // Procesar cada categoría
    for (const category of categories) {
      console.log(`\n🔄 Procesando categoría: ${category.Nombre}`);

      const subcategories = await extractSubcategories(category.URL, category.Nombre);

      results.push({
        category: category.Nombre,
        categorySimplified: category['Nombre simplificado'],
        url: category.URL,
        subcategories: subcategories
      });

      // Pequeña pausa entre requests para no sobrecargar (más larga para testing)
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('⏳ Pausa de 5 segundos antes de continuar...');
    }

    // Generar archivo Markdown
    const markdown = generateMarkdown(results);

    // Guardar archivo
    const outputPath = path.join(__dirname, 'subcategorias-jumbo.md');
    fs.writeFileSync(outputPath, markdown, 'utf8');

    console.log(`\n✅ Archivo generado: ${outputPath}`);
    console.log(`📊 Total de categorías procesadas: ${results.length}`);
    console.log(`📊 Total de subcategorías extraídas: ${results.reduce((total, cat) => total + cat.subcategories.length, 0)}`);
    console.log(`\n🔍 Revisa el navegador abierto para verificar el proceso.`);
    console.log(`ℹ️ Puedes cerrar el navegador cuando termines de revisar.`);

    // Mantener el navegador abierto para revisión
    console.log(`\n⏳ El script ha terminado. El navegador permanecerá abierto para tu revisión.`);
    console.log(`💡 Presiona Ctrl+C en la terminal para cerrar el script cuando termines.`);

  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
    console.log('🔍 Manteniendo el navegador abierto para debugging...');
    // No cerrar automáticamente para permitir debugging
    process.exit(1);
  } finally {
    // Cerrar conexión a MongoDB
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
    // No cerrar el navegador aquí para permitir revisión
  }
}

// Función para generar el contenido Markdown
function generateMarkdown(results) {
  let markdown = `# Subcategorías de Jumbo\n\n`;
  markdown += `**Generado el:** ${new Date().toLocaleString('es-ES')}\n\n`;
  markdown += `**Total de categorías procesadas:** ${results.length}\n\n`;

  let totalSubcategories = 0;

  results.forEach(result => {
    markdown += `## ${result.category}\n\n`;
    markdown += `**Nombre simplificado:** ${result.categorySimplified}\n`;
    markdown += `**URL:** ${result.url}\n`;
    markdown += `**Subcategorías encontradas:** ${result.subcategories.length}\n\n`;

    if (result.subcategories.length > 0) {
      markdown += `### Lista de Subcategorías\n\n`;
      markdown += `| # | Nombre | Valor | Selector |\n`;
      markdown += `|---|--------|-------|----------|\n`;

      result.subcategories.forEach(sub => {
        markdown += `| ${sub.index} | ${sub.name} | ${sub.value} | \`${sub.selector}\` |\n`;
      });

      markdown += `\n`;
    } else {
      markdown += `*No se encontraron subcategorías para esta categoría*\n\n`;
    }

    totalSubcategories += result.subcategories.length;
  });

  markdown += `---\n\n`;
  markdown += `## Resumen\n\n`;
  markdown += `- **Categorías procesadas:** ${results.length}\n`;
  markdown += `- **Total de subcategorías:** ${totalSubcategories}\n`;
  markdown += `- **Promedio por categoría:** ${(totalSubcategories / results.length).toFixed(1)}\n`;

  return markdown;
}

// Ejecutar el script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { extractSubcategories };
