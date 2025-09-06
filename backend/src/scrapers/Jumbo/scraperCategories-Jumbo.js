const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Configuración del supermercado
const SUPERMARKET_CONFIG = {
  code: 'jumbo',
  name: 'Jumbo',
  baseUrl: 'https://www.jumbo.com.ar',
  aboutUrl: 'https://www.jumbo.com.ar/institucional',
  contactUrl: 'https://www.jumbo.com.ar/contacto',
  selectors: {
    description: '.about-description, .company-description, [data-testid="about-text"]',
    logo: 'img[alt*="Jumbo"], .logo img, .brand-logo img, header img',
    logoTransparent: 'img[alt*="Jumbo"], .logo img, .brand-logo img, header img',
    address: '.address, .contact-address, [data-testid="address"]',
    phone: '.phone, .contact-phone, [data-testid="phone"]',
    email: '.email, .contact-email, [data-testid="email"]',
    businessHours: '.hours, .business-hours, [data-testid="hours"]',
    socialLinks: '.social-links a, .social-media a, [data-testid="social"]'
  }
};

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

// Modelo de Supermercado
const SupermarketSchema = new mongoose.Schema({
  code: String,
  name: String,
  baseUrl: String,
  description: String,
  logo: String,
  logoTransparent: String,
  address: String,
  phone: String,
  email: String,
  website: String,
  businessHours: Object,
  socialMedia: Object,
  metaData: Object,
  contactInfo: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Variables globales
let browser;
let page;
let Category;
let Supermarket;
let CategoryRaw;
let SupermarketRaw;

/**
 * Función helper para simplificar nombres con normalización Unicode
 */
function simplifyName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos y diacríticos
    .replace(/[^a-z0-9]/g, '-') // Reemplazar caracteres especiales con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
}

/**
 * Conectar a MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Jumbo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB (base de datos: Jumbo)');

    // Forzar el uso del esquema actualizado
    delete mongoose.models.Category;
    delete mongoose.models.Supermarket;
    delete mongoose.models.CategoryRaw;
    delete mongoose.models.SupermarketRaw;

    Category = mongoose.model('Category', CategorySchema, 'categories');
    Supermarket = mongoose.model('Supermarket', SupermarketSchema, 'supermarkets');

    // Modelos para colecciones raw (temporal)
    CategoryRaw = mongoose.model('CategoryRaw', CategorySchema, 'categories-raw');
    SupermarketRaw = mongoose.model('SupermarketRaw', SupermarketSchema, 'supermarkets-raw');

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}

/**
 * Inicializar navegador
 */
async function initBrowser() {
  console.log('🌐 Inicializando navegador...');
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

  page = await browser.newPage();

  // Configurar user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  console.log('✅ Navegador inicializado');
}

/**
 * PASO 1: Extraer información del supermercado
 */
async function scrapeSupermarketInfo() {
  console.log('\n🏪 PASO 1: Extrayendo información del supermercado...');

  try {
    const info = {
      code: SUPERMARKET_CONFIG.code,
      name: SUPERMARKET_CONFIG.name,
      baseUrl: SUPERMARKET_CONFIG.baseUrl,
      website: SUPERMARKET_CONFIG.baseUrl,
      updatedAt: new Date()
    };

    // Ir a la página principal
    await page.goto(SUPERMARKET_CONFIG.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extraer logo con múltiples estrategias
    try {
      // Estrategia 1: Buscar el logo oficial por clase específica
      let logoSrc = await page.$eval('.vtex-store-components-3-x-logoImage--header-logo', img => img.src).catch(() => null);

      // Estrategia 2: Buscar por selector de logo en header
      if (!logoSrc) {
        logoSrc = await page.$eval('header img[alt*="Jumbo"]', img => img.src).catch(() => null);
      }

      // Estrategia 3: Buscar por alt text exacto "Jumbo"
      if (!logoSrc) {
        logoSrc = await page.$eval('img[alt*="Jumbo"]', img => img.src).catch(() => null);
      }

      if (logoSrc) {
        console.log(`✅ Logo extraído: ${logoSrc}`);
        info.logo = logoSrc;
      } else {
        console.log('⚠️ No se pudo extraer el logo');
      }
    } catch (error) {
      console.log('⚠️ No se pudo extraer el logo');
    }

    // Intentar extraer descripción de la página principal
    try {
      // Buscar texto descriptivo en la página principal
      const pageText = await page.$eval('body', body => body.textContent).catch(() => '');

      // Buscar frases que puedan servir como descripción
      const descriptionCandidates = [
        /Jumbo[^.]*es[^.]*\./i,
        /somos[^.]*\./i,
        /empresa[^.]*\./i
      ];

      for (const regex of descriptionCandidates) {
        const match = pageText.match(regex);
        if (match) {
          info.description = match[0].trim();
          console.log(`✅ Descripción extraída: ${info.description}`);
          break;
        }
      }

      // Si no encontramos descripción específica, usar una genérica
      if (!info.description) {
        info.description = 'Jumbo es una cadena de supermercados líder en Argentina.';
        console.log(`ℹ️ Usando descripción genérica: ${info.description}`);
      }
    } catch (error) {
      console.log('⚠️ No se pudo extraer la descripción');
      info.description = 'Jumbo es una cadena de supermercados líder en Argentina.';
    }

    // Agregar información de contacto básica
    info.contactInfo = {
      website: SUPERMARKET_CONFIG.baseUrl,
      email: 'contacto@jumbo.com.ar', // Email genérico conocido
      socialMedia: {
        facebook: 'https://www.facebook.com/JumboArgentina',
        instagram: 'https://www.instagram.com/jumboargentina'
      }
    };

    // Guardar información del supermercado en colección raw
    await SupermarketRaw.findOneAndUpdate(
      { code: SUPERMARKET_CONFIG.code },
      info,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('✅ Información del supermercado guardada en supermarkets-raw');

  } catch (error) {
    console.error('❌ Error extrayendo información del supermercado:', error.message);
    throw error;
  }
}

/**
 * PASO 2: Extraer categorías principales
 */
async function scrapeCategories() {
  console.log('\n📂 PASO 2: Extrayendo categorías principales...');

  try {
    // Ir a la página principal
    await page.goto(SUPERMARKET_CONFIG.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Buscar el elemento del menú de categorías
    const menuSelectors = [
      '.vtex-menu-2-x-menuItem--category-menu',
      '.vtex-menu-2-x-menuItem--header-category',
      '[data-testid="category-menu"]',
      '.category-menu-item'
    ];

    let menuElement = null;
    for (const selector of menuSelectors) {
      menuElement = await page.$(selector);
      if (menuElement) {
        console.log(`🎯 Elemento encontrado con selector: ${selector}`);
        break;
      }
    }

    if (!menuElement) {
      throw new Error('No se pudo encontrar el menú de categorías');
    }

    // Hacer hover sobre el menú
    console.log('🖱️ Realizando hover...');
    await menuElement.hover();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extraer categorías del menú desplegado
    console.log('📋 Extrayendo categorías del menú desplegado...');
    const categories = await page.$$eval('.vtex-menu-2-x-styledLink', links => {
      return links.map(link => ({
        name: link.textContent?.trim(),
        url: link.href,
        selector: link.getAttribute('data-testid') || ''
      })).filter(cat => cat.name && cat.name.length > 0);
    });

    console.log('📋 Categorías encontradas:');
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. "${cat.name}" -> ${cat.url}`);
    });

    // Filtrar categorías incorrectas (elementos del menú que no son categorías de productos)
    const filteredCategories = categories.filter(cat => {
      const name = cat.name.toLowerCase();
      const isValid = !['categorías', 'ofertas'].includes(name) && cat.url && cat.url !== '#';
      if (!isValid) {
        console.log(`⚠️ Filtrando categoría inválida: "${cat.name}" (URL: ${cat.url})`);
      }
      return isValid;
    });

    console.log(`✅ Se encontraron ${categories.length} elementos del menú, ${filteredCategories.length} categorías válidas`);

    // Guardar categorías principales
    for (const cat of filteredCategories) {
      const categoryData = {
        Nombre: cat.name,
        nombre_simplificado: simplifyName(cat.name),
        type: 'categoria_principal',
        URL: cat.url,
        Selector: cat.selector,
        level: 0,
        hasSubcategories: true,
        productCount: 0,
        isActive: true,
        subcategories: [],
        updatedAt: new Date()
      };

      await CategoryRaw.findOneAndUpdate(
        { Nombre: cat.name, type: 'categoria_principal' },
        categoryData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`✅ Categoría guardada: ${cat.name}`);
    }

    console.log('✅ Categorías principales guardadas');

  } catch (error) {
    console.error('❌ Error extrayendo categorías:', error.message);
    throw error;
  }
}

/**
 * PASO 3: Extraer subcategorías
 */
async function scrapeSubcategories() {
  console.log('\n📂 PASO 3: Extrayendo subcategorías...');

  try {
    // Obtener todas las categorías principales de la colección raw
    const mainCategories = await CategoryRaw.find({ type: 'categoria_principal' }).sort({ Nombre: 1 });
    console.log(`📊 Procesando ${mainCategories.length} categorías principales`);

    let totalSubcategories = 0;
    let totalFallbackCategories = 0;

    for (const category of mainCategories) {
      console.log(`\n🔄 Procesando categoría: ${category.Nombre}`);

      try {
        // Validar URL antes de navegar
        if (!category.URL || category.URL === '#' || category.URL.startsWith('javascript:')) {
          console.log(`⚠️ Saltando categoría "${category.Nombre}" - URL inválida: ${category.URL}`);
          continue;
        }

        // Ir a la página de la categoría
        await page.goto(category.URL, { waitUntil: 'networkidle2', timeout: 60000 });
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

        let subcategories = [];

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
            console.log('⚠️ No se encontraron subcategorías para esta categoría');
            continue;
          }

          console.log('✅ Usando contenedor de Categoría como subcategorías');
          console.log('📊 Contenedor encontrado:', categoryContainer.className);
          console.log('📊 Posición del contenedor:', categoryContainer.index);
          console.log('📊 Título del contenedor:', categoryContainer.title);

          // Usar el contenedor de Categoría como si fuera de subcategorías
          const containerSelector = `.${categoryContainer.className.replace(/\s+/g, '.')}`;

          // Extraer las categorías como subcategorías
          subcategories = await page.evaluate((containerSelector) => {
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

          console.log(`✅ Encontradas ${subcategories.length} subcategorías (usando Categoría como fallback) para ${category.Nombre}`);

          // Contar subcategorías del fallback
          const fallbackCount = subcategories.filter(sub => sub.isFallback).length;
          if (fallbackCount > 0) {
            console.log(`🎯 Usando ${fallbackCount} categorías como subcategorías (fallback automático)`);
            totalFallbackCategories += fallbackCount;
          }

        } else {
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

          subcategories = await page.evaluate((containerSelector) => {
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

          console.log(`✅ Encontradas ${subcategories.length} subcategorías para ${category.Nombre}`);
        }

        // Función para simplificar nombres (usando la función global)
        function simplifyNameLocal(name) {
          return simplifyName(name);
        }

        // Guardar subcategorías en la base de datos usando upsert
        const subcategoryIds = [];
        for (const sub of subcategories) {
          try {
            const subcategoryData = {
              Nombre: sub.text || sub.name,
              nombre_simplificado: simplifyNameLocal(sub.text || sub.name),
              type: 'subcategoria',
              Selector: sub.selector || '',
              level: 1,
              hasSubcategories: false,
              productCount: 0,
              isActive: true,
              parent: category._id,
              updatedAt: new Date()
            };

            const savedSubcategory = await CategoryRaw.findOneAndUpdate(
              {
                parent: category._id,
                nombre_simplificado: simplifyNameLocal(sub.text || sub.name)
              },
              subcategoryData,
              {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
              }
            );

            subcategoryIds.push(savedSubcategory._id);

            const action = savedSubcategory.upserted ? 'Creada' : 'Actualizada';
            const fallbackIndicator = sub.isFallback ? ' (fallback)' : '';
            console.log(`✅ ${action} subcategoría: ${sub.text || sub.name}${fallbackIndicator} (ID: ${savedSubcategory._id})`);
          } catch (error) {
            console.error(`❌ Error guardando subcategoría ${sub.text || sub.name}:`, error.message);
          }
        }

        // Actualizar la categoría padre con las referencias a las subcategorías
        try {
          await CategoryRaw.findByIdAndUpdate(category._id, {
            subcategories: subcategoryIds,
            hasSubcategories: subcategoryIds.length > 0,
            updatedAt: new Date()
          });
          console.log(`✅ Actualizada categoría padre "${category.Nombre}" con ${subcategoryIds.length} subcategorías`);
        } catch (error) {
          console.error(`❌ Error actualizando categoría padre ${category.Nombre}:`, error.message);
        }

        totalSubcategories += subcategories.length;

        // Pequeña pausa entre requests para no sobrecargar
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('⏳ Pausa de 5 segundos antes de continuar...');

      } catch (error) {
        console.error(`❌ Error procesando categoría ${category.Nombre}:`, error.message);
      }
    }

    console.log(`\n✅ Subcategorías completadas:`);
    console.log(`📊 Total de subcategorías guardadas: ${totalSubcategories}`);
    console.log(`🎯 Total de categorías fallback: ${totalFallbackCategories}`);

  } catch (error) {
    console.error('❌ Error extrayendo subcategorías:', error.message);
    throw error;
  }
}

/**
 * Generar reporte comparativo y reemplazar colecciones
 */
async function generateReportAndReplaceCollections() {
  console.log('\n📊 PASO 4: Generando reporte comparativo con snapshot y reemplazando colecciones...');

  try {
    // Obtener datos de las colecciones raw
    const rawCategories = await CategoryRaw.find({}).sort({ type: 1, Nombre: 1 });
    const rawSupermarkets = await SupermarketRaw.find({});

    // Obtener datos de las colecciones actuales
    const currentCategories = await Category.find({}).sort({ type: 1, Nombre: 1 });
    const currentSupermarkets = await Supermarket.find({});

    console.log(`📊 Datos raw - Categorías: ${rawCategories.length}, Supermercados: ${rawSupermarkets.length}`);
    console.log(`📊 Datos actuales - Categorías: ${currentCategories.length}, Supermercados: ${currentSupermarkets.length}`);

    // Crear reporte comparativo
    let reportContent = `# Reporte Comparativo de Scraping - Jumbo\n\n`;
    reportContent += `**Fecha de generación:** ${new Date().toISOString()}\n\n`;

    // Snapshot de colecciones actuales
    reportContent += `## Snapshot de Colecciones Actuales\n\n`;
    reportContent += `### Supermercados\n\n`;
    if (currentSupermarkets.length > 0) {
      currentSupermarkets.forEach((supermarket, index) => {
        reportContent += `**${index + 1}. ${supermarket.name}**\n`;
        reportContent += `- Código: ${supermarket.code}\n`;
        reportContent += `- URL Base: ${supermarket.baseUrl}\n`;
        reportContent += `- Descripción: ${supermarket.description || 'No disponible'}\n`;
        reportContent += `- Logo: ${supermarket.logo || 'No disponible'}\n\n`;
      });
    } else {
      reportContent += `No hay supermercados en la colección actual.\n\n`;
    }

    reportContent += `### Categorías\n\n`;
    if (currentCategories.length > 0) {
      const currentMainCategories = currentCategories.filter(cat => cat.type === 'categoria_principal');
      const currentSubcategories = currentCategories.filter(cat => cat.type === 'subcategoria');

      reportContent += `**Categorías Principales:** ${currentMainCategories.length}\n\n`;
      currentMainCategories.forEach((cat, index) => {
        reportContent += `${index + 1}. ${cat.Nombre}\n`;
      });
      reportContent += `\n**Subcategorías:** ${currentSubcategories.length}\n\n`;
      currentSubcategories.slice(0, 10).forEach((cat, index) => {
        reportContent += `${index + 1}. ${cat.Nombre}\n`;
      });
      if (currentSubcategories.length > 10) {
        reportContent += `... y ${currentSubcategories.length - 10} más\n`;
      }
      reportContent += `\n`;
    } else {
      reportContent += `No hay categorías en la colección actual.\n\n`;
    }

    // Estadísticas de categorías
    const rawMainCategories = rawCategories.filter(cat => cat.type === 'categoria_principal');
    const rawSubcategories = rawCategories.filter(cat => cat.type === 'subcategoria');
    const currentMainCategories = currentCategories.filter(cat => cat.type === 'categoria_principal');
    const currentSubcategories = currentCategories.filter(cat => cat.type === 'subcategoria');

    reportContent += `## Estadísticas de Categorías\n\n`;
    reportContent += `| Colección | Categorías Principales | Subcategorías | Total |\n`;
    reportContent += `|----------|----------------------|---------------|-------|\n`;
    reportContent += `| Raw (nuevo) | ${rawMainCategories.length} | ${rawSubcategories.length} | ${rawCategories.length} |\n`;
    reportContent += `| Actual | ${currentMainCategories.length} | ${currentSubcategories.length} | ${currentCategories.length} |\n\n`;

    // Comparación detallada
    reportContent += `## Comparación Detallada\n\n`;

    // Comparación de supermercados
    reportContent += `### Supermercados\n\n`;
    if (currentSupermarkets.length > 0 && rawSupermarkets.length > 0) {
      const currentSupermarket = currentSupermarkets[0];
      const rawSupermarket = rawSupermarkets[0];

      const supermarketChanges = [];
      if (currentSupermarket.name !== rawSupermarket.name) {
        supermarketChanges.push(`- Nombre: "${currentSupermarket.name}" → "${rawSupermarket.name}"`);
      }
      if (currentSupermarket.baseUrl !== rawSupermarket.baseUrl) {
        supermarketChanges.push(`- URL Base: "${currentSupermarket.baseUrl}" → "${rawSupermarket.baseUrl}"`);
      }
      if (currentSupermarket.description !== rawSupermarket.description) {
        supermarketChanges.push(`- Descripción actualizada`);
      }
      if (currentSupermarket.logo !== rawSupermarket.logo) {
        supermarketChanges.push(`- Logo actualizado`);
      }

      if (supermarketChanges.length > 0) {
        reportContent += `**Cambios en Supermercado:**\n`;
        supermarketChanges.forEach(change => {
          reportContent += `${change}\n`;
        });
        reportContent += `\n`;
      } else {
        reportContent += `No hay cambios en la información del supermercado.\n\n`;
      }
    } else if (rawSupermarkets.length > 0 && currentSupermarkets.length === 0) {
      reportContent += `**Nuevo supermercado agregado:** ${rawSupermarkets[0].name}\n\n`;
    }

    // Categorías nuevas
    const newCategories = rawMainCategories.filter(raw =>
      !currentMainCategories.some(curr => curr.Nombre === raw.Nombre)
    );
    if (newCategories.length > 0) {
      reportContent += `### Categorías Principales Nuevas (${newCategories.length})\n\n`;
      newCategories.forEach(cat => {
        reportContent += `- ${cat.Nombre}\n`;
      });
      reportContent += `\n`;
    }

    // Categorías eliminadas
    const removedCategories = currentMainCategories.filter(curr =>
      !rawMainCategories.some(raw => raw.Nombre === curr.Nombre)
    );
    if (removedCategories.length > 0) {
      reportContent += `### Categorías Principales Eliminadas (${removedCategories.length})\n\n`;
      removedCategories.forEach(cat => {
        reportContent += `- ${cat.Nombre}\n`;
      });
      reportContent += `\n`;
    }

    // Categorías existentes con cambios
    const existingCategories = rawMainCategories.filter(raw =>
      currentMainCategories.some(curr => curr.Nombre === raw.Nombre)
    );
    const categoriesWithChanges = [];

    existingCategories.forEach(rawCat => {
      const currentCat = currentMainCategories.find(curr => curr.Nombre === rawCat.Nombre);
      if (currentCat) {
        const changes = [];
        if (currentCat.URL !== rawCat.URL) {
          changes.push(`URL: "${currentCat.URL}" → "${rawCat.URL}"`);
        }
        if (currentCat.nombre_simplificado !== rawCat.nombre_simplificado) {
          changes.push(`Nombre simplificado: "${currentCat.nombre_simplificado}" → "${rawCat.nombre_simplificado}"`);
        }
        if (changes.length > 0) {
          categoriesWithChanges.push({
            name: rawCat.Nombre,
            changes: changes
          });
        }
      }
    });

    if (categoriesWithChanges.length > 0) {
      reportContent += `### Categorías Principales con Cambios (${categoriesWithChanges.length})\n\n`;
      categoriesWithChanges.forEach(cat => {
        reportContent += `**${cat.name}:**\n`;
        cat.changes.forEach(change => {
          reportContent += `- ${change}\n`;
        });
        reportContent += `\n`;
      });
    }

    // Comparación de subcategorías
    reportContent += `### Subcategorías\n\n`;

    // Subcategorías nuevas
    const newSubcategories = rawSubcategories.filter(raw =>
      !currentSubcategories.some(curr => curr.Nombre === raw.Nombre)
    );
    if (newSubcategories.length > 0) {
      reportContent += `**Nuevas (${newSubcategories.length}):**\n`;
      newSubcategories.slice(0, 20).forEach(sub => {
        reportContent += `- ${sub.Nombre}\n`;
      });
      if (newSubcategories.length > 20) {
        reportContent += `- ... y ${newSubcategories.length - 20} más\n`;
      }
      reportContent += `\n`;
    }

    // Subcategorías eliminadas
    const removedSubcategories = currentSubcategories.filter(curr =>
      !rawSubcategories.some(raw => raw.Nombre === curr.Nombre)
    );
    if (removedSubcategories.length > 0) {
      reportContent += `**Eliminadas (${removedSubcategories.length}):**\n`;
      removedSubcategories.slice(0, 20).forEach(sub => {
        reportContent += `- ${sub.Nombre}\n`;
      });
      if (removedSubcategories.length > 20) {
        reportContent += `- ... y ${removedSubcategories.length - 20} más\n`;
      }
      reportContent += `\n`;
    }

    // Resumen de cambios
    const totalChanges = newCategories.length + removedCategories.length + categoriesWithChanges.length + newSubcategories.length + removedSubcategories.length;

    reportContent += `## Resumen de Cambios\n\n`;
    reportContent += `| Tipo de Cambio | Cantidad |\n`;
    reportContent += `|----------------|----------|\n`;
    reportContent += `| Categorías principales nuevas | ${newCategories.length} |\n`;
    reportContent += `| Categorías principales eliminadas | ${removedCategories.length} |\n`;
    reportContent += `| Categorías principales modificadas | ${categoriesWithChanges.length} |\n`;
    reportContent += `| Subcategorías nuevas | ${newSubcategories.length} |\n`;
    reportContent += `| Subcategorías eliminadas | ${removedSubcategories.length} |\n`;
    reportContent += `| **Total de cambios** | **${totalChanges}** |\n\n`;

    if (totalChanges === 0) {
      reportContent += `🎉 **No se encontraron cambios entre la base de datos anterior y la nueva.**\n\n`;
    } else {
      reportContent += `⚠️ **Se encontraron ${totalChanges} cambios que serán aplicados a la base de datos.**\n\n`;
    }

    // Guardar reporte
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `scraping-report-${timestamp}.md`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, reportContent, 'utf8');
    console.log(`✅ Reporte comparativo guardado en: ${filepath}`);

    // Reemplazar colecciones
    console.log('🔄 Reemplazando colecciones...');

    // Limpiar colecciones actuales
    await Category.deleteMany({});
    await Supermarket.deleteMany({});

    // Copiar datos de raw a colecciones principales
    for (const cat of rawCategories) {
      const { _id, ...catData } = cat.toObject();
      await Category.create(catData);
    }

    for (const supermarket of rawSupermarkets) {
      const { _id, ...supermarketData } = supermarket.toObject();
      await Supermarket.create(supermarketData);
    }

    console.log(`✅ Colecciones reemplazadas - ${rawCategories.length} categorías y ${rawSupermarkets.length} supermercados`);

    // Limpiar colecciones raw
    await CategoryRaw.deleteMany({});
    await SupermarketRaw.deleteMany({});

    console.log('🧹 Colecciones raw limpiadas');

  } catch (error) {
    console.error('❌ Error en reporte y reemplazo:', error.message);
    throw error;
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log('🚀 Iniciando scraping completo de Jumbo...');

    await connectDB();
    await initBrowser();
    await scrapeSupermarketInfo();
    await scrapeCategories();
    await scrapeSubcategories();
    await generateReportAndReplaceCollections();

    console.log('\n🎉 ¡Scraping completo finalizado exitosamente!');
    console.log('📊 Resumen:');
    console.log('   ✅ Información del supermercado extraída');
    console.log('   ✅ Categorías principales procesadas');
    console.log('   ✅ Subcategorías extraídas con fallback automático');
    console.log('   ✅ Reporte comparativo con snapshot generado');
    console.log('   ✅ Colecciones reemplazadas sin duplicados');
    console.log('   ✅ Colecciones raw limpiadas');

  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Navegador cerrado');
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Conexión a MongoDB cerrada');
    }
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main();
}
