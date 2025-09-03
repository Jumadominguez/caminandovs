import { Request, Response } from 'express';
import Product from '../models/Product';
import Comparison from '../models/Comparison';

export const compareProducts = async (req: Request, res: Response) => {
  try {
    const { searchTerm, supermarkets } = req.body;

    if (!searchTerm || !supermarkets || !Array.isArray(supermarkets)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere término de búsqueda y lista de supermercados'
      });
    }

    // Buscar productos que coincidan con el término de búsqueda
    const products = await Product.find({
      $and: [
        { supermarket: { $in: supermarkets } },
        {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      ]
    }).sort({ price: 1 });

    // Agrupar por nombre de producto para encontrar el mejor precio
    const productGroups: { [key: string]: any[] } = {};
    products.forEach(product => {
      const key = product.name.toLowerCase().trim();
      if (!productGroups[key]) {
        productGroups[key] = [];
      }
      productGroups[key].push(product);
    });

    // Encontrar el mejor precio para cada producto
    const comparisonResults = Object.values(productGroups).map(group => {
      const sortedByPrice = group.sort((a, b) => a.price - b.price);
      return {
        name: sortedByPrice[0].name,
        category: sortedByPrice[0].category,
        bestPrice: sortedByPrice[0].price,
        bestSupermarket: sortedByPrice[0].supermarket,
        allOptions: sortedByPrice.map(p => ({
          supermarket: p.supermarket,
          price: p.price,
          image: p.image
        })),
        savings: sortedByPrice.length > 1 ?
          sortedByPrice[sortedByPrice.length - 1].price - sortedByPrice[0].price : 0
      };
    });

    // Guardar la comparación (opcional, sin usuario por ahora)
    const comparison = new Comparison({
      searchTerm,
      supermarkets,
      results: comparisonResults.map(result => ({
        productId: '', // TODO: Asignar ID real cuando tengamos productos con IDs
        name: result.name,
        price: result.bestPrice,
        supermarket: result.bestSupermarket,
        category: result.category
      }))
    });

    await comparison.save();

    res.json({
      success: true,
      data: {
        searchTerm,
        supermarkets,
        results: comparisonResults,
        totalProducts: comparisonResults.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error comparing products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al comparar productos'
    });
  }
};

export const getComparisonHistory = async (req: Request, res: Response) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const comparisons = await Comparison
      .find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Comparison.countDocuments();

    res.json({
      success: true,
      data: comparisons,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
        hasMore: Number(skip) + comparisons.length < total
      }
    });
  } catch (error) {
    console.error('Error getting comparison history:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial de comparaciones'
    });
  }
};
