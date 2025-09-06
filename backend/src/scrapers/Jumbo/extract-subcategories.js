const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Script para extraer subcategorías de Jumbo y guardarlas en la base de datos
// Extrae todas las subcategorías de una categoría principal y las guarda en MongoDB

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
  nombre_simplificado: String,
  type: String,
  URL: String,
  Selector: String,
  level: Number,
  hasSubcategories: Boolean,
  productCount: Number,
  isActive: Boolean,
  subcategories: Array,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Función para crear snapshot de la colección antes de modificaciones
async function createSnapshot() {
  try {
    console.log('📸 Creando snapshot de la colección categories...');

    // Obtener todos los documentos
    const categories = await Category.find({}).sort({ type: 1, Nombre: 1 });
    console.log(`📊 Encontrados ${categories.length} documentos en la colección`);

    // Crear contenido del snapshot
    let snapshotContent = `# Snapshot de la colección 'categories'\n\n`;
    snapshotContent += `**Fecha de creación:** ${new Date().toISOString()}\n\n`;
    snapshotContent += `**Total de documentos:** ${categories.length}\n\n`;

    // Estadísticas
    const mainCategories = categories.filter(cat => cat.type === 'categoria_principal');
    const subcategories = categories.filter(cat => cat.type === 'subcategoria');

    snapshotContent += `## Estadísticas\n\n`;
    snapshotContent += `- **Categorías principales:** ${mainCategories.length}\n`;
    snapshotContent += `- **Subcategorías:** ${subcategories.length}\n\n`;

    // Detalle de categorías principales
    snapshotContent += `## Categorías Principales\n\n`;
    mainCategories.forEach((cat, index) => {
      snapshotContent += `### ${index + 1}. ${cat.Nombre}\n`;
      snapshotContent += `- **ID:** ${cat._id}\n`;
      snapshotContent += `- **Nombre simplificado:** ${cat.nombre_simplificado}\n`;
      snapshotContent += `- **URL:** ${cat.URL}\n`;
      snapshotContent += `- **Activa:** ${cat.isActive}\n`;
      snapshotContent += `- **Tiene subcategorías:** ${cat.hasSubcategories}\n`;
      snapshotContent += `- **Número de subcategorías:** ${cat.subcategories ? cat.subcategories.length : 0}\n`;
      snapshotContent += `- **Creado:** ${cat.createdAt}\n`;
      snapshotContent += `- **Actualizado:** ${cat.updatedAt}\n\n`;
    });

    // Detalle de subcategorías
    snapshotContent += `## Subcategorías\n\n`;
    subcategories.forEach((cat, index) => {
      snapshotContent += `### ${index + 1}. ${cat.Nombre}\n`;
      snapshotContent += `- **ID:** ${cat._id}\n`;
      snapshotContent += `- **Nombre simplificado:** ${cat.nombre_simplificado}\n`;
      snapshotContent += `- **Categoría padre:** ${cat.parent}\n`;
      snapshotContent += `- **Selector:** ${cat.Selector}\n`;
      snapshotContent += `- **Activa:** ${cat.isActive}\n`;
      snapshotContent += `- **Creado:** ${cat.createdAt}\n`;
      snapshotContent += `- **Actualizado:** ${cat.updatedAt}\n\n`;
    });

    // Crear nombre del archivo con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `snapshot-categories-${timestamp}.md`;
    const reportsDir = path.join(__dirname, 'reports');
    
    // Crear directorio reports si no existe
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const filepath = path.join(reportsDir, filename);

    // Guardar el archivo
    fs.writeFileSync(filepath, snapshotContent, 'utf8');
    console.log(`✅ Snapshot guardado en: ${filepath}`);

    // Mostrar resumen
    console.log(`📋 Resumen del snapshot:`);
    console.log(`   - Archivo: ${filename}`);
    console.log(`   - Categorías principales: ${mainCategories.length}`);
    console.log(`   - Subcategorías: ${subcategories.length}`);
    console.log(`   - Total documentos: ${categories.length}`);

  } catch (error) {
    console.error('❌ Error creando snapshot:', error);
    throw error;
  }
}

