import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, supermarket, limit = 20, skip = 0 } = req.query;

    let query: any = {};

    // Filtro de búsqueda por texto
    if (search) {
      query.$text = { $search: search as string };
    }

    // Filtros adicionales
    if (category) {
      query.category = category;
    }

    if (supermarket) {
      query.supermarket = supermarket;
    }

    const products = await Product
      .find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
        hasMore: Number(skip) + products.length < total
      }
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto'
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto'
    });
  }
};

// GET /api/products/search - Búsqueda avanzada de productos
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q, category, supermarket, minPrice, maxPrice, limit = 20, skip = 0 } = req.query;

    let query: any = {};

    // Búsqueda por texto
    if (q) {
      query.$text = { $search: q as string };
    }

    // Filtros
    if (category) {
      query.category = category;
    }

    if (supermarket) {
      query.supermarket = supermarket;
    }

    // Filtro de precio
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product
      .find(query)
      .sort(q ? { score: { $meta: 'textScore' } } : { price: 1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          limit: Number(limit),
          skip: Number(skip),
          hasMore: Number(skip) + products.length < total
        }
      },
      message: 'Búsqueda completada exitosamente'
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar productos'
    });
  }
};

// GET /api/products/categories - Obtener categorías disponibles
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: categories,
      message: 'Categorías obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías'
    });
  }
};

// POST /api/products/compare - Comparar productos específicos
export const compareSpecificProducts = async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren IDs de productos para comparar'
      });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron productos con los IDs proporcionados'
      });
    }

    // Organizar productos por nombre para comparación
    const comparison = products.reduce((acc: any, product) => {
      const key = product.name.toLowerCase().trim();
      if (!acc[key]) {
        acc[key] = {
          name: product.name,
          products: []
        };
      }
      acc[key].products.push({
        id: product._id,
        supermarket: product.supermarket,
        price: product.price,
        category: product.category
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: comparison,
      message: 'Comparación completada exitosamente'
    });
  } catch (error) {
    console.error('Error comparing products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al comparar productos'
    });
  }
};
