import { Router } from 'express';
import { compareProducts, getComparisonHistory, getComparisonById } from '../controllers/comparisonController';

const router = Router();

// POST /api/comparisons - Crear nueva comparación
router.post('/', compareProducts);

// GET /api/comparisons - Obtener historial de comparaciones
router.get('/', getComparisonHistory);

// GET /api/comparisons/:id - Obtener comparación específica
router.get('/:id', getComparisonById);

export default router;
