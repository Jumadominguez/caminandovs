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
