import puppeteer, { Browser, Page } from 'puppeteer';
import axios from 'axios';
import mongoose from 'mongoose';
import Supermarket from '../models/Supermarket';

interface ScrapedSupermarketInfo {
  name: string;
  baseUrl?: string;
  description?: string;
  logo?: string;
  logoTransparent?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
  };
  metaData?: {
    foundedYear?: number;
    totalStores?: number;
    coverage?: string[];
    services?: string[];
    headquarters?: string;
    ceo?: string;
    parentCompany?: string;
    marketPosition?: string;
    certifications?: string[];
    sustainability?: {
      recycling?: boolean;
      renewableEnergy?: boolean;
      carbonFootprint?: string;
    };
  };
  contactInfo?: {
    mainOffice?: string;
    customerService?: string;
    whatsapp?: string;
    emergencyContact?: string;
  };
}

interface SupermarketConfig {
  code: string;
  name: string;
  baseUrl: string;
  aboutUrl?: string;
  contactUrl?: string;
  selectors?: {
    description?: string;
    logo?: string;
    logoTransparent?: string;
    address?: string;
    phone?: string;
    email?: string;
    businessHours?: string;
    socialLinks?: string;
  };
}

export class SupermarketInfoScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  private supermarketConfigs: SupermarketConfig[] = [
    {
      code: 'jumbo',
      name: 'Jumbo',
      baseUrl: 'https://www.jumbo.com.ar',
      aboutUrl: 'https://www.jumbo.com.ar/institucional',
      contactUrl: 'https://www.jumbo.com.ar/contacto',
      selectors: {
        description: '.about-description, .company-description, [data-testid="about-text"]',
        logo: '.logo img, .brand-logo img, header img[alt*="Jumbo"]',
        logoTransparent: '.logo img, .brand-logo img, header img[alt*="Jumbo"]', // Intentará extraer el mismo logo
        address: '.address, .contact-address, [data-testid="address"]',
        phone: '.phone, .contact-phone, [data-testid="phone"]',
        email: '.email, .contact-email, [data-testid="email"]',
        businessHours: '.hours, .business-hours, [data-testid="hours"]',
        socialLinks: '.social-links a, .social-media a, [data-testid="social"]'
      }
    },
    {
      code: 'carrefour',
      name: 'Carrefour',
      baseUrl: 'https://www.carrefour.com.ar',
      aboutUrl: 'https://www.carrefour.com.ar/empresa',
      contactUrl: 'https://www.carrefour.com.ar/contacto',
      selectors: {
        description: '.about-company, .company-info, [data-testid="about"]',
        logo: '.logo img, .brand-logo img, header img[alt*="Carrefour"]',
        logoTransparent: '.logo img, .brand-logo img, header img[alt*="Carrefour"]',
        address: '.address, .contact-info, [data-testid="address"]',
        phone: '.phone, .telefono, [data-testid="phone"]',
        email: '.email, .correo, [data-testid="email"]',
        businessHours: '.horarios, .schedule, [data-testid="hours"]',
        socialLinks: '.redes-sociales a, .social a, [data-testid="social"]'
      }
    },
    {
      code: 'disco',
      name: 'Disco',
      baseUrl: 'https://www.disco.com.ar',
      aboutUrl: 'https://www.disco.com.ar/empresa',
      contactUrl: 'https://www.disco.com.ar/contacto',
      selectors: {
        description: '.about, .empresa, [data-testid="about"]',
        logo: '.logo img, .marca img, header img[alt*="Disco"]',
        logoTransparent: '.logo img, .marca img, header img[alt*="Disco"]',
        address: '.direccion, .address, [data-testid="address"]',
        phone: '.telefono, .phone, [data-testid="phone"]',
        email: '.email, .correo, [data-testid="email"]',
        businessHours: '.horarios, .hours, [data-testid="hours"]',
        socialLinks: '.social a, .redes a, [data-testid="social"]'
      }
    },
    {
      code: 'dia',
      name: 'Dia',
      baseUrl: 'https://www.dia.com.ar',
      aboutUrl: 'https://www.dia.com.ar/empresa',
      contactUrl: 'https://www.dia.com.ar/contacto',
      selectors: {
        description: '.about-us, .nosotros, [data-testid="about"]',
        logo: '.logo img, .brand img, header img[alt*="Dia"]',
        logoTransparent: '.logo img, .brand img, header img[alt*="Dia"]',
        address: '.address, .direccion, [data-testid="address"]',
        phone: '.phone, .telefono, [data-testid="phone"]',
        email: '.email, .correo, [data-testid="email"]',
        businessHours: '.hours, .horarios, [data-testid="hours"]',
        socialLinks: '.social-media a, .redes a, [data-testid="social"]'
      }
    },
    {
      code: 'vea',
      name: 'Vea',
      baseUrl: 'https://www.vea.com.ar',
      aboutUrl: 'https://www.vea.com.ar/empresa',
      contactUrl: 'https://www.vea.com.ar/contacto',
      selectors: {
        description: '.about-company, .empresa-info, .nosotros, [data-testid="about"]',
        logo: '.logo img, .brand-logo img, header img[alt*="Vea"]',
        logoTransparent: '.logo img, .brand-logo img, header img[alt*="Vea"]',
        address: '.address, .direccion, .contact-address, [data-testid="address"]',
        phone: '.phone, .telefono, .contact-phone, [data-testid="phone"]',
        email: '.email, .correo, .contact-email, [data-testid="email"]',
        businessHours: '.hours, .horarios, .business-hours, [data-testid="hours"]',
        socialLinks: '.social-links a, .social-media a, .redes-sociales a, [data-testid="social"]'
      }
    }
  ];

  /**
   * Inicializa el scraper
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 Inicializando Supermarket Info Scraper...');

      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      this.page = await this.browser.newPage();

      // Configurar user agent y headers
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await this.page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      });

      console.log('✅ Supermarket Info Scraper inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando scraper:', error);
      throw error;
    }
  }

  /**
   * Cierra el navegador
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /**
   * Extrae información de un supermercado específico
   */
  async scrapeSupermarketInfo(supermarketCode: string): Promise<ScrapedSupermarketInfo | null> {
    if (!this.page) {
      throw new Error('Scraper no inicializado. Llama a initialize() primero.');
    }

    const config = this.supermarketConfigs.find(s => s.code === supermarketCode);
    if (!config) {
      console.error(`❌ Configuración no encontrada para supermercado: ${supermarketCode}`);
      return null;
    }

    try {
      console.log(`🛍️  Extrayendo información de ${config.name}...`);

      const info: ScrapedSupermarketInfo = {
        name: config.name
      };

      // Intentar extraer información de la página principal
      await this.page.goto(config.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extraer logo
      if (config.selectors?.logo) {
        try {
          const logoElement = await this.page.$(config.selectors.logo);
          if (logoElement) {
            const logoSrc = await logoElement.evaluate(el => el.getAttribute('src'));
            if (logoSrc) {
              info.logo = logoSrc.startsWith('http') ? logoSrc : `${config.baseUrl}${logoSrc}`;
            }
          }
        } catch (error) {
          console.log(`⚠️  No se pudo extraer logo de ${config.name}`);
        }
      }

      // Extraer logo transparente
      if (config.selectors?.logoTransparent) {
        try {
          const logoTransparentElement = await this.page.$(config.selectors.logoTransparent);
          if (logoTransparentElement) {
            const logoTransparentSrc = await logoTransparentElement.evaluate(el => el.getAttribute('src'));
            if (logoTransparentSrc) {
              info.logoTransparent = logoTransparentSrc.startsWith('http') ? logoTransparentSrc : `${config.baseUrl}${logoTransparentSrc}`;
            }
          }
        } catch (error) {
          console.log(`⚠️  No se pudo extraer logo transparente de ${config.name}`);
        }
      }

      // Agregar logos transparentes conocidos como fallback
      if (!info.logoTransparent) {
        const knownTransparentLogos: { [key: string]: string } = {
          jumbo: 'https://logos-world.net/wp-content/uploads/2020/11/Jumbo-Logo.png',
          carrefour: 'https://logos-world.net/wp-content/uploads/2020/11/Carrefour-Logo.png',
          disco: 'https://logos-world.net/wp-content/uploads/2020/11/Disco-Logo.png',
          dia: 'https://logos-world.net/wp-content/uploads/2020/11/Dia-Logo.png',
          vea: 'https://logos-world.net/wp-content/uploads/2020/11/Vea-Logo.png'
        };

        if (knownTransparentLogos[supermarketCode]) {
          info.logoTransparent = knownTransparentLogos[supermarketCode];
          console.log(`✅ Logo transparente conocido agregado para ${config.name}`);
        }
      }

      // Intentar extraer información de la página "Acerca de" o "Empresa"
      if (config.aboutUrl) {
        try {
          await this.page.goto(config.aboutUrl, { waitUntil: 'networkidle2', timeout: 30000 });

          // Extraer descripción
          if (config.selectors?.description) {
            try {
              const descriptionElement = await this.page.$(config.selectors.description);
              if (descriptionElement) {
                const description = await descriptionElement.evaluate(el => el.textContent?.trim());
                if (description && description.length > 10) {
                  info.description = description;
                }
              }
            } catch (error) {
              console.log(`⚠️  No se pudo extraer descripción de ${config.name}`);
            }
          }
        } catch (error) {
          console.log(`⚠️  No se pudo acceder a la página "Acerca de" de ${config.name}`);
        }
      }

      // Intentar extraer información de contacto
      if (config.contactUrl) {
        try {
          await this.page.goto(config.contactUrl, { waitUntil: 'networkidle2', timeout: 30000 });

          // Extraer dirección
          if (config.selectors?.address) {
            try {
              const addressElement = await this.page.$(config.selectors.address);
              if (addressElement) {
                const address = await addressElement.evaluate(el => el.textContent?.trim());
                if (address) {
                  info.address = address;
                }
              }
            } catch (error) {
              console.log(`⚠️  No se pudo extraer dirección de ${config.name}`);
            }
          }

          // Extraer teléfono
          if (config.selectors?.phone) {
            try {
              const phoneElement = await this.page.$(config.selectors.phone);
              if (phoneElement) {
                const phone = await phoneElement.evaluate(el => el.textContent?.trim());
                if (phone) {
                  info.phone = phone;
                }
              }
            } catch (error) {
              console.log(`⚠️  No se pudo extraer teléfono de ${config.name}`);
            }
          }

          // Extraer email
          if (config.selectors?.email) {
            try {
              const emailElement = await this.page.$(config.selectors.email);
              if (emailElement) {
                const email = await emailElement.evaluate(el => el.textContent?.trim());
                if (email && email.includes('@')) {
                  info.email = email;
                }
              }
            } catch (error) {
              console.log(`⚠️  No se pudo extraer email de ${config.name}`);
            }
          }

          // Extraer información adicional de contacto (WhatsApp, etc.)
          try {
            const pageText = await this.page.evaluate(() => document.body.textContent || '');
            const phoneRegex = /(\+?54|0)?[\s\-\.]?(\d{2,4})[\s\-\.]?(\d{6,8})/g;
            const whatsappRegex = /whatsapp|WhatsApp/gi;
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

            if (!info.contactInfo) info.contactInfo = {};

            // Buscar números de teléfono adicionales
            const phones = pageText.match(phoneRegex);
            if (phones && phones.length > 1) {
              info.contactInfo.customerService = phones[1];
            }

            // Buscar WhatsApp
            if (whatsappRegex.test(pageText)) {
              const whatsappMatch = pageText.match(/(\+?54|0)?[\s\-\.]?(\d{2,4})[\s\-\.]?(\d{6,8})/);
              if (whatsappMatch) {
                info.contactInfo.whatsapp = whatsappMatch[0];
              }
            }

            // Buscar emails adicionales
            const emails = pageText.match(emailRegex);
            if (emails && emails.length > 1) {
              info.contactInfo.emergencyContact = emails[1];
            }
          } catch (error) {
            console.log(`⚠️  No se pudo extraer información adicional de contacto de ${config.name}`);
          }

          // Extraer redes sociales
          if (config.selectors?.socialLinks) {
            try {
              const socialLinks = await this.page.$$(config.selectors.socialLinks);
              if (socialLinks.length > 0) {
                info.socialMedia = {};

                for (const link of socialLinks) {
                  const href = await link.evaluate(el => el.getAttribute('href'));
                  const text = await link.evaluate(el => el.textContent?.toLowerCase() || '');

                  if (href) {
                    if (text.includes('facebook') || href.includes('facebook.com')) {
                      info.socialMedia!.facebook = href;
                    } else if (text.includes('instagram') || href.includes('instagram.com')) {
                      info.socialMedia!.instagram = href;
                    } else if (text.includes('twitter') || href.includes('twitter.com') || href.includes('x.com')) {
                      info.socialMedia!.twitter = href;
                    } else if (text.includes('youtube') || href.includes('youtube.com')) {
                      info.socialMedia!.youtube = href;
                    } else if (text.includes('linkedin') || href.includes('linkedin.com')) {
                      info.socialMedia!.linkedin = href;
                    } else if (text.includes('tiktok') || href.includes('tiktok.com')) {
                      info.socialMedia!.tiktok = href;
                    }
                  }
                }
              }
            } catch (error) {
              console.log(`⚠️  No se pudieron extraer redes sociales de ${config.name}`);
            }
          }
        } catch (error) {
          console.log(`⚠️  No se pudo acceder a la página de contacto de ${config.name}`);
        }
      }

      // Agregar metadatos específicos por supermercado
      const defaultMetaData = {
        jumbo: {
          foundedYear: 1974,
          totalStores: 150,
          coverage: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán'],
          services: ['Delivery', 'Retiro en tienda', 'Compra online', 'Tarjeta Jumbo Más'],
          headquarters: 'Buenos Aires',
          parentCompany: 'Cencosud',
          marketPosition: 'Líder en Argentina'
        },
        carrefour: {
          foundedYear: 1959,
          totalStores: 120,
          coverage: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Salta'],
          services: ['Delivery', 'Retiro en tienda', 'Compra online', 'Club Carrefour'],
          headquarters: 'Buenos Aires',
          parentCompany: 'Carrefour Group',
          marketPosition: 'Multinacional líder'
        },
        disco: {
          foundedYear: 1960,
          totalStores: 80,
          coverage: ['Buenos Aires', 'La Plata', 'Mar del Plata', 'Bahía Blanca'],
          services: ['Delivery', 'Retiro en tienda', 'Compra online'],
          headquarters: 'Buenos Aires',
          parentCompany: 'Walmart',
          marketPosition: 'Cadena regional'
        },
        dia: {
          foundedYear: 1979,
          totalStores: 200,
          coverage: ['Buenos Aires', 'Córdoba', 'Rosario', 'La Plata'],
          services: ['Delivery', 'Retiro en tienda', 'Compra online'],
          headquarters: 'Madrid, España',
          parentCompany: 'Dia Group',
          marketPosition: 'Proximidad y conveniencia'
        },
        vea: {
          foundedYear: 1993,
          totalStores: 95,
          coverage: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Entre Ríos', 'Corrientes'],
          services: ['Delivery', 'Retiro en tienda', 'Compra online', 'Club Vea'],
          headquarters: 'Buenos Aires',
          parentCompany: 'Jumbo Retail',
          marketPosition: 'Supermercado moderno'
        }
      };

      info.metaData = defaultMetaData[supermarketCode as keyof typeof defaultMetaData] || {
        coverage: ['Argentina'],
        services: ['Compra online', 'Delivery']
      };

      console.log(`✅ Información extraída de ${config.name}`);
      return info;

    } catch (error) {
      console.error(`❌ Error extrayendo información de ${config.name}:`, error);
      return null;
    }
  }

  /**
   * Extrae información de todos los supermercados
   */
  async scrapeAllSupermarkets(): Promise<void> {
    console.log('🛍️  Iniciando scraping de información de todos los supermercados...');

    for (const config of this.supermarketConfigs) {
      try {
        const info = await this.scrapeSupermarketInfo(config.code);
        if (info) {
          await this.saveSupermarketInfo(config.code, info);
        }
      } catch (error) {
        console.error(`❌ Error procesando ${config.name}:`, error);
      }
    }

    console.log('✅ Scraping de información de supermercados completado');
  }

  /**
   * Guarda la información del supermercado en la base de datos
   */
  private async saveSupermarketInfo(code: string, info: ScrapedSupermarketInfo): Promise<void> {
    try {
      console.log(`💾 Guardando información de ${info.name}...`);

      // Obtener la configuración del supermercado para incluir baseUrl
      const config = this.supermarketConfigs.find(s => s.code === code);
      
      const updateData = {
        ...info,
        baseUrl: config?.baseUrl || info.baseUrl, // Asegurar que baseUrl esté incluido
        lastScraped: new Date()
      };

      // Actualizar o crear el registro
      const result = await Supermarket.findOneAndUpdate(
        { code },
        updateData,
        {
          upsert: true,
          new: true,
          runValidators: true
        }
      );

      console.log(`✅ Información de ${info.name} guardada correctamente (ID: ${result._id})`);
    } catch (error) {
      console.error(`❌ Error guardando información de ${info.name}:`, error);
      throw error;
    }
  }

  /**
   * Ejecuta el scraper completo
   */
  async run(): Promise<void> {
    try {
      // Conectar a MongoDB
      require('dotenv').config();
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caminando-online');
      console.log('✅ Conectado a MongoDB');

      await this.initialize();
      await this.scrapeAllSupermarkets();
    } catch (error) {
      console.error('❌ Error ejecutando Supermarket Info Scraper:', error);
      throw error;
    } finally {
      await this.close();
      await mongoose.disconnect();
      console.log('✅ Desconectado de MongoDB');
    }
  }
}

export default SupermarketInfoScraper;
