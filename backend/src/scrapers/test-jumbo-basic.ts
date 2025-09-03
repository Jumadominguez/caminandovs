import JumboScraper from './JumboScraper';

/**
 * Script de prueba para el scraper básico de Jumbo
 */
async function testBasicScraper() {
  console.log('🧪 Iniciando prueba del scraper básico de Jumbo...\n');

  const scraper = new JumboScraper();

  try {
    await scraper.run();
    console.log('\n✅ Prueba completada exitosamente');
  } catch (error) {
    console.error('\n❌ Error en la prueba:', error);
  }
}

// Ejecutar la prueba
testBasicScraper();