// Forzar el uso del esquema actualizado
delete mongoose.models.Category;
const Category = mongoose.model('Category', CategorySchema, 'categories');

// Función para simplificar nombres (minúscula, sin acentos)
function simplifyName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s]/g, '') // Remover caracteres especiales
    .trim();
}

// Función para extraer subcategorías de una URL
async function extractSubcategories(url, categoryName) {
  console.log(`🔍 Extrayendo subcategorías de: ${categoryName}`);
  console.log(`🌐 URL: ${url}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      defaultViewport: { width: 1366, height: 768 }
    });

    const page = await browser.newPage();

    // Configurar user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Ir a la URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Esperar a que cargue el contenido
      await new Promise(resolve => setTimeout(resolve, 5000));
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
      console.log('🔄 Intentando usar contenedor de Categoría como fallback automático...');

      // Fallback automático: buscar contenedor de Categoría
      const categoryContainer = await page.evaluate(() => {
        try {
          const containers = document.querySelectorAll('.vtex-search-result-3-x-filter__container');
          console.log(`📊 Buscando contenedor de Categoría entre ${containers.length} contenedores...`);

          // Buscar contenedor de "Categoría" - intentar múltiples títulos posibles
          const possibleTitles = ['Categorías', 'Categoría', 'Categoria', 'Categorias'];

          for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            const titleElement = container.querySelector('.vtex-search-result-3-x-filterTitle span');
            if (titleElement) {
              const titleText = titleElement.textContent.trim();
              console.log(`📋 Contenedor ${i + 1}: "${titleText}"`);

              // Check if title matches any of the possible titles
              if (possibleTitles.some(title => titleText.includes(title) || title.includes(titleText))) {
                console.log(`✅ Contenedor de Categoría encontrado en contenedor ${i + 1} con título "${titleText}"`);
                return {
                  className: container.className,
                  index: i + 1,
                  title: titleText
                };
              }
            }
          }

          // Si no encontramos por título, buscar por posición (generalmente el segundo contenedor)
          if (containers.length >= 2) {
            console.log('🔍 Intentando con el segundo contenedor por defecto...');
            const container = containers[1];
            const titleElement = container.querySelector('.vtex-search-result-3-x-filterTitle span');
            const titleText = titleElement ? titleElement.textContent.trim() : 'Sin título';
            console.log(`📋 Usando contenedor 2 por defecto: "${titleText}"`);
            return {
              className: container.className,
              index: 2,
              title: titleText
            };
          }

          return null;
        } catch (error) {
          console.log(`❌ Error buscando contenedor de Categoría: ${error.message}`);
          return null;
        }
      });

      if (!categoryContainer) {
        console.log('❌ No se encontró contenedor de Categoría como fallback');
        return [];
      }

      console.log('✅ Usando contenedor de Categoría como subcategorías');
      console.log('📊 Contenedor encontrado:', categoryContainer.className);
      console.log('📊 Posición del contenedor:', categoryContainer.index);
      console.log('📊 Título del contenedor:', categoryContainer.title);

      // Usar el contenedor de Categoría como si fuera de subcategorías
      const containerSelector = `.${categoryContainer.className.replace(/\s+/g, '.')}`;

      // Extraer las categorías como subcategorías
      const subcategories = await page.evaluate((containerSelector) => {
        try {
          const container = document.querySelector(containerSelector);
          if (!container) {
            console.log('❌ Contenedor no encontrado en evaluate');
            return [];
          }

          const results = [];
          const filterItems = container.querySelectorAll('.vtex-search-result-3-x-filterItem');

          console.log(`📊 Procesando ${filterItems.length} elementos de categoría como subcategorías en evaluate`);

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
                  selector: `.vtex-search-result-3-x-filterItem:nth-child(${index + 1}) .vtex-checkbox__label`,
                  isFallback: true // Marcar como fallback automático
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

          console.log(`✅ Encontradas ${results.length} categorías como subcategorías (fallback automático)`);
          return results;
        } catch (error) {
          console.log(`❌ Error en evaluate fallback automático: ${error.message}`);
          return [];
        }
      }, containerSelector);

      console.log(`✅ Encontradas ${subcategories.length} subcategorías (usando Categoría como fallback) para ${categoryName}`);
      return subcategories;
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
      // Buscar por patrones de texto del botón (Mostrar X más)
      const buttonTexts = await page.$$eval('button', buttons =>
        buttons.map(btn => btn.textContent?.trim()).filter(text => text && text.match(/^Mostrar \d+ más$/))
      );

      if (buttonTexts.length > 0) {
        console.log(`🔍 Encontrados botones: ${buttonTexts.join(', ')}`);
        // Usar evaluate para encontrar el botón por texto
        showMoreButton = await page.evaluate((text) => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => btn.textContent?.trim() === text);
        }, buttonTexts[0]);
      }
    }

    if (!showMoreButton) {
      console.log('⚠️ No se encontró botón con patrón "Mostrar X más", buscando "Mostrar más"...');
      // Usar evaluate para encontrar el botón por texto
      showMoreButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => btn.textContent?.trim() === 'Mostrar más');
      });
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
      if (elementsAfter <= elementsBefore + 2) { // Solo si aumentaron menos de 3 elementos
        console.log('🔄 Intentando múltiples clicks en "Mostrar más"...');
        for (let i = 0; i < 3; i++) {
          try {
            // Verificar si el botón aún existe usando el mismo método que encontramos antes
            let buttonStillExists = await page.$(`${containerSelector} .vtex-search-result-3-x-seeMoreButton`);

            if (!buttonStillExists) {
              // Buscar por texto si no se encuentra por selector
              const buttonTexts = await page.$$eval('button', buttons =>
                buttons.map(btn => btn.textContent?.trim()).filter(text => text && text.match(/^Mostrar \d+ más$/))
              );

              if (buttonTexts.length > 0) {
                buttonStillExists = await page.evaluate((text) => {
                  const buttons = Array.from(document.querySelectorAll('button'));
                  return buttons.find(btn => btn.textContent?.trim() === text);
                }, buttonTexts[0]);
              }
            }

            if (buttonStillExists) {
              // Hacer click usando el método que funcionó antes
              const clickResult = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const showMoreButton = buttons.find(btn =>
                  btn.textContent?.trim().match(/^Mostrar \d+ más$/) ||
                  btn.textContent?.trim() === 'Mostrar más'
                );
                if (showMoreButton) {
                  showMoreButton.click();
                  return true;
                }
                return false;
              });

              if (clickResult) {
                await new Promise(resolve => setTimeout(resolve, 2000));

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
                console.log(`⚠️ No se pudo hacer click en el intento ${i + 2}`);
                break;
              }
            } else {
              console.log('ℹ️ Botón "Mostrar más" ya no existe');
              break;
            }
          } catch (error) {
            console.log(`⚠️ Error en click ${i + 2}: ${error.message}`);
            break;
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
    console.error('Stack trace:', error.stack);
    const isHeadless = true; // El script está configurado para headless
    if (!isHeadless) {
      console.log('🔍 Manteniendo el navegador abierto para debugging del error...');
      return [];
    } else {
      console.log('❌ Error en modo headless, cerrando navegador...');
      if (browser) {
        try {
          await browser.close();
          console.log('🔐 Navegador cerrado correctamente tras error');
        } catch (closeError) {
          console.error('⚠️ Error cerrando navegador:', closeError.message);
        }
      }
      return [];
    }
  } finally {
    // Cerrar navegador en modo headless
    const isHeadless = true; // El script está configurado para headless
    if (isHeadless && browser) {
      try {
        await browser.close();
        console.log('🔐 Navegador cerrado correctamente');
      } catch (closeError) {
        console.error('⚠️ Error cerrando navegador:', closeError.message);
      }
    }
  }
}

// Función principal
async function main() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Crear snapshot antes de cualquier modificación
    await createSnapshot();

    // Obtener todas las categorías de Jumbo
    const categories = await Category.find({ type: 'categoria_principal', isActive: true })
      .sort({ Nombre: 1 });

    console.log(`📊 Encontradas ${categories.length} categorías principales`);

    let totalSubcategories = 0;
    let totalFallbackCategories = 0;

    // Procesar cada categoría
    for (const category of categories) {
      console.log(`\n🔄 Procesando categoría: ${category.Nombre}`);

      const subcategories = await extractSubcategories(category.URL, category.Nombre);

      // Contar subcategorías del fallback
      const fallbackCount = subcategories.filter(sub => sub.isFallback).length;
      if (fallbackCount > 0) {
        console.log(`🎯 Usando ${fallbackCount} categorías como subcategorías (fallback automático)`);
        totalFallbackCategories += fallbackCount;
      }

      // Guardar/reemplazar subcategorías en la base de datos usando upsert
      const subcategoryIds = [];
      for (const sub of subcategories) {
        try {
          // Usar upsert para reemplazar subcategorías existentes o crear nuevas
          const subcategoryData = {
            Nombre: sub.text,
            nombre_simplificado: simplifyName(sub.text),
            type: 'subcategoria',
            Selector: sub.selector,
            level: 1,
            hasSubcategories: false, // Por defecto false, se puede actualizar después
            productCount: 0, // Por defecto 0, se puede actualizar después
            isActive: true,
            parent: category._id, // Referencia a la categoría padre
            updatedAt: new Date()
          };

          const savedSubcategory = await Category.findOneAndUpdate(
            {
              parent: category._id,
              nombre_simplificado: simplifyName(sub.text)
            },
            subcategoryData,
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            }
          );

          // Agregar el ID a la lista de subcategorías
          subcategoryIds.push(savedSubcategory._id);

          const action = savedSubcategory.upserted ? 'Creada' : 'Actualizada';
          const fallbackIndicator = sub.isFallback ? ' (fallback)' : '';
          console.log(`✅ ${action} subcategoría: ${sub.text}${fallbackIndicator} (ID: ${savedSubcategory._id})`);
        } catch (error) {
          console.error(`❌ Error guardando subcategoría ${sub.text}:`, error.message);
        }
      }

      // Actualizar la categoría padre con las referencias a las subcategorías
      try {
        await Category.findByIdAndUpdate(category._id, {
          subcategories: subcategoryIds,
          hasSubcategories: subcategoryIds.length > 0,
          updatedAt: new Date()
        });
        console.log(`✅ Actualizada categoría padre "${category.Nombre}" con ${subcategoryIds.length} subcategorías`);
      } catch (error) {
        console.error(`❌ Error actualizando categoría padre ${category.Nombre}:`, error.message);
      }

      totalSubcategories += subcategories.length;

      // Pequeña pausa entre requests para no sobrecargar (más larga para testing)
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('⏳ Pausa de 5 segundos antes de continuar...');
    }

    console.log(`\n✅ Proceso completado`);
    console.log(`📊 Total de categorías procesadas: ${categories.length}`);
    console.log(`📊 Total de subcategorías guardadas: ${totalSubcategories}`);
    console.log(`🎯 Total de categorías fallback: ${totalFallbackCategories}`);

    // Solo mostrar mensajes de revisión si no está en modo headless
    const isHeadless = true; // El script está configurado para headless
    if (!isHeadless) {
      console.log(`\n🔍 Revisa el navegador abierto para verificar el proceso.`);
      console.log(`ℹ️ Puedes cerrar el navegador cuando termines de revisar.`);
      console.log(`\n⏳ El script ha terminado. El navegador permanecerá abierto para tu revisión.`);
      console.log(`💡 Presiona Ctrl+C en la terminal para cerrar el script cuando termines.`);
    } else {
      console.log(`\n✅ Script ejecutado en modo headless exitosamente.`);
    }

  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
    const isHeadless = true; // El script está configurado para headless
    if (!isHeadless) {
      console.log('🔍 Manteniendo el navegador abierto para debugging...');
      // No cerrar automáticamente para permitir debugging
      process.exit(1);
    } else {
      console.log('❌ Error en modo headless, cerrando proceso...');
      process.exit(1);
    }
  } finally {
    // Cerrar conexión a MongoDB
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
    // En modo headless, el navegador ya se cerró en extractSubcategories
  }
}

// Ejecutar el script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { extractSubcategories };
