import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  supermarket: string;
  category: string;
  image?: string;
  description?: string;
  unit?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  supermarket: {
    type: String,
    required: true,
    enum: ['Carrefour', 'Disco', 'Jumbo', 'Dia']
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    trim: true,
    default: 'unidad'
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
ProductSchema.index({ name: 'text', category: 'text' });
ProductSchema.index({ supermarket: 1, category: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
