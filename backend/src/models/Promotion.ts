import mongoose, { Document, Schema } from 'mongoose';

export interface IPromotion extends Document {
  title: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'bundle';
  supermarket: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId; // Opcional: promoción por categoría
  products?: mongoose.Types.ObjectId[]; // Productos específicos en promoción
  discountValue: number; // Porcentaje o monto fijo
  minimumQuantity?: number; // Para promociones tipo "compre X lleve Y"
  freeQuantity?: number; // Cantidad gratis
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  bannerImage?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema = new Schema<IPromotion>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'buy_x_get_y', 'bundle'],
    required: true
  },
  supermarket: {
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumQuantity: {
    type: Number,
    min: 1
  },
  freeQuantity: {
    type: Number,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bannerImage: {
    type: String,
    trim: true
  },
  terms: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Índices
PromotionSchema.index({ supermarket: 1 });
PromotionSchema.index({ category: 1 });
PromotionSchema.index({ startDate: 1, endDate: 1 });
PromotionSchema.index({ isActive: 1 });
PromotionSchema.index({ type: 1 });

// Middleware para validar fechas
PromotionSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('La fecha de fin debe ser posterior a la fecha de inicio'));
  }
  next();
});

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);