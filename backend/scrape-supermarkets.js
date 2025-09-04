#!/usr/bin/env node

const SupermarketInfoScraper = require('./dist/scrapers/SupermarketInfoScraper.js').default;

/**
 * Script para ejecutar el scraper de información de supermercados
 * Uso: node scrape-supermarkets.js [supermarket-code]
 *
 * Ejemplos:
 * - node scrape-supermarkets.js          # Scrape todos los supermercados
 * - node scrape-supermarkets.js jumbo    # Scrape solo Jumbo
 * - node scrape-supermarkets.js carrefour # Scrape solo Carrefour
 */

async function main() {
  const supermarketCode = process.argv[2]; // Argumento opcional

  try {
    const scraper = new SupermarketInfoScraper();

    if (supermarketCode) {
      console.log(`🎯 Ejecutando scraper para ${supermarketCode}...`);
      await scraper.initialize();

      const info = await scraper.scrapeSupermarketInfo(supermarketCode);
      if (info) {
        await scraper.saveSupermarketInfo(supermarketCode, info);
        console.log(`✅ Información de ${supermarketCode} guardada correctamente`);
      } else {
        console.log(`❌ No se pudo extraer información de ${supermarketCode}`);
      }

      await scraper.close();
    } else {
      console.log('🛍️ Ejecutando scraper para todos los supermercados...');
      await scraper.run();
    }

    console.log('✅ Script completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando el script:', error.message);
    process.exit(1);
  }
}

main();
