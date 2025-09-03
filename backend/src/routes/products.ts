import { Router } from 'express';
import { getProducts, getProductById, createProduct, searchProducts, getCategories, compareSpecificProducts } from '../controllers/productController';

const router = Router();

// GET /api/products - Obtener lista de productos con filtros
router.get('/', getProducts);

// GET /api/products/search - Búsqueda avanzada de productos
router.get('/search', searchProducts);

// GET /api/products/categories - Obtener categorías disponibles
router.get('/categories', getCategories);

// POST /api/products/compare - Comparar productos específicos
router.post('/compare', compareSpecificProducts);

// GET /api/products/:id - Obtener producto específico
router.get('/:id', getProductById);

// POST /api/products - Crear nuevo producto (para seeding/testing)
router.post('/', createProduct);

export default router;
