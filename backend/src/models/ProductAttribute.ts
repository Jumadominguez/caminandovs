import mongoose, { Document, Schema } from 'mongoose';

export interface IProductAttribute extends Document {
  productId: mongoose.Types.ObjectId;
  name: string; // ej: "Tamaño", "Color", "Sabor", "Peso neto"
  value: string | number | boolean;
  unit?: string; // ej: "kg", "ml", "cm"
  isPrimary: boolean; // Si es un atributo principal para variantes
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductAttributeSchema = new Schema<IProductAttribute>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  unit: {
    type: String,
    trim: true,
    maxlength: 20
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices
ProductAttributeSchema.index({ productId: 1 });
ProductAttributeSchema.index({ name: 1 });
ProductAttributeSchema.index({ isPrimary: 1 });

export default mongoose.model<IProductAttribute>('ProductAttribute', ProductAttributeSchema);