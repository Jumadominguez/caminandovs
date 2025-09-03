import { Router, Request, Response } from 'express';
import Product from '../models/Product';

const router = Router();

// Lista de supermercados disponibles
const supermarkets = [
  { id: 'carrefour', name: 'Carrefour', active: true },
  { id: 'disco', name: 'Disco', active: true },
  { id: 'jumbo', name: 'Jumbo', active: true },
  { id: 'dia', name: 'Dia', active: true }
];

// GET /api/supermarkets - Obtener lista de supermercados
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: supermarkets.filter(s => s.active)
  });
});

// GET /api/supermarkets/:id - Obtener detalles de un supermercado
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const supermarket = supermarkets.find(s => s.id === id);

  if (!supermarket) {
    return res.status(404).json({
      success: false,
      message: 'Supermercado no encontrado'
    });
  }

  res.json({
    success: true,
    data: supermarket
  });
});

// GET /api/supermarkets/:id/products - Obtener productos de un supermercado
router.get('/:id/products', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, limit = 20, skip = 0 } = req.query;

    // Verificar que el supermercado existe
    const supermarket = supermarkets.find(s => s.id === id);
    if (!supermarket) {
      return res.status(404).json({
        success: false,
        message: 'Supermercado no encontrado'
      });
    }

    let query: any = { supermarket: id };

    // Filtro opcional por categoría
    if (category) {
      query.category = category;
    }

    const products = await Product
      .find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        supermarket: supermarket.name,
        products,
        pagination: {
          total,
          limit: Number(limit),
          skip: Number(skip),
          hasMore: Number(skip) + products.length < total
        }
      },
      message: 'Productos del supermercado obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error getting supermarket products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos del supermercado'
    });
  }
});

export default router;
