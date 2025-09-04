import mongoose, { Document, Schema } from 'mongoose';

export interface IShoppingList extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  isDefault: boolean; // Lista por defecto del usuario
  isPublic: boolean; // Si otros usuarios pueden verla
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    unit?: string;
    isCompleted: boolean;
    notes?: string;
    addedAt: Date;
  }>;
  totalEstimated: number; // Costo total estimado
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ShoppingListSchema = new Schema<IShoppingList>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.1
    },
    unit: {
      type: String,
      trim: true,
      default: 'unidad'
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalEstimated: {
    type: Number,
    default: 0,
    min: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices
ShoppingListSchema.index({ userId: 1 });
ShoppingListSchema.index({ isDefault: 1 });
ShoppingListSchema.index({ isPublic: 1 });
ShoppingListSchema.index({ 'items.productId': 1 });

// Middleware para actualizar lastModified y totalEstimated
ShoppingListSchema.pre('save', async function(next) {
  this.lastModified = new Date();

  // Calcular total estimado basado en los productos
  if (this.items && this.items.length > 0) {
    try {
      const Product = mongoose.model('Product');
      let total = 0;

      for (const item of this.items) {
        if (!item.isCompleted) {
          const product = await Product.findById(item.productId);
          if (product) {
            total += product.price * item.quantity;
          }
        }
      }

      this.totalEstimated = total;
    } catch (error) {
      console.error('Error calculando total estimado:', error);
    }
  }

  next();
});

// Método para marcar item como completado
ShoppingListSchema.methods.markItemCompleted = function(productId: string, completed: boolean = true) {
  const item = this.items.find((item: any) => item.productId.toString() === productId);
  if (item) {
    item.isCompleted = completed;
    this.lastModified = new Date();
  }
  return this.save();
};

export default mongoose.model<IShoppingList>('ShoppingList', ShoppingListSchema);