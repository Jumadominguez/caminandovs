import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  supermarket: mongoose.Types.ObjectId; // Referencia al modelo Supermarket
  url: string;
  parentCategory?: mongoose.Types.ObjectId; // Referencia a otra Category
  level: number; // Nivel en la jerarquía (0 = raíz)
  hasSubcategories: boolean;
  productCount: number;
  lastScraped?: Date;
  isActive: boolean;
  subcategories: mongoose.Types.ObjectId[]; // Array de subcategorías
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  supermarket: {
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 5 // Máximo 5 niveles de jerarquía
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
  },
  subcategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true,
  collection: 'categories-processed' // Nombre específico de colección
});

// Índices para optimización
CategorySchema.index({ supermarket: 1, name: 1 });
CategorySchema.index({ supermarket: 1, level: 1 });
CategorySchema.index({ supermarket: 1, parentCategory: 1 });
CategorySchema.index({ url: 1 }, { unique: true });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ level: 1 });

// Middleware para actualizar hasSubcategories
CategorySchema.pre('save', async function(next) {
  if (this.subcategories && this.subcategories.length > 0) {
    this.hasSubcategories = true;
  } else {
    this.hasSubcategories = false;
  }
  next();
});

export default mongoose.model<ICategory>('Category', CategorySchema);
