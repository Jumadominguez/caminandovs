import mongoose, { Document, Schema } from 'mongoose';

export interface IProductReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number; // 1-5 estrellas
  title?: string;
  comment?: string;
  pros?: string[]; // Aspectos positivos
  cons?: string[]; // Aspectos negativos
  verified: boolean; // Si el usuario compró el producto
  helpful: number; // Votos de "útil"
  notHelpful: number; // Votos de "no útil"
  supermarket: mongoose.Types.ObjectId; // Supermercado donde se compró
  purchaseDate?: Date;
  isActive: boolean;
  moderatedBy?: mongoose.Types.ObjectId; // Admin que moderó
  moderationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductReviewSchema = new Schema<IProductReview>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  pros: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  cons: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },
  notHelpful: {
    type: Number,
    default: 0,
    min: 0
  },
  supermarket: {
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true
  },
  purchaseDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationReason: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Índices
ProductReviewSchema.index({ productId: 1, createdAt: -1 });
ProductReviewSchema.index({ userId: 1 });
ProductReviewSchema.index({ rating: 1 });
ProductReviewSchema.index({ verified: 1 });
ProductReviewSchema.index({ isActive: 1 });

// Índice compuesto único: un usuario solo puede reseñar un producto una vez
ProductReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Método para calcular rating promedio de un producto
ProductReviewSchema.statics.getAverageRating = async function(productId: string) {
  const result = await this.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId), isActive: true } },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        verifiedReviews: { $sum: { $cond: ['$verified', 1, 0] } }
      }
    }
  ]);
  return result[0] || { averageRating: 0, totalReviews: 0, verifiedReviews: 0 };
};

export default mongoose.model<IProductReview>('ProductReview', ProductReviewSchema);