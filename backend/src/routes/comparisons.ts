import { Router } from 'express';
import { compareProducts, getComparisonHistory } from '../controllers/comparisonController';

const router = Router();

// POST /api/comparisons - Crear nueva comparación
router.post('/', compareProducts);

// GET /api/comparisons - Obtener historial de comparaciones
router.get('/', getComparisonHistory);

export default router;
