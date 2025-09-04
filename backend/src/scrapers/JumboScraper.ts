import puppeteer, { Browser, Page } from 'puppeteer';

export class JumboScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Inicializa el scraper abriendo el navegador y la página
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 Inicializando scraper de Jumbo...');

      this.browser = await puppeteer.launch({
        headless: false, // Para ver el navegador durante el desarrollo
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      this.page = await this.browser.newPage();

      // Configurar viewport
      await this.page.setViewport({ width: 1366, height: 768 });

      console.log('✅ Scraper inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando scraper:', error);
      throw error;
    }
  }

  /**
   * Navega a la página principal de Jumbo
   */
  async navigateToHome(): Promise<void> {
    if (!this.page) {
      throw new Error('Scraper no inicializado. Llama a initialize() primero.');
    }

    try {
      console.log('🌐 Navegando a www.jumbo.com.ar...');
      await this.page.goto('https://www.jumbo.com.ar', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      console.log('✅ Página cargada correctamente');
    } catch (error) {
      console.error('❌ Error navegando a la página:', error);
      throw error;
    }
  }

  /**
   * Busca y abre el menú de categorías
   */
  async openCategoryMenu(): Promise<void> {
    if (!this.page) {
      throw new Error('Scraper no inicializado. Llama a initialize() primero.');
    }

    try {
      console.log('🔍 Buscando menú de categorías...');

      // Esperar a que la página cargue completamente
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Selectores posibles para el menú hamburguesa/categorías
      const menuSelectors = [
        '.vtex-menu-2-x-menuItem--category-menu', // Selector encontrado por el inspector
        '.vtex-menu-2-x-styledLink--category-menu', // Enlace del menú
        '[class*="menuItem"][class*="category"]', // Patrón genérico
        'li[class*="menuItem"]:has-text("CATEGORÍAS")', // Selector específico con texto
        'nav li:has-text("CATEGORÍAS")', // Otro patrón
        '.menu-toggle',
        '.hamburger-menu',
        '.mobile-menu-toggle'
      ];

      let menuFound = false;

      for (const selector of menuSelectors) {
        try {
          console.log(`🔍 Probando selector: ${selector}`);
          const element = await this.page.$(selector);

          if (element) {
            console.log(`✅ Menú encontrado con selector: ${selector}`);
            await element.click();
            menuFound = true;

            // Esperar a que se abra el menú
            await new Promise(resolve => setTimeout(resolve, 1000));
            break;
          }
        } catch (error) {
          console.log(`❌ Selector ${selector} no funcionó:`, error instanceof Error ? error.message : String(error));
        }
      }

      if (!menuFound) {
        console.log('⚠️ No se encontró el menú con los selectores conocidos');
        console.log('📸 Tomando captura de pantalla para análisis...');

        // Tomar captura de pantalla para análisis manual
        await this.page.screenshot({
          path: 'jumbo-menu-analysis.png',
          fullPage: true
        });

        console.log('📸 Captura guardada como jumbo-menu-analysis.png');
      } else {
        console.log('✅ Menú de categorías abierto correctamente');
      }

    } catch (error) {
      console.error('❌ Error abriendo menú de categorías:', error);
      throw error;
    }
  }

  /**
   * Busca y hace click en la categoría "Almacén" dentro del menú desplegado
   */
  async clickAlmacenCategory(): Promise<void> {
    if (!this.page) {
      throw new Error('Scraper no inicializado. Llama a initialize() primero.');
    }

    try {
      console.log('🔍 Buscando categoría "Almacén" en el menú desplegado...');

      // Esperar a que el menú se abra completamente
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Selectores posibles para la categoría "Almacén"
      const almacenSelectors = [
        'a[href="/almacen"]', // Enlace directo a almacén
        'a[href*="almacen"]', // Cualquier enlace que contenga "almacen"
        '[class*="menuItem"]:has-text("Almacén")', // Elemento con texto "Almacén"
        '[class*="menuItem"]:has-text("ALMACÉN")', // Texto en mayúsculas
        'li:has-text("Almacén")', // Lista item con texto
        'li:has-text("ALMACÉN")', // Lista item en mayúsculas
        '.vtex-menu-2-x-menuItem a[href="/almacen"]', // Dentro del menú VTEX
        '.vtex-menu-2-x-styledLink[href="/almacen"]', // Enlace estilizado VTEX
        '[data-category="almacen"]', // Atributo data
        '[data-category="Almacén"]' // Atributo data con tilde
      ];

      let almacenFound = false;

      for (const selector of almacenSelectors) {
        try {
          console.log(`🔍 Probando selector para Almacén: ${selector}`);
          const elements = await this.page.$$(selector);

          if (elements.length > 0) {
            console.log(`✅ Categoría "Almacén" encontrada con selector: ${selector} (${elements.length} elementos)`);

            // Hacer click en el primer elemento encontrado
            await elements[0].click();
            almacenFound = true;

            // Esperar a que se cargue la página de la categoría
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('✅ Click en categoría "Almacén" realizado correctamente');
            break;
          }
        } catch (error) {
          console.log(`❌ Selector ${selector} no funcionó:`, error instanceof Error ? error.message : String(error));
        }
      }

      if (!almacenFound) {
        console.log('⚠️ No se encontró la categoría "Almacén" con los selectores conocidos');

        // Intentar búsqueda por texto como último recurso
        try {
          console.log('🔍 Intentando búsqueda por texto "Almacén"...');
          const elements = await this.page.$$('*');

          for (const element of elements) {
            try {
              const text = await this.page.evaluate(el => el.textContent?.trim(), element);
              if (text && (text.toLowerCase().includes('almacén') || text.toLowerCase().includes('almacen'))) {
                console.log(`✅ Elemento encontrado con texto: "${text}"`);
                await element.click();
                almacenFound = true;
                break;
              }
            } catch (e) {
              // Ignorar errores en elementos individuales
            }
          }
        } catch (error) {
          console.log('❌ Búsqueda por texto también falló:', error instanceof Error ? error.message : String(error));
        }

        if (!almacenFound) {
          console.log('📸 Tomando captura de pantalla para análisis del menú desplegado...');
          await this.page.screenshot({
            path: 'jumbo-menu-expanded-analysis.png',
            fullPage: true
          });
          console.log('📸 Captura guardada como jumbo-menu-expanded-analysis.png');
        }
      }

    } catch (error) {
      console.error('❌ Error buscando categoría "Almacén":', error);
      throw error;
    }
  }

  /**
   * Ejecuta el scraper completo: abre menú y hace click en Almacén
   */
  async run(): Promise<void> {
    try {
      console.log('🎯 Iniciando scraper completo de Jumbo...');

      await this.initialize();
      await this.navigateToHome();
      await this.openCategoryMenu();
      await this.clickAlmacenCategory();

      console.log('🎉 Scraper ejecutado exitosamente');

      // Mantener el navegador abierto por 5 segundos para ver el resultado
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
      console.error('💥 Error en el scraper:', error);
      throw error;
    } finally {
      await this.close();
    }
  }

  /**
   * Cierra el navegador
   */
  async close(): Promise<void> {
    if (this.browser) {
      console.log('🔒 Cerrando navegador...');
      await this.browser.close();
      this.browser = null;
      this.page = null;
      console.log('✅ Navegador cerrado');
    }
  }
}

// Función para ejecutar el scraper si se llama directamente
if (require.main === module) {
  const scraper = new JumboScraper();
  scraper.run()
    .then(() => {
      console.log('✅ Scraper completado exitosamente');
      process.exit(0);
    })
    .catch((error: any) => {
      console.error('❌ Error en scraper:', error);
      process.exit(1);
    });
}

export default JumboScraper;
