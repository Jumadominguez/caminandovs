import mongoose, { Document, Schema } from 'mongoose';

export interface ISubcategoryProcessed extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory: mongoose.Types.ObjectId; // Referencia a Category
  supermarket: mongoose.Types.ObjectId; // Referencia a Supermarket
  sortOrder: number;
  isActive: boolean;
  metadata?: {
    imageUrl?: string;
    icon?: string;
    color?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SubcategoryProcessedSchema = new Schema<ISubcategoryProcessed>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  supermarket: {
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    imageUrl: String,
    icon: String,
    color: String
  }
}, {
  timestamps: true,
  collection: 'subcategories-processed' // Nombre específico de colección
});

// Índices
SubcategoryProcessedSchema.index({ parentCategory: 1, sortOrder: 1 });
SubcategoryProcessedSchema.index({ supermarket: 1, name: 1 });
SubcategoryProcessedSchema.index({ slug: 1 }, { unique: true });
SubcategoryProcessedSchema.index({ isActive: 1 });

export default mongoose.model<ISubcategoryProcessed>('SubcategoryProcessed', SubcategoryProcessedSchema);
