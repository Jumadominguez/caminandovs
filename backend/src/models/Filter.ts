import mongoose, { Document, Schema } from 'mongoose';

export interface IFilter extends Document {
  name: string; // ej: "Precio", "Marca", "Peso", "Tipo de producto"
  type: 'range' | 'select' | 'multiselect' | 'boolean';
  field: string; // Campo del producto al que aplica (ej: "price", "brand", "weight")
  category?: mongoose.Types.ObjectId; // Opcional: filtro específico de categoría
  supermarket?: mongoose.Types.ObjectId; // Opcional: filtro específico de supermercado
  isActive: boolean;
  sortOrder: number;
  options?: Array<{
    label: string;
    value: string | number;
    count?: number; // Cantidad de productos con este valor
  }>;
  range?: {
    min: number;
    max: number;
    step: number;
    unit?: string;
  };
  dependsOn?: mongoose.Types.ObjectId; // Filtro del que depende
  createdAt: Date;
  updatedAt: Date;
}

const FilterSchema = new Schema<IFilter>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['range', 'select', 'multiselect', 'boolean'],
    required: true
  },
  field: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  supermarket: {
    type: Schema.Types.ObjectId,
    ref: 'Supermarket'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  options: [{
    label: {
      type: String,
      required: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }],
  range: {
    min: {
      type: Number,
      required: function() { return this.type === 'range'; }
    },
    max: {
      type: Number,
      required: function() { return this.type === 'range'; }
    },
    step: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      trim: true
    }
  },
  dependsOn: {
    type: Schema.Types.ObjectId,
    ref: 'Filter'
  }
}, {
  timestamps: true,
  collection: 'filters-processed' // Nombre específico de colección
});

// Índices
FilterSchema.index({ type: 1 });
FilterSchema.index({ category: 1 });
FilterSchema.index({ supermarket: 1 });
FilterSchema.index({ isActive: 1 });
FilterSchema.index({ sortOrder: 1 });

export default mongoose.model<IFilter>('Filter', FilterSchema);