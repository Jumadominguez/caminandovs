import { Router } from 'express';
import Category from '../models/Category';

const router = Router();

// GET /api/categories - Obtener todas las categorías scrapeadas
router.get('/', async (req, res) => {
  try {
    const { supermarket, active = 'true' } = req.query;

    let query: any = {};

    // Filtrar por estado activo/inactivo
    if (active === 'true') {
      query.isActive = true;
    }

    // Filtrar por supermercado
    if (supermarket) {
      query.supermarket = supermarket;
    }

    const categories = await Category
      .find(query)
      .sort({ supermarket: 1, level: 1, name: 1 });

    // Estadísticas por supermercado
    const stats = await Category.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$supermarket',
          count: { $sum: 1 },
          lastScraped: { $max: '$lastScraped' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        stats,
        total: categories.length
      },
      message: 'Categorías scrapeadas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error getting scraped categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías scrapeadas'
    });
  }
});

// GET /api/categories/stats - Estadísticas de categorías
router.get('/stats', async (req, res) => {
  try {
    const stats = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$supermarket',
          totalCategories: { $sum: 1 },
          withSubcategories: {
            $sum: { $cond: ['$hasSubcategories', 1, 0] }
          },
          lastScraped: { $max: '$lastScraped' }
        }
      },
      { $sort: { totalCategories: -1 } }
    ]);

    const totalStats = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalCategories: { $sum: 1 },
          totalSupermarkets: { $addToSet: '$supermarket' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        bySupermarket: stats,
        overall: totalStats[0] || { totalCategories: 0, totalSupermarkets: [] }
      },
      message: 'Estadísticas de categorías obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error getting category stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de categorías'
    });
  }
});

// POST /api/categories/scrape - Trigger scraping manual (para desarrollo/testing)
router.post('/scrape', async (req, res) => {
  try {
    const { supermarket } = req.body;

    if (!supermarket) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere especificar el supermercado'
      });
    }

    // Aquí podríamos integrar el scraper, pero por ahora solo devolvemos un mensaje
    res.json({
      success: true,
      message: `Scraping programado para ${supermarket}`,
      note: 'Esta funcionalidad se implementará completamente en la siguiente tarea'
    });
  } catch (error) {
    console.error('Error triggering scrape:', error);
    res.status(500).json({
      success: false,
      message: 'Error al programar scraping'
    });
  }
});

export default router;
