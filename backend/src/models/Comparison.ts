import mongoose, { Document, Schema } from 'mongoose';

export interface IComparison extends Document {
  userId?: string;
  searchTerm: string;
  supermarkets: string[];
  results: Array<{
    productId: string;
    name: string;
    price: number;
    supermarket: string;
    category: string;
  }>;
  createdAt: Date;
}

const ComparisonSchema = new Schema<IComparison>({
  userId: {
    type: String,
    required: false
  },
  searchTerm: {
    type: String,
    required: true,
    trim: true
  },
  supermarkets: [{
    type: String,
    enum: ['Carrefour', 'Disco', 'Jumbo', 'Dia']
  }],
  results: [{
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    supermarket: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Índices
ComparisonSchema.index({ userId: 1, createdAt: -1 });
ComparisonSchema.index({ searchTerm: 1 });

export default mongoose.model<IComparison>('Comparison', ComparisonSchema);
