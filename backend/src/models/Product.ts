import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  originalPrice?: number; // Para productos en oferta
  supermarket: mongoose.Types.ObjectId; // Referencia al modelo Supermarket
  category: mongoose.Types.ObjectId; // Referencia al modelo Category
  productType?: mongoose.Types.ObjectId; // Referencia al modelo ProductType
  image?: string;
  description?: string;
  unit?: string;
  barcode?: string;
  brand?: string;
  weight?: string;
  isOnSale: boolean;
  discountPercentage?: number;
  availability: 'available' | 'out_of_stock' | 'limited';
  lastUpdated: Date;
  averageRating?: number; // Calculado desde reviews
  totalReviews?: number; // Calculado desde reviews
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
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
  productType: {
    type: Schema.Types.ObjectId,
    ref: 'ProductType'
  },
  image: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  unit: {
    type: String,
    trim: true,
    default: 'unidad',
    maxlength: 50
  },
  barcode: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true,
    maxlength: 100
  },
  weight: {
    type: String,
    trim: true,
    maxlength: 50
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
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'products-processed' // Nombre específico de colección
});

// Índices para optimización
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
ProductSchema.index({ supermarket: 1, category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ barcode: 1 }, { sparse: true });
ProductSchema.index({ isOnSale: 1 });
ProductSchema.index({ availability: 1 });
ProductSchema.index({ lastUpdated: -1 });

// Middleware para actualizar lastUpdated
ProductSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);
