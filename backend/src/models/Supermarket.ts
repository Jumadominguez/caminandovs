import mongoose, { Document, Schema } from 'mongoose';

export interface ISupermarket extends Document {
  name: string;
  code: string; // 'carrefour', 'disco', 'jumbo', 'dia'
  baseUrl: string;
  logo?: string;
  isActive: boolean;
  lastScraped?: Date;
  totalProducts: number;
  totalCategories: number;
  createdAt: Date;
  updatedAt: Date;
}

const SupermarketSchema = new Schema<ISupermarket>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  baseUrl: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastScraped: {
    type: Date
  },
  totalProducts: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCategories: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Índices para optimización
SupermarketSchema.index({ isActive: 1 });

export default mongoose.model<ISupermarket>('Supermarket', SupermarketSchema);