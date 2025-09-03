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
   * Ejecuta el scraper básico
   */
  async run(): Promise<void> {
    try {
      console.log('🎯 Iniciando scraper básico de Jumbo...');

      await this.initialize();
      await this.navigateToHome();
      await this.openCategoryMenu();

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
    .catch((error) => {
      console.error('❌ Error en scraper:', error);
      process.exit(1);
    });
}

export default JumboScraper;
