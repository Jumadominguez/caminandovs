import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  supermarket: string;
  url: string;
  parentCategory?: string; // Para jerarquía de categorías
  level: number; // Nivel en la jerarquía (0 = raíz)
  hasSubcategories: boolean;
  productCount?: number;
  lastScraped?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  supermarket: {
    type: String,
    required: true,
    enum: ['Carrefour', 'Disco', 'Jumbo', 'Dia', 'Vea']
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  parentCategory: {
    type: String,
    trim: true
  },
  level: {
    type: Number,
    default: 0,
    min: 0
  },
  hasSubcategories: {
    type: Boolean,
    default: false
  },
  productCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastScraped: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
CategorySchema.index({ supermarket: 1, name: 1 });
CategorySchema.index({ supermarket: 1, level: 1 });
CategorySchema.index({ supermarket: 1, parentCategory: 1 });
CategorySchema.index({ url: 1 }, { unique: true });
CategorySchema.index({ isActive: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema);
