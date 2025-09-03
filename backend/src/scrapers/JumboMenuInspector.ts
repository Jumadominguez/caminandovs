import puppeteer, { Browser, Page } from 'puppeteer';

export class JumboMenuInspector {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Inicializa el inspector
   */
  async initialize(): Promise<void> {
    console.log('🔍 Inicializando inspector de menú...');

    this.browser = await puppeteer.launch({
      headless: false, // Navegador visible para inspección
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1366, height: 768 }
    });

    this.page = await this.browser.newPage();
    console.log('✅ Inspector inicializado');
  }

  /**
   * Navega a Jumbo y analiza la estructura del menú
   */
  async analyzeMenu(): Promise<void> {
    if (!this.page) {
      throw new Error('Inspector no inicializado');
    }

    try {
      console.log('🌐 Navegando a Jumbo...');
      await this.page.goto('https://www.jumbo.com.ar', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      console.log('⏳ Esperando carga completa...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Buscar posibles elementos del menú
      console.log('\n🔍 Buscando elementos del menú...');

      // Buscar botones que podrían ser el menú
      const buttons = await this.page.$$eval('button', (buttons) =>
        buttons.map((btn, index) => ({
          index,
          text: btn.textContent?.trim() || '',
          className: btn.className,
          ariaLabel: btn.getAttribute('aria-label') || '',
          dataTestId: btn.getAttribute('data-testid') || '',
          innerHTML: btn.innerHTML.substring(0, 100)
        }))
      );

      console.log('\n📋 Botones encontrados:');
      buttons.forEach((btn, index) => {
        if (btn.text || btn.ariaLabel || btn.dataTestId) {
          console.log(`${index}: "${btn.text}" | aria-label: "${btn.ariaLabel}" | data-testid: "${btn.dataTestId}" | class: "${btn.className}"`);
        }
      });

      // Buscar elementos con posibles clases de menú
      const menuElements = await this.page.$$eval('[class*="menu"], [class*="drawer"], [class*="hamburger"], [class*="toggle"]', (elements) =>
        elements.map((el, index) => {
          const htmlEl = el as HTMLElement;
          return {
            index,
            tagName: htmlEl.tagName,
            className: htmlEl.className,
            text: htmlEl.textContent?.trim() || '',
            ariaLabel: htmlEl.getAttribute('aria-label') || '',
            dataTestId: htmlEl.getAttribute('data-testid') || ''
          };
        })
      );

      console.log('\n🍔 Elementos de menú encontrados:');
      menuElements.forEach((el, index) => {
        console.log(`${index}: ${el.tagName} "${el.text}" | class: "${el.className}" | aria-label: "${el.ariaLabel}"`);
      });

      // Buscar elementos SVG que podrían ser íconos de menú
      const svgElements = await this.page.$$eval('svg', (svgs) =>
        svgs.map((svg, index) => ({
          index,
          className: svg.className.baseVal || '',
          parentClass: svg.parentElement?.className || '',
          ariaLabel: svg.getAttribute('aria-label') || ''
        }))
      );

      console.log('\n🎨 Elementos SVG encontrados:');
      svgElements.slice(0, 10).forEach((svg, index) => {
        console.log(`${index}: class: "${svg.className}" | parent: "${svg.parentClass}"`);
      });

      // Tomar captura de pantalla completa
      await this.page.screenshot({
        path: 'jumbo-menu-full-analysis.png',
        fullPage: true
      });
      console.log('\n📸 Captura completa guardada como jumbo-menu-full-analysis.png');

      // Mantener el navegador abierto para inspección manual
      console.log('\n🔍 El navegador está abierto para inspección manual.');
      console.log('Presiona Ctrl+C en la terminal para cerrar...');

      // Esperar input del usuario
      process.stdin.resume();

    } catch (error) {
      console.error('❌ Error en análisis:', error);
      throw error;
    }
  }

  /**
   * Cierra el navegador
   */
  async close(): Promise<void> {
    if (this.browser) {
      console.log('\n🔒 Cerrando navegador...');
      await this.browser.close();
      console.log('✅ Navegador cerrado');
    }
  }

  /**
   * Ejecuta el análisis completo
   */
  async run(): Promise<void> {
    try {
      await this.initialize();
      await this.analyzeMenu();

      // Mantener abierto hasta que el usuario presione Ctrl+C
      await new Promise(() => {}); // Esta promesa nunca se resuelve

    } catch (error) {
      console.error('❌ Error en inspector:', error);
    } finally {
      await this.close();
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const inspector = new JumboMenuInspector();
  inspector.run();
}

export default JumboMenuInspector;
