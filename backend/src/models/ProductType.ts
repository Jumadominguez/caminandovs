import mongoose, { Document, Schema } from 'mongoose';

export interface IProductType extends Document {
  name: string; // ej: "Lácteos", "Carnes", "Frutas", "Verduras"
  description?: string;
  icon?: string;
  color?: string; // Para UI
  isActive: boolean;
  sortOrder: number;
  parentType?: mongoose.Types.ObjectId; // Para jerarquía de tipos
  attributes: Array<{
    name: string; // ej: "Marca", "Peso", "Sabor"
    type: 'string' | 'number' | 'boolean' | 'select';
    required: boolean;
    options?: string[]; // Para selects
    unit?: string; // ej: "kg", "ml", "unidades"
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductTypeSchema = new Schema<IProductType>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true,
    maxlength: 7 // Para códigos hex como #FF5733
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  parentType: {
    type: Schema.Types.ObjectId,
    ref: 'ProductType'
  },
  attributes: [{
    name: {
      type: String,
      required: true,
      maxlength: 50
    },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'select'],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [String],
    unit: {
      type: String,
      trim: true,
      maxlength: 20
    }
  }]
}, {
  timestamps: true,
  collection: 'producttypes-processed' // Nombre específico de colección
});

// Índices
ProductTypeSchema.index({ name: 1 });
ProductTypeSchema.index({ isActive: 1 });
ProductTypeSchema.index({ sortOrder: 1 });

export default mongoose.model<IProductType>('ProductType', ProductTypeSchema);