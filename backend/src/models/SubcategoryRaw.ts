import mongoose, { Document, Schema } from 'mongoose';

export interface ISubcategoryRaw extends Document {
  name: string;
  url: string;
  parentCategory?: string; // Nombre de la categoría padre
  supermarket: string; // Código del supermercado
  rawData: any; // Datos crudos del scraping
  isProcessed: boolean;
  processingErrors?: string[];
  lastScraped: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubcategoryRawSchema = new Schema<ISubcategoryRaw>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
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
  supermarket: {
    type: String,
    required: true,
    trim: true
  },
  rawData: {
    type: Schema.Types.Mixed
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processingErrors: [{
    type: String,
    trim: true
  }],
  lastScraped: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'subcategories-raw' // Nombre específico de colección
});

// Índices
SubcategoryRawSchema.index({ supermarket: 1, name: 1 });
SubcategoryRawSchema.index({ url: 1 }, { unique: true });
SubcategoryRawSchema.index({ isProcessed: 1 });
SubcategoryRawSchema.index({ lastScraped: -1 });

export default mongoose.model<ISubcategoryRaw>('SubcategoryRaw', SubcategoryRawSchema);