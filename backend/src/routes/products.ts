import { Router } from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/productController';

const router = Router();

// GET /api/products - Obtener lista de productos con filtros
router.get('/', getProducts);

// GET /api/products/:id - Obtener producto específico
router.get('/:id', getProductById);

// POST /api/products - Crear nuevo producto (para seeding/testing)
router.post('/', createProduct);

export default router;
