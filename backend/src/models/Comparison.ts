import mongoose, { Document, Schema } from 'mongoose';

export interface IComparison extends Document {
  userId?: mongoose.Types.ObjectId; // Referencia al modelo User
  searchTerm: string;
  supermarkets: mongoose.Types.ObjectId[]; // Referencias a Supermarket
  results: Array<{
    productId: mongoose.Types.ObjectId; // Referencia a Product
    name: string;
    price: number;
    originalPrice?: number;
    supermarket: mongoose.Types.ObjectId; // Referencia a Supermarket
    category: mongoose.Types.ObjectId; // Referencia a Category
    isOnSale: boolean;
    discountPercentage?: number;
    availability: string;
  }>;
  totalResults: number;
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  bestDeal?: mongoose.Types.ObjectId; // Mejor oferta encontrada
  createdAt: Date;
  updatedAt: Date;
}

const ComparisonSchema = new Schema<IComparison>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  searchTerm: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  supermarkets: [{
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true
  }],
  results: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 200
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    supermarket: {
      type: Schema.Types.ObjectId,
      ref: 'Supermarket',
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    isOnSale: {
      type: Boolean,
      default: false
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    availability: {
      type: String,
      enum: ['available', 'out_of_stock', 'limited'],
      default: 'available'
    }
  }],
  totalResults: {
    type: Number,
    default: 0,
    min: 0
  },
  priceRange: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    },
    average: {
      type: Number,
      min: 0
    }
  },
  bestDeal: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
}, {
  timestamps: true
});

// Índices para optimización
ComparisonSchema.index({ userId: 1, createdAt: -1 });
ComparisonSchema.index({ searchTerm: 1 });
ComparisonSchema.index({ 'priceRange.min': 1, 'priceRange.max': 1 });
ComparisonSchema.index({ createdAt: -1 });

// Middleware para calcular estadísticas
ComparisonSchema.pre('save', function(next) {
  if (this.results && this.results.length > 0) {
    this.totalResults = this.results.length;

    const prices = this.results.map(r => r.price);
    this.priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((a, b) => a + b, 0) / prices.length
    };

    // Encontrar mejor oferta (precio más bajo disponible)
    const availableResults = this.results.filter(r => r.availability === 'available');
    if (availableResults.length > 0) {
      const bestPrice = Math.min(...availableResults.map(r => r.price));
      const bestResult = availableResults.find(r => r.price === bestPrice);
      if (bestResult) {
        this.bestDeal = bestResult.productId;
      }
    }
  }
  next();
});

export default mongoose.model<IComparison>('Comparison', ComparisonSchema);
