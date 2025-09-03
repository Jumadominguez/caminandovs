import { Router, Request, Response } from 'express';

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

export default router;
